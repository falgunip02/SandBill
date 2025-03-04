import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Typography,
  Box,
  Tooltip
} from '@mui/material';
import { 
  Add as AddIcon, 
  Visibility as ViewIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ViewClients.css';

const ViewClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/clients');
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBill = (clientId) => {
    navigate(`/bills/create/${clientId}`);
  };

  const handleViewDetails = (clientId) => {
    navigate(`/viewClients/${clientId}`);
  };

  if (loading) return <div className="loading">Loading clients...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="view-clients">
      <Box className="header">
        <Box display="flex" alignItems="center" gap={2}>
          <Tooltip title="Go to Overview">
            <IconButton 
              onClick={() => navigate('/dashboard')} 
              color="primary"
            >
              <HomeIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h5">Clients</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/clients/create')}
        >
          Add New Client
        </Button>
      </Box>

      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Website</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client._id} hover>
                <TableCell>{client.clientName}</TableCell>
                <TableCell>{client.clientLocation}</TableCell>
                <TableCell>
                  {client.clientWebsite ? (
                    <a href={client.clientWebsite} target="_blank" rel="noopener noreferrer">
                      {client.clientWebsite}
                    </a>
                  ) : (
                    '-'
                  )}
                </TableCell>
                <TableCell>
                  {client.assignedPerson?.name || 'Not Assigned'}
                </TableCell>
                <TableCell align="center">
                  <Box className="action-buttons">
                    <Tooltip title="View Details">
                      <IconButton
                        onClick={() => handleViewDetails(client._id)}
                        color="primary"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleCreateBill(client._id)}
                    >
                      Create Bill
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default ViewClients; 