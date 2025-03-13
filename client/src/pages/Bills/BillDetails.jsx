// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Paper, Typography, Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
// import './BillDetails.css';

// const BillDetails = () => {
//   const { billId } = useParams();
//   const navigate = useNavigate();
//   const [bill, setBill] = useState(null);
//   const [error, setError] = useState('');
//   const [openPayment, setOpenPayment] = useState(false);
//   const [paymentAmount, setPaymentAmount] = useState('');
//   const [paymentNotes, setPaymentNotes] = useState('');

//   // Fetch bill details
//   useEffect(() => {
//     const fetchBillDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:8080/api/v1/bill/${billId}`);
//         setBill(response.data.data);
//       } catch (err) {
//         setError('Failed to load bill details');
//         console.error('Error:', err.response?.data || err.message);
//       }
//     };
//     fetchBillDetails();
//   }, [billId]);

//   // Add payment handler
//   const handleAddPayment = async () => {
//     try {
//       const amount = parseFloat(paymentAmount);
//       if (isNaN(amount) || amount <= 0) {
//         throw new Error('Invalid payment amount');
//       }

//       const response = await axios.post(
//         `http://localhost:8080/api/v1/bill/${billId}/add-payment`,
//         { amount, notes: paymentNotes }
//       );

//       setBill(response.data.bill); // Update bill state with new data
//       setPaymentAmount('');
//       setPaymentNotes('');
//       setOpenPayment(false);
//     } catch (error) {
//       console.error('Payment failed:', error.response?.data || error.message);
//       alert(`Payment failed: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   // Navigation handlers
//   const handleEdit = () => navigate(`/edit-bill/${billId}`);
//   const handleBack = () => navigate('/viewBill');

//   // Status calculation
//   const getDueStatus = () => {
//     if (!bill) return '';
//     if (bill.status === 'Paid') return 'Paid';
//     if (bill.daysOverdue > 0) return `Overdue by ${bill.daysOverdue} days`;
//     const daysLeft = Math.ceil((new Date(bill.dueDate) - Date.now()) / (86400000));
//     return `Due in ${daysLeft} days`;
//   };

//   if (error) return <Typography color="error">{error}</Typography>;
//   if (!bill) return <Typography>Loading...</Typography>;

//   return (
//     <Paper elevation={3} className="bill-details-container">
//       <Box p={3}>
//         <Typography variant="h5" gutterBottom>Bill Details</Typography>
        
//         {/* Bill Information */}
//         <div className="bill-info-section">
//           <Typography variant="body1">Job No: {bill.jobNo}</Typography>
//           <Typography variant="body1">Client: {bill.clientName}</Typography>
//           <Typography variant="body1">Status: {bill.status}</Typography>
//           <Typography variant="body1">Due Status: {getDueStatus()}</Typography>
//           <Typography variant="body1">Estimate Amount: ₹{bill.estimateAmount}</Typography>
//           <Typography variant="body1">Billed Amount: ₹{bill.billedAmount}</Typography>
//           <Typography variant="body1">Balance: ₹{bill.balanceBillingAmount}</Typography>
//         </div>

//         {/* Payment History */}
//         <Box mt={3} className="payment-history">
//           <Typography variant="h6">Payment History</Typography>
//           {bill.paymentHistory.map((payment, index) => (
//             <div key={index} className="payment-item">
//               <Typography variant="body2">
//                 ₹{payment.amount} paid on {new Date(payment.date).toLocaleDateString()}
//                 {payment.notes && ` - Notes: ${payment.notes}`}
//               </Typography>
//             </div>
//           ))}
//         </Box>

//         {/* Payment Dialog */}
//         <Dialog open={openPayment} onClose={() => setOpenPayment(false)}>
//           <DialogTitle>Record Payment</DialogTitle>
//           <DialogContent>
//             <TextField
//               label="Payment Amount"
//               type="number"
//               value={paymentAmount}
//               onChange={(e) => setPaymentAmount(e.target.value)}
//               fullWidth
//               margin="normal"
//               inputProps={{ min: "0.01", step: "0.01" }}
//             />
//             <TextField
//               label="Payment Notes"
//               multiline
//               rows={3}
//               value={paymentNotes}
//               onChange={(e) => setPaymentNotes(e.target.value)}
//               fullWidth
//               margin="normal"
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenPayment(false)}>Cancel</Button>
//             <Button 
//               onClick={handleAddPayment} 
//               variant="contained" 
//               disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
//             >
//               Record Payment
//             </Button>
//           </DialogActions>
//         </Dialog>

