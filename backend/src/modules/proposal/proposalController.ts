// backend/src/controllers/proposalController.ts
import { Request, Response } from "express";
import { db } from "../../model";
import { aiCompareProposals } from "../../services/aiServices";
export const compareProposals = async (req: Request, res: Response) => {
  try {
    const { rfpId } = req.body;
    console.log("========",rfpId);
    

    const proposals = await db.Proposal.findAll({
      where: { rfpId },
      include: [{ model: db.Vendor, as: "vendor" }],
    });

     if (!proposals.length) {
      console.log("No proposals found for RFP ID:", rfpId);
      return res.status(200).json({ message: "No proposals for the items" });
    }

    // Prepare clean data for AI
    const formatted = proposals.map((p:any) => ({
      vendorName: p.vendor?.name,
      vendorEmail: p.vendor?.email,
      ...p.parsedData,
    }));
console.log("----------",formatted);
 if (formatted.length === 1) {
      const single = formatted[0];
      return res.json({
        formatted,
        recommendation: {
          recommendedVendor: single.vendorName,
          reason: "Only one vendor proposal is available.",
          score: 100,
        },
      });
    }

    const aiResult = await aiCompareProposals(formatted);

    return res.json({
       formatted,
      recommendation: aiResult,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to compare proposals" });
  }
};
