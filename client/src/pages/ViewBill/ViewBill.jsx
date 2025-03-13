import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ViewBill.css';

const ViewBill = () => {
    const navigate = useNavigate();
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');  // Add this line

    const fetchBills = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/bill/bills');
            setBills(response.data.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBills();
    }, []);

    const handleViewDetails = (billId) => {
        navigate(`/bill/${billId}`);
    };

    const handleDelete = async (billId) => {
        try {
            await axios.delete(`http://localhost:8080/api/v1/bill/bills/${billId}`);
            setBills(bills.filter(bill => bill._id !== billId));
        } catch (err) {
            setError(err.message);
        }
    };

    // Add this function to filter bills
    const filteredBills = bills.filter(bill => 
        bill.jobNo.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div>Loading bills...</div>;
    if (error) return <div>Error fetching bills: {error}</div>;

    return (
        <div className="bill-details">
            <h2>View Bills</h2>
            
            {/* Add search bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search by Job No..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            <table className="bill-info">
                <thead>
                    <tr>
                        <th>Job No</th>
                        <th>Client Name</th>
                        <th>Estimate Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th>Balance Billing Amount</th>
                        <th>Payment Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBills.map((bill) => (
                        <tr key={bill._id}>
                            <td>{bill.jobNo}</td>
                            <td>{bill.clientName}</td>
                            <td>${bill.estimateAmount.toFixed(2)}</td>
                            <td>
                                <span className={`status-badge status-${bill.status.toLowerCase()}`}>
                                    {bill.status}
                                </span>
                            </td>
                            <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                            <td>${bill.balanceBillingAmount.toFixed(2)}</td>
                            <td>{bill.paymentStatus}</td>
                            <td>
                                <button 
                                    className="action-button view-button"
                                    onClick={() => handleViewDetails(bill._id)}
                                >
                                    Details
                                </button>
                                <button 
                                    className="action-button delete-button"
                                    onClick={() => handleDelete(bill._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewBill;