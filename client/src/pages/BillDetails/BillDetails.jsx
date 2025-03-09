import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Box, Typography } from '@mui/material';
import './BillDetails.css';

const BillDetails = () => {
    const { billId } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBillDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/v1/bill/bills/${billId}`);
                setBill(response.data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBillDetails();
    }, [billId]);

    const handleEdit = () => {
        navigate(`/edit-bill/${billId}`);
    };

    if (loading) return <div>Loading bill details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!bill) return <div>Bill not found</div>;

    return (
        <Box className="bill-details-container">
            <Typography variant="h4" gutterBottom>
                Bill Details
            </Typography>
            <div className="bill-info-grid">
                <div className="info-group">
                    <Typography variant="subtitle1">Job No:</Typography>
                    <Typography>{bill.jobNo}</Typography>
                </div>
                {/* Add all other bill details here */}
                <div className="actions">
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleEdit}
                    >
                        Edit Bill
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/viewBill')}
                    >
                        Back to Bills
                    </Button>
                </div>
            </div>
        </Box>
    );
};

export default BillDetails;