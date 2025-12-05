import { Request, Response } from 'express';
import express from 'express';
import {db} from '../../model'
import { parseRFP } from '../../services/aiServices';
import { sendRFP } from '../../services/emailServices';

const app =express()

export const createsrfc = async (req: Request, res: Response) => {
  try {
    const { input } = req.body;
    // console.log("000000000000",rfpData);
    const rfpData = await parseRFP(input);  
    console.log("000000000000",rfpData);
    
    const rfp = await db.Rfc.create(rfpData);
    res.status(201).json(rfp); 
  } catch (error) {
    console.error('Error creating RFP:', error);
    res.status(500).json({ error: 'Failed to create RFP' });
  }
};



export const sendRFPToVendors = async (req: Request, res: Response) => {
  try {
    const { rfpId, vendorIds } = req.body;

    if (!rfpId || !vendorIds?.length) {
      return res.status(400).json({ error: "rfpId and vendorIds required" });
    }  
    const rfp = await db.Rfc.findByPk(rfpId);
    if (!rfp) return res.status(404).json({ error: "RFP not found" });

    const vendors = await db.Vendor.findAll({
      where: { id: vendorIds }
    });
    
    for (const vendor of vendors) {
      await sendRFP(vendor.email, rfp);
    }
    res.json({ message: "RFP sent successfully", vendors: vendors.length });
  } catch (error) {
    console.error("Error sending RFP:", error);
    res.status(500).json({ error: "Unable to send RFP" });
  }
};

export const getRFP = async (req: Request, res: Response) => {
  try {
    const rfp = await db.Rfc.findAll();
    res.status(201).json(rfp); 
  } catch (error) {
    console.error('Error FETCHING RFP:', error);
    res.status(500).json({ error: 'Failed to Fetch RFP' });
  }
};


export default app