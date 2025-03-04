import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Paper, 
  Box, 
  Typography,
  Avatar,
  MenuItem
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useNavigate } from 'react-router-dom';
import './CreateClients.css';

const CreateClients = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    clientName: '',
    assignedPerson: '',
    clientLocation: '',
    clientWebsite: ''
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
        const response = await fetch('http://localhost:8080/api/v1/users/list');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        setErrors(prev => ({ ...prev, submit: 'Failed to load users' }));
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      newErrors.clientName = 'Client Name is required';
    }
    if (!formData.assignedPerson) {
      newErrors.assignedPerson = 'Assigned Person is required';
    }
    if (!clientPhoto) {
      newErrors.clientPhoto = 'Client Logo is required';


    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate before submitting
    if (!validateForm()) return;
  
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.clientName); 
    formDataToSend.append("assignedPerson", formData.assignedPerson);
    formDataToSend.append("location", formData.clientLocation);
    if (formData.clientWebsite) formDataToSend.append("website", formData.clientWebsite);
    if (clientPhoto) formDataToSend.append("logo", clientPhoto); 
  
    try {
      const response = await fetch("http://localhost:8080/api/v1/clients/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");
  
      console.log("Client registered:", data);
    } catch (error) {
      console.error("Error:", error);
      setErrors(prev => ({ ...prev, submit: error.message }));
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
              {errors.clientPhoto && (
                <Typography color="error" variant="caption" display="block" mt={1}>
                  {errors.clientPhoto}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Client Name Field */}
          <Box>
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
          </Box>

          {/* Assigned Person Field */}
          <Box>
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
          </Box>

          {/* Client Location Field */}
          <Box>
            <TextField
              fullWidth
              label="Client Location"
              name="clientLocation"
              value={formData.clientLocation}
              onChange={handleChange}
            />
          </Box>

          {/* Client Website Field */}
          <Box>
            <TextField
              fullWidth
              label="Client Website"
              name="clientWebsite"
              value={formData.clientWebsite}
              onChange={handleChange}
            />
          </Box>

          {/* Error Message */}
          {errors.submit && (
            <Box textAlign="center">
              <Typography color="error" align="center">
                {errors.submit}
              </Typography>
            </Box>
          )}

          {/* Submit Button */}
          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              size="large"
            >
              {loading ? 'Creating...' : 'Create Client'}
            </Button>
          </Box>
        </Box>
      </form>
    </Paper>
  );
};
export default CreateClients;