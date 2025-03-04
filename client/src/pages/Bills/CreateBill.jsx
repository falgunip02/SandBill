import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './CreateBill.css';

const CreateBill = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobNo: '',
    estimateDate: '',
    client: '',
    clientName: '',
    narration: '',
    estimateAmount: '',
    poStatus: '',
    status: '',
    taxInvoiceDate: '',
    billedAmount: '',
    balanceBillingAmount: '',
    billingDate: '',
  });
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch clients for dropdown
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/clients');
        setClients(response.data.data);
      } catch (error) {
        setError('Failed to load clients');
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Auto-fill balanceBillingAmount based on estimateAmount and billedAmount
    if (name === 'estimateAmount' || name === 'billedAmount') {
      const estimateAmount = name === 'estimateAmount' ? parseFloat(value) : parseFloat(formData.estimateAmount);
      const billedAmount = name === 'billedAmount' ? parseFloat(value) : parseFloat(formData.billedAmount);
      const balanceBillingAmount = estimateAmount - billedAmount;
      setFormData((prevState) => ({
        ...prevState,
        balanceBillingAmount: balanceBillingAmount >= 0 ? balanceBillingAmount : 0,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/v1/bill/bills', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Bill created successfully:', response.data);
        navigate('/bills');
      } else {
        setError('Failed to create bill');
      }
    } catch (err) {
      setError('Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper className="create-bill-form" elevation={3}>
      <Typography variant="h5" gutterBottom align="center">
        Create New Bill
      </Typography>

      {error && <Typography color="error" align="center">{error}</Typography>}

      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={3}>
          <TextField
            fullWidth
            label="Job No"
            name="jobNo"
            value={formData.jobNo}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            type="date"
            label="Estimate Date"
            name="estimateDate"
            value={formData.estimateDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            select
            fullWidth
            label="Client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
          >
            {clients.map((client) => (
              <MenuItem key={client._id} value={client._id}>
                {client.clientName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Client Name"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Narration"
            name="narration"
            value={formData.narration}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            type="number"
            label="Estimate Amount"
            name="estimateAmount"
            value={formData.estimateAmount}
            onChange={handleChange}
            required
          />
          <TextField
            select
            fullWidth
            label="PO Status"
            name="poStatus"
            value={formData.poStatus}
            onChange={handleChange}
            required
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            type="date"
            label="Tax Invoice Date"
            name="taxInvoiceDate"
            value={formData.taxInvoiceDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            type="number"
            label="Billed Amount"
            name="billedAmount"
            value={formData.billedAmount}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            type="number"
            label="Balance Billing Amount"
            name="balanceBillingAmount"
            value={formData.balanceBillingAmount}
            onChange={handleChange}
            required
            InputProps={{ readOnly: true }}
          />
          <TextField
            fullWidth
            type="date"
            label="Billing Date"
            name="billingDate"
            value={formData.billingDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            size="large"
          >
            {loading ? 'Creating...' : 'Create Bill'}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default CreateBill;