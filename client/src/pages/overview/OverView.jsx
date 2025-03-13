import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Drawer from './Drawer';
import './Drawer.css';
import './OverView.css';

const OverView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalReceivables, setTotalReceivables] = useState(0);
  const [currentReceivables, setCurrentReceivables] = useState(0);
  const [overdueReceivables, setOverdueReceivables] = useState(0);
  const [totalPayables, setTotalPayables] = useState(0);
  const [currentPayables, setCurrentPayables] = useState(0);
  const [overduePayables, setOverduePayables] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/v1/dashboard');
            const { data } = response.data;
            
            setTotalReceivables(data.totalReceivables);
            setCurrentReceivables(data.currentReceivables);
            setOverdueReceivables(data.overdueReceivables);
            setTotalPayables(data.totalPayables);
            setCurrentPayables(data.currentPayables);
            setOverduePayables(data.overduePayables);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    fetchDashboardData();
}, []);

  return (
    <div className="layout">
      <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Total Receivables Card */}
          <div className="dashboard-tile">
            <h3>TOTAL RECEIVABLES</h3>
            <div className="amount-display">
              <h2>₹{totalReceivables.toLocaleString()}</h2>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(currentReceivables / totalReceivables) * 100}%` }}></div>
                <div className="progress-secondary" style={{ width: `${(overdueReceivables / totalReceivables) * 100}%` }}></div>
              </div>
              <div className="amount-details">
                <span>Current: ₹{currentReceivables.toLocaleString()}</span>
                <span>Overdue: ₹{overdueReceivables.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Total Payables Card
          <div className="dashboard-tile">
            <h3>TOTAL PAYABLES</h3>
            <div className="amount-display">
              <h2>₹{totalPayables.toLocaleString()}</h2>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${(currentPayables / totalPayables) * 100}%` }}></div>
                <div className="progress-secondary" style={{ width: `${(overduePayables / totalPayables) * 100}%` }}></div>
              </div>
              <div className="amount-details">
                <span>Current: ₹{currentPayables.toLocaleString()}</span>
                <span>Overdue: ₹{overduePayables.toLocaleString()}</span>
              </div>
            </div>
          </div> */}

          {/* Cash Flow Graph */}
          <div className="dashboard-tile large">
            <h3>CASH FLOW</h3>
            <div className="graph-container">
              {/* You'll need to add a chart library like recharts or chart.js for the graph */}
              <div className="cash-flow-details">
                <div>Cash as on 01-04-23: ₹42,250.11</div>
                <div className="flow-item positive">Incoming: ₹11,153,838.29</div>
                <div className="flow-item negative">Outgoing: ₹12,359,118.12</div>
                <div>Cash as on 31-03-24: ₹1,541,933.67</div>
              </div>
            </div>
          </div>

          {/* Top Expenses */}
          <div className="dashboard-tile">
            <h3>TOP EXPENSES</h3>
            <div className="expenses-list">
              {/* Add your expenses list here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;




