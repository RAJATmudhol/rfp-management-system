import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Box
} from "@mui/material";

export default function Proposal() {
  const location = useLocation();
  const rfpId = location.state?.rfpId;
  const [proposals, setProposals] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (rfpId) {
      fetchProposals(rfpId);
    } else {
      setError("No RFP ID provided.");
      setLoading(false);
    }
  }, [rfpId]);

  async function fetchProposals(rfpId) {
    try {
      const res = await axios.post("/api/proposals/getall", { rfpId });
      const data = res.data;
      setProposals(data.formatted || []);
      setRecommendation(data.recommendation || null);
    } catch (err) {
      setError("Failed to fetch proposals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p>Loading proposals...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Proposals</h1>

    
      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vendor Name</TableCell>
              <TableCell>Vendor Email</TableCell>
              <TableCell>Prices</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Payment Terms</TableCell>
              <TableCell>Warranty</TableCell>
              <TableCell>Delivery Days</TableCell>
              <TableCell>Conditions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proposals.map((proposal, index) => (
              <TableRow key={index}>
                <TableCell>{proposal.vendorName}</TableCell>
                <TableCell>{proposal.vendorEmail}</TableCell>
                <TableCell>
                  {proposal.prices.map((price, i) => `${price.item}: ${price.price}`).join(", ")}
                </TableCell>
                <TableCell>{proposal.totalPrice}</TableCell>
                <TableCell>{proposal.paymentTerms}</TableCell>
                <TableCell>{proposal.warranty}</TableCell>
                <TableCell>{proposal.deliveryDays}</TableCell>
                <TableCell>{proposal.conditions}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

   
      {recommendation && (
        <Box className="bg-green-100 p-4 rounded-lg shadow-md">
          <Typography variant="h6" className="font-semibold mb-2">
            Recommendation
          </Typography>
          <Typography><strong>Recommended Vendor:</strong> {recommendation.recommendedVendor}</Typography>
          <Typography><strong>Reason:</strong> {recommendation.reason}</Typography>
          <Typography><strong>Score:</strong> {recommendation.score}</Typography>
        </Box>
      )}
    </div>
  );
}
