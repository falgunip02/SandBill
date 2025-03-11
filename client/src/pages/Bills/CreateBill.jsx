import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Paper, TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './CreateBill.css';

const CreateBill = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    jobNo: '',
    estimateDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
    client: '',
    clientName: '',
    narration: '',
    estimateAmount: '',
    poStatus: '',
    status: '',
    taxInvoiceDate: new Date().toISOString().split('T')[0],
    billedAmount: '',
    balanceBillingAmount: '',
    billingDate: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    paymentStatus: 'Not Started',
    daysOverdue: 0,
    paymentHistory: [],
    remindersSent: []
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

  // Calculate due date (30 days from billing date by default)
  const handleBillingDateChange = (date) => {
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    
    setFormData(prev => ({
      ...prev,
      billingDate: date,
      dueDate: dueDate
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Convert dates to ISO strings
    const payload = {
      ...formData,
      estimateDate: new Date(formData.estimateDate).toISOString(),
      taxInvoiceDate: new Date(formData.taxInvoiceDate).toISOString(),
      billingDate: formData.billingDate.toISOString(),
      dueDate: formData.dueDate.toISOString()
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/bill/bills', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Bill created successfully:', response.data);
        const { _id: billId } = response.data.data;
        navigate(`/bills/${billId}`);
      } else {
        setError('Failed to create bill');
        console.error('Error response:', response);
      }
    } catch (err) {
      setError('Failed to create bill');
      console.error('Error:', err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
            {/* Estimate Date */}
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
            {/* Tax Invoice Date */}
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
            <DatePicker
              label="Billing Date"
              value={formData.billingDate}
              onChange={handleBillingDateChange}
              renderInput={(params) => <TextField {...params} required />}
            />
            <DatePicker
              label="Due Date"
              value={formData.dueDate}
              onChange={(newValue) => {
                const dateValue = newValue instanceof Date ? newValue : new Date(newValue);
                setFormData(prev => ({
                  ...prev,
                  dueDate: dateValue
                }));
              }}
              slots={{
                textField: (params) => <TextField {...params} />
              }}
            />
            <TextField
              select
              fullWidth
              label="Payment Status"
              name="paymentStatus"
              value={formData.paymentStatus}
              disabled
            >
              <MenuItem value="Not Started">Not Started</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            {formData.daysOverdue > 0 && (
              <Typography color="error">
                Bill is overdue by {formData.daysOverdue} days
              </Typography>
            )}
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
    </LocalizationProvider>
  );
};

export default CreateBill;