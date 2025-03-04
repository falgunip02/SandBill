import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './ClientDetails.css';

const ClientDetails = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClientDetails();
  }, [id]);

  const fetchClientDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/clients/${id}`);
      if (!response.ok) throw new Error('Failed to fetch client details');
      const data = await response.json();
      setClient(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!client) return <Typography>No client found</Typography>;

  return (
    <Paper className="client-details">
      <Box className="header">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/viewClients')}
        >
          Back to Clients
        </Button>
      </Box>

      <Typography variant="h4" gutterBottom>
        Client Details
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box className="detail-section">
            <Typography variant="subtitle1" color="textSecondary">
              Client Name
            </Typography>
            <Typography variant="h6">
              {client.clientName}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="detail-section">
            <Typography variant="subtitle1" color="textSecondary">
              Location
            </Typography>
            <Typography variant="h6">
              {client.clientLocation || 'Not specified'}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="detail-section">
            <Typography variant="subtitle1" color="textSecondary">
              Website
            </Typography>
            <Typography variant="h6">
              {client.clientWebsite ? (
                <a href={client.clientWebsite} target="_blank" rel="noopener noreferrer">
                  {client.clientWebsite}
                </a>
              ) : (
                'Not specified'
              )}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box className="detail-section">
            <Typography variant="subtitle1" color="textSecondary">
              Assigned Person
            </Typography>
            <Typography variant="h6">
              {client.assignedPerson ? (
                <>
                  {client.assignedPerson.name}
                  <Typography variant="body2" color="textSecondary">
                    {client.assignedPerson.email}
                  </Typography>
                </>
              ) : (
                'Not assigned'
              )}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box className="detail-section">
            <Typography variant="subtitle1" color="textSecondary">
              Created At
            </Typography>
            <Typography variant="h6">
              {new Date(client.createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Box className="actions" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/bills/create/${client._id}`)}
        >
          Create New Bill
        </Button>
      </Box>
    </Paper>
  );
};

export default ClientDetails; 