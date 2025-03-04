import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Avatar,
  MenuItem,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useNavigate } from "react-router-dom";
import "./CreateClients.css";

const CreateClients = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: "",
    assignedPerson: "",
    clientLocation: "",
    clientWebsite: "",
    estimateAmount: "",
    estimateDate: "",
    jobNumber: "",
  });
  const [clientPhoto, setClientPhoto] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch users for dropdown
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/users/list");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        setErrors((prev) => ({ ...prev, submit: "Failed to load users" }));
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setClientPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client Name is required";
    }
    if (!formData.assignedPerson) {
      newErrors.assignedPerson = "Assigned Person is required";
    }
    if (!formData.estimateAmount.trim()) {
      newErrors.estimateAmount = "Estimate Amount is required";
    }
    if (!formData.estimateDate.trim()) {
      newErrors.estimateDate = "Estimate Date is required";
    }
    if (!formData.jobNumber.trim()) {
      newErrors.jobNumber = "Job Number is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("clientName", formData.clientName);
      formDataToSend.append("assignedPerson", formData.assignedPerson);
      formDataToSend.append("clientLocation", formData.clientLocation);
      formDataToSend.append("clientWebsite", formData.clientWebsite);
      formDataToSend.append("estimateAmount", formData.estimateAmount);
      formDataToSend.append("estimateDate", formData.estimateDate);
      formDataToSend.append("jobNumber", formData.jobNumber);
      if (clientPhoto) {
        formDataToSend.append("clientPhoto", clientPhoto);
      }

      const response = await fetch(
        "http://localhost:5000/api/v1/clients/register",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create client");
      }

      const data = await response.json();
      console.log("Client created successfully:", data);

      // Reset form and navigate
      setFormData({
        clientName: "",
        assignedPerson: "",
        clientLocation: "",
        clientWebsite: "",
        estimateAmount: "",
        estimateDate: "",
        jobNumber: "",
      });
      setClientPhoto(null);
      setPreviewLogo(null);
      navigate("/clients");
    } catch (error) {
      setErrors((prev) => ({ ...prev, submit: error.message }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="create-client-form" elevation={3}>
      <Typography variant="h5" gutterBottom align="center">
        Create New Client
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
          {/* Logo Upload Section */}
          <Box textAlign="center">
            <Box className="logo-upload-container">
              <input
                accept="image/*"
                type="file"
                id="logo-upload"
                hidden
                onChange={handleLogoChange}
              />
              <label htmlFor="logo-upload">
                <Box className="logo-preview-box">
                  {previewLogo ? (
                    <Avatar
                      src={previewLogo}
                      alt="Client Logo"
                      sx={{ width: 100, height: 100 }}
                    />
                  ) : (
                    <Box className="upload-placeholder">
                      <CloudUploadIcon sx={{ fontSize: 40 }} />
                      <Typography variant="body2">
                        Upload Client Logo
                      </Typography>
                    </Box>
                  )}
                </Box>
              </label>
            </Box>
          </Box>

          {/* Client Name Field */}
          <TextField
            fullWidth
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            error={!!errors.clientName}
            helperText={errors.clientName}
            required
          />

          {/* Assigned Person Field */}
          <TextField
            select
            fullWidth
            label="Assigned Person"
            name="assignedPerson"
            value={formData.assignedPerson}
            onChange={handleChange}
            error={!!errors.assignedPerson}
            helperText={errors.assignedPerson}
            required
          >
            {users.map((user) => (
              <MenuItem key={user.value} value={user.value}>
                {user.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Estimate Amount Field */}
          <TextField
            fullWidth
            label="Estimate Amount"
            name="estimateAmount"
            value={formData.estimateAmount}
            onChange={handleChange}
            error={!!errors.estimateAmount}
            helperText={errors.estimateAmount}
            required
          />

          {/* Estimate Date Field */}
          <TextField
            fullWidth
            label="Estimate Date"
            name="estimateDate"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={formData.estimateDate}
            onChange={handleChange}
            error={!!errors.estimateDate}
            helperText={errors.estimateDate}
            required
          />

          {/* Job Number Field */}
          <TextField
            fullWidth
            label="Job Number"
            name="jobNumber"
            value={formData.jobNumber}
            onChange={handleChange}
            error={!!errors.jobNumber}
            helperText={errors.jobNumber}
            required
          />

          {/* Error Message */}
          {errors.submit && (
            <Typography color="error" align="center">
              {errors.submit}
            </Typography>
          )}

          {/* Submit Button */}
          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} size="large">
            {loading ? "Creating..." : "Create Client"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreateClients;
