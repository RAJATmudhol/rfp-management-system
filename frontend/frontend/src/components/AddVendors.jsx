import React, { useState, useEffect } from "react";
import axios from "axios";
import { TextField, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

export default function AddVendors() {
  const [vendorData, setVendorData] = useState({
   
    name: "",
    email: "",
    contactInfo: "",
  });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleChange = (e) => {
    setVendorData({ ...vendorData, [e.target.name]: e.target.value });
  };

  const handleCreateVendor = async () => {
    const {  name, email, contactInfo } = vendorData;
    if ( !name || !email || !contactInfo) {
      setError("All fields are required");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/vendors/create", vendorData);
      alert("Vendor created successfully!");
      setVendorData({ name: "", email: "", contactInfo: "" });
      fetchVendors();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create vendor");
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.post("/api/vendors/getall", {});
      setVendors(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch vendors");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Vendor Management</h2>

      <div className="flex gap-4 mb-6">
        {/* <TextField
          label="ID"
          name="id"
          value={vendorData.id}
          onChange={handleChange}
          variant="outlined"
        /> */}
        <TextField
          label="Name"
          name="name"
          value={vendorData.name}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          label="Email"
          name="email"
          value={vendorData.email}
          onChange={handleChange}
          variant="outlined"
        />
        <TextField
          label="Contact Info"
          name="contactInfo"
          value={vendorData.contactInfo}
          onChange={handleChange}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateVendor}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Vendor"}
        </Button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h3 className="text-lg font-semibold mb-2">All Vendors</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Info</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id || vendor._id}>
                <TableCell>{vendor.id}</TableCell>
                <TableCell>{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.contactInfo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