//         {/* Action Buttons */}
//         <Box mt={3} className="action-buttons">
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleEdit}
//             className="edit-button"
//           >
//             Edit Bill Details
//           </Button>
//           <Button
//             variant="contained"
//             onClick={() => setOpenPayment(true)}
//             disabled={bill.status === 'Paid'}
//             className="add-payment-button"
//           >
//             Add Payment
//           </Button>
//           <Button
//             variant="outlined"
//             onClick={handleBack}
//             className="back-button"
//           >
//             Return to List
//           </Button>
//         </Box>
//       </Box>
//     </Paper>
//   );
// };

// export default BillDetails;




import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
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
  const handleBack = () => navigate('/ViewBill');

  // Status calculation
  const getDueStatus = () => {
    if (!bill) return '';
    if (bill.status === 'Paid') return 'Paid';
    if (bill.daysOverdue > 0) return `Overdue by ${bill.daysOverdue} days`;
    const daysLeft = Math.ceil((new Date(bill.dueDate) - Date.now()) / (86400000));
    return `Due in ${daysLeft} days`;
  };

  // Calculate status class
  const getStatusClass = () => {
    if (!bill) return '';
    if (bill.status === 'Paid') return 'status-paid';
    if (bill.daysOverdue > 0) return 'status-overdue';
    return 'status-pending';
  };

  if (error) return <div className="error-container">{error}</div>;
  if (!bill) return <div className="loading-container">Loading...</div>;

  return (
    <div className="bill-details-container">
      <div className="bill-header">
        <h1 className="bill-title">Bill Details</h1>
        <div className="status-indicator">
          <span className={`status-badge ${getStatusClass()}`}>
            {getDueStatus()}
          </span>
        </div>
      </div>
      
      {/* Bill Summary */}
      <div className="bill-summary">
        <div className="summary-item">
          <div className="summary-label">Job No</div>
          <div className="summary-value">{bill.jobNo}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Client</div>
          <div className="summary-value">{bill.clientName}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Status</div>
          <div className="summary-value">{bill.status}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Estimate Amount</div>
          <div className="summary-value">₹{bill.estimateAmount.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Billed Amount</div>
          <div className="summary-value">₹{bill.billedAmount.toFixed(2)}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">Balance</div>
          <div className="summary-value">₹{bill.balanceBillingAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Payment History */}
      <div className="payment-history">
        <h2 className="payment-history-title">Payment History</h2>
        {bill.paymentHistory && bill.paymentHistory.length > 0 ? (
          <div className="payment-list">
            {bill.paymentHistory.map((payment, index) => (
              <div key={index} className="payment-item">
                <div>
                  <div className="payment-amount">₹{payment.amount.toFixed(2)}</div>
                  {payment.notes && <div className="payment-notes">{payment.notes}</div>}
                </div>
                <div className="payment-date">
                  {new Date(payment.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-payments">No payment records found.</div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-button edit-button" onClick={handleEdit}>
          Edit Bill Details
        </button>
        <button 
          className="action-button add-payment-button" 
          onClick={() => setOpenPayment(true)}
          disabled={bill.status === 'Paid'}
        >
          Add Payment
        </button>
        <button className="action-button back-button" onClick={handleBack}>
          Return to List
        </button>
      </div>

      {/* Payment Dialog */}
      {openPayment && (
        <div className="dialog-overlay" onClick={() => setOpenPayment(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h2 className="dialog-title">Record Payment</h2>
            <div className="dialog-content">
              <div className="form-group">
                <label className="form-label" htmlFor="payment-amount">Payment Amount</label>
                <input
                  id="payment-amount"
                  type="number"
                  className="form-input"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="payment-notes">Payment Notes</label>
                <textarea
                  id="payment-notes"
                  className="form-input form-textarea"
                  value={paymentNotes}
                  onChange={e => setPaymentNotes(e.target.value)}
                  placeholder="Add notes (optional)"
                />
              </div>
            </div>
            <div className="dialog-actions">
              <button 
                className="action-button back-button" 
                onClick={() => setOpenPayment(false)}
              >
                Cancel
              </button>
              <button
                className="action-button add-payment-button"
                onClick={handleAddPayment}
                disabled={!paymentAmount || parseFloat(paymentAmount) <= 0}
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillDetails;
