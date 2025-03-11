import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Box, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Update the calculateBalance function to be more robust
const calculateBalance = (estimate, billed) => {
    const estimateAmount = parseFloat(estimate) || 0;
    const billedAmount = parseFloat(billed) || 0;
    const balance = Math.max(0, estimateAmount - billedAmount);
    return Number(balance.toFixed(2));
};

const EditBill = () => {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/bill/${billId}`);
                setBill(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (billId) {
            fetchBill();
        }
    }, [billId]);

    const parseDateSafe = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? null : date;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBill((prev) => {
            const updatedBill = {
                ...prev,
                [name]: value,
            };



            // In your handleChange function
if (name === 'estimateAmount' || name === 'billedAmount') {
    // ... existing balance calculation ...
    const estimate = name === 'estimateAmount' ? value : prev.estimateAmount;
    const billed = name === 'billedAmount' ? value : prev.billedAmount;
    const balance = calculateBalance(estimate, billed);
    
    updatedBill.balanceBillingAmount = balance;
  
    // Update payment status based on backend enum
    if (balance === 0) {
      updatedBill.paymentStatus = 'Completed';
      updatedBill.status = 'Paid';
    } else if (Number(billed) > 0) {
      updatedBill.paymentStatus = 'In Progress';
      updatedBill.status = 'Partially Paid';
    } else {
      updatedBill.paymentStatus = 'Not Started';
      updatedBill.status = 'Unpaid';
    }
  }
            return updatedBill;
        });
    };

    const handleDateChange = (name, date) => {
        setBill(prev => ({
            ...prev,
            [name]: date instanceof Date && !isNaN(date) ? date.toISOString() : ''
        }));
    };

    // Update the handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const estimateAmount = Number(bill.estimateAmount) || 0;
            const billedAmount = Number(bill.billedAmount) || 0;
            const balance = calculateBalance(estimateAmount, billedAmount);

            const formattedBill = {
                ...bill,
                estimateAmount,
                billedAmount,
                balanceBillingAmount: balance,

                // Replace the paymentStatus line in formattedBill with:
paymentStatus: balance === 0 ? 'Completed' : (billedAmount > 0 ? 'In Progress' : 'Not Started'),
                status: balance === 0 ? 'Paid' : (billedAmount > 0 ? 'Partially Paid' : 'Unpaid'),
                estimateDate: bill.estimateDate ? new Date(bill.estimateDate).toISOString() : null,
                taxInvoiceDate: bill.taxInvoiceDate ? new Date(bill.taxInvoiceDate).toISOString() : null,
                billingDate: bill.billingDate ? new Date(bill.billingDate).toISOString() : null,
                dueDate: bill.dueDate ? new Date(bill.dueDate).toISOString() : null,
                client: bill.client?._id || bill.client
            };

            // Add validation before sending
            if (formattedBill.balanceBillingAmount === undefined || formattedBill.balanceBillingAmount === null) {
                throw new Error('Balance Billing Amount is required');
            }

            console.log('Sending formatted bill data:', formattedBill);
            
            const response = await axios.put(
                `http://localhost:8080/api/v1/bill/${billId}`,
                formattedBill
            );

            if (response.data.success) {
                navigate(`/bill/${billId}`);
            }
        } catch (err) {
            console.error('Update error:', err.response?.data || err.message);
            setError(err.response?.data?.message || err.message);
        }
    };

    const handleCancel = () => {
        navigate(`/bill/${billId}`); // Navigate back to bill details
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!bill) return <div>Bill not found</div>;

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, maxWidth: 800, mx: 'auto', p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Edit Bill
                </Typography>
                <TextField
                    label="Job No"
                    name="jobNo"
                    value={bill.jobNo}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Client Name"
                    name="clientName"
                    value={bill.clientName}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Narration"
                    name="narration"
                    value={bill.narration}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Estimate Amount"
                    name="estimateAmount"
                    value={bill.estimateAmount}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="PO Status"
                    name="poStatus"
                    value={bill.poStatus}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                />
                <TextField
    label="Status"
    name="status"
    value={bill.status}
    InputProps={{
        readOnly: true,
    }}
    fullWidth
    margin="normal"
    disabled
/>


                <DatePicker
                    label="Estimate Date"
                    value={parseDateSafe(bill.estimateDate)}
                    onChange={(date) => handleDateChange('estimateDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DatePicker
                    label="Tax Invoice Date"
                    value={parseDateSafe(bill.taxInvoiceDate)}
                    onChange={(date) => handleDateChange('taxInvoiceDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DatePicker
                    label="Billing Date"
                    value={parseDateSafe(bill.billingDate)}
                    onChange={(date) => handleDateChange('billingDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <DatePicker
                    label="Due Date"
                    value={parseDateSafe(bill.dueDate)}
                    onChange={(date) => handleDateChange('dueDate', date)}
                    renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
                />
                <TextField
                    label="Billed Amount"
                    name="billedAmount"
                    value={bill.billedAmount}
                    onChange={handleChange}
                    type="number"
                    fullWidth
                    margin="normal"
                />
                <TextField
    label="Balance Billing Amount"
    name="balanceBillingAmount"
    value={calculateBalance(bill.estimateAmount, bill.billedAmount)}
    InputProps={{
        readOnly: true,
    }}
    type="number"
    fullWidth
    margin="normal"
    disabled
/>
{/* / In your TextField for Payment Status */}
<TextField
  label="Payment Status"
  name="paymentStatus"
  value={bill.paymentStatus}
  InputProps={{ readOnly: true }}
  fullWidth
  margin="normal"
  disabled
/>

               <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        Update Bill
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </LocalizationProvider>
    );
};

export default EditBill;