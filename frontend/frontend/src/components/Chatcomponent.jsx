import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Select,
  MenuItem,
  ListItemText,
  Button,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
export default function RFPChat() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [rfps, setRfps] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedRfp, setSelectedRfp] = useState(null);
  const [selectedVendors, setSelectedVendors] = useState([]);

  useEffect(() => {
    fetchRfps();
    fetchVendors();
  }, []);


  const handleCreateRFP = async () => {
    if (!input.trim()) return;
    setCreating(true);
    setError("");

    try {
      await axios.post("/api/rfps/create", { input });
      alert("RFP created successfully!");
      setInput("");
      fetchRfps();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create RFP");
    } finally {
      setCreating(false);
    }
  };

  const fetchRfps = async () => {
    try {
      const res = await axios.post("/api/rfps/getall", {});
      setRfps(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch RFPs");
    }
  };


  const fetchVendors = async () => {
    try {
      const res = await axios.post("/api/vendors/getall", {});
      setVendors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRfpSelect = (rfpId) => {
    setSelectedRfp(rfpId);
  };

  const handleVendorChange = (event) => {
    const values = event.target.value.map((v) => v.toString());
    setSelectedVendors(values);
  };

  const handleSendToVendors = async () => {
    if (!selectedRfp) {
      alert("Please select an RFP first.");
      return;
    }
    if (selectedVendors.length === 0) {
      alert("Please select at least one vendor.");
      return;
    }

    try {
      await axios.post("/api/rfps/sendProposalTovendor", {
        rfpId: selectedRfp,
        vendorIds: selectedVendors,
      });
      alert("RFP sent successfully!");
      console.log("Send Response:", { rfpId: selectedRfp, vendorIds: selectedVendors });
    } catch (err) {
      console.error(err);
      alert("Failed to send RFP");
    }
  };


  const handleProposalClick = (rfpId) => {
    navigate("/proposals", { state: { rfpId } });
  };
 const addvendors = () => {
    navigate("/addvendors");
  };
  return (
    <div>
      <Button variant="contained" endIcon={<SendIcon />} onClick={addvendors}>
     Add vendors 
</Button>
     
    <div className="bg-blue-50 p-6 rounded-lg shadow-md">
     
      <div className="flex items-start gap-4 w-full mb-6">
        <div className="w-1/2">
          <h3 className="text-xl font-semibold mb-2">Create RFP via Chat</h3>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border rounded-md resize-none h-40"
          />
        </div>
        <div className="flex flex-col justify-start">
          <Button variant="contained" color="success"
            className="px-6 py-3 bg-blue-600 text-white rounded-md"
            onClick={handleCreateRFP}
            disabled={creating}
          >
            {creating ? "Creating..." : "Create RFP"}
           </Button>
        </div>
      </div>

      {error && <p className="mt-2 text-red-500">{error}</p>}

      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-lg font-semibold">All RFPs</h4>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Budget</TableCell>
                <TableCell>Delivery Days</TableCell>
                <TableCell>Payment Terms</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rfps.map((rfp) => (
                <TableRow key={rfp.id || rfp._id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRfp === (rfp.id || rfp._id)}
                      onChange={() => handleRfpSelect(rfp.id || rfp._id)}
                    />
                  </TableCell>
                  <TableCell>{rfp.id || rfp._id}</TableCell>
                  <TableCell>{rfp.description}</TableCell>
                  <TableCell>{rfp.budget}</TableCell>
                  <TableCell>{rfp.deliveryDays}</TableCell>
                  <TableCell>{rfp.paymentTerms}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleProposalClick(rfp.id || rfp._id)}
                    >
                      Proposal
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div style={{ display: "flex", justifyContent: "flex-end", padding: "16px" }}>
            <Select
              multiple
              value={selectedVendors}
              onChange={handleVendorChange}
              renderValue={(selected) =>
                vendors
                  .filter((v) => selected.includes(v.id.toString()))
                  .map((v) => v.name)
                  .join(", ")
              }
              style={{ minWidth: 200, marginRight: "16px" }}
            >
              {vendors.map((vendor) => (
                <MenuItem key={vendor.id} value={vendor.id.toString()}>
                  <Checkbox checked={selectedVendors.includes(vendor.id.toString())} />
                  <ListItemText primary={vendor.name} />
                </MenuItem>
              ))}
            </Select>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSendToVendors}
              disabled={!selectedRfp || selectedVendors.length === 0}
            >
              Send
            </Button>
          </div>
        </TableContainer>
      </div>
    </div>
    </div>
  );
}
