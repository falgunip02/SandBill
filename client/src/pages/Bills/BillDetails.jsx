import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import './BillDetails.css';

const BillDetails = () => {
  const { billId } = useParams();
  const navigate = useNavigate();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');
  const [openPayment, setOpenPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Fetch bill details
  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/bill/${billId}`);
        setBill(response.data.data);
      } catch (err) {
        setError('Failed to load bill details');
        console.error('Error:', err.response?.data || err.message);
      }
    };
    fetchBillDetails();
  }, [billId]);

  // Add payment handler
  const handleAddPayment = async () => {
    try {
      const amount = parseFloat(paymentAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('Invalid payment amount');
      }

      const response = await axios.post(
        `http://localhost:8080/api/v1/bill/${billId}/add-payment`,
        { amount, notes: paymentNotes }
      );

      setBill(response.data.bill); // Update bill state with new data
      setPaymentAmount('');
      setPaymentNotes('');
      setOpenPayment(false);
    } catch (error) {
      console.error('Payment failed:', error.response?.data || error.message);
      alert(`Payment failed: ${error.response?.data?.message || error.message}`);
    }
  };

  // Navigation handlers
  const handleEdit = () => navigate(`/edit-bill/${billId}`);
  const handleBack = () => navigate('/viewBill');

  // Status calculation
  const getDueStatus = () => {
    if (!bill) return '';
    if (bill.status === 'Paid') return 'Paid';
    if (bill.daysOverdue > 0) return `Overdue by ${bill.daysOverdue} days`;
    const daysLeft = Math.ceil((new Date(bill.dueDate) - Date.now()) / (86400000));
    return `Due in ${daysLeft} days`;
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!bill) return <Typography>Loading...</Typography>;

  return (
    <Paper elevation={3} className="bill-details-container">
      <Box p={3}>
        <Typography variant="h5" gutterBottom>Bill Details</Typography>
        
        {/* Bill Information */}
        <div className="bill-info-section">
          <Typography variant="body1">Job No: {bill.jobNo}</Typography>
          <Typography variant="body1">Client: {bill.clientName}</Typography>
          <Typography variant="body1">Status: {bill.status}</Typography>
          <Typography variant="body1">Due Status: {getDueStatus()}</Typography>
          <Typography variant="body1">Estimate Amount: ₹{bill.estimateAmount}</Typography>
          <Typography variant="body1">Billed Amount: ₹{bill.billedAmount}</Typography>
          <Typography variant="body1">Balance: ₹{bill.balanceBillingAmount}</Typography>
        </div>

        {/* Payment History */}
        <Box mt={3} className="payment-history">
          <Typography variant="h6">Payment History</Typography>
          {bill.paymentHistory.map((payment, index) => (
            <div key={index} className="payment-item">
              <Typography variant="body2">
                ₹{payment.amount} paid on {new Date(payment.date).toLocaleDateString()}
                {payment.notes && ` - Notes: ${payment.notes}`}
              </Typography>
            </div>
          ))}
        </Box>

        {/* Payment Dialog */}
        <Dialog open={openPayment} onClose={() => setOpenPayment(false)}>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogContent>
            <TextField
              label="Payment Amount"
              type="number"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              fullWidth
              margin="normal"
              inputProps={{ min: "0.01", step: "0.01" }}
            />
            <TextField
              label="Payment Notes"
              multiline
              rows={3}
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              fullWidth
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
            <Button 
              onClick={handleAddPayment} 
              variant="contained" 
              disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
            >
              Record Payment
            </Button>
          </DialogActions>
        </Dialog>

        {/* Action Buttons */}
        <Box mt={3} className="action-buttons">
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            className="edit-button"
          >
            Edit Bill Details
          </Button>
          <Button
            variant="contained"
            onClick={() => setOpenPayment(true)}
            disabled={bill.status === 'Paid'}
            className="add-payment-button"
          >
            Add Payment
          </Button>
          <Button
            variant="outlined"
            onClick={handleBack}
            className="back-button"
          >
            Return to List
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default BillDetails;