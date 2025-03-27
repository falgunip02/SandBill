import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Drawer from './Drawer';
import './Drawer.css';
import './OverView.css';

// const OverView = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [totalReceivables, setTotalReceivables] = useState(0);
//   const [currentReceivables, setCurrentReceivables] = useState(0);
//   const [overdueReceivables, setOverdueReceivables] = useState(0);
//   // const [totalPayables, setTotalPayables] = useState(0);
//   // const [currentPayables, setCurrentPayables] = useState(0);
//   // const [overduePayables, setOverduePayables] = useState(0);


const OverView = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [totalReceivables, setTotalReceivables] = useState(0);
  const [currentReceivables, setCurrentReceivables] = useState(0);
  const [overdueReceivables, setOverdueReceivables] = useState(0);
  const [recentBills, setRecentBills] = useState([]);

  const [weeklyReceivables, setWeeklyReceivables] = useState({
    total: 0,
    current: 0,
    overdue: 0
  });
  // ...existing state...




// useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/v1/dashboard');
//         const { data } = response.data;

//         setTotalReceivables(data.totalReceivables);
//         setCurrentReceivables(data.currentReceivables);
//         setOverdueReceivables(data.overdueReceivables);
//         setTotalPayables(data.totalPayables);
//         setCurrentPayables(data.currentPayables);
//         setOverduePayables(data.overduePayables);
//       } catch (error) {
//         console.error('Error fetching dashboard data:', error);
//       }
//     };

//     fetchDashboardData();
//   }, []);


useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, weeklyResponse, recentResponse] = await Promise.all([
        axios.get('http://localhost:8080/api/v1/dashboard'),
        axios.get('http://localhost:8080/api/v1/dashboard/weeklyData'),
        axios.get('http://localhost:8080/api/v1/dashboard/recentBills')
      ]);

      const { data } = dashboardResponse.data;
      const weeklyData = weeklyResponse.data.data;
      setRecentBills(recentResponse.data.data);
    

      setTotalReceivables(data.totalReceivables);
      setCurrentReceivables(data.currentReceivables);
      setOverdueReceivables(data.overdueReceivables);
      setWeeklyReceivables({
        total: weeklyData.totalReceivables,
        current: weeklyData.currentReceivables,
        overdue: weeklyData.overdueReceivables
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  fetchDashboardData();
}, []);





  // return (
  //   <div className="layout">
  //     <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
  //       ☰
  //     </button>

  //     <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />

  //     <div className="dashboard-content">
  //       <div className="dashboard-grid">
  //         {/* Total Receivables Card */}
  //         <div className="dashboard-tile">
  //           <h3>TOTAL RECEIVABLES</h3>
  //           <div className="amount-display">
  //             <h2>₹{totalReceivables.toLocaleString()}</h2>
  //             <div className="progress-bar">
  //               <div className="progress"
  //                 style={{ width: `${Math.max(0, Math.min(100, totalReceivables ? (currentReceivables / totalReceivables) * 100 : 0))}%` }}>
  //               </div>

  //               <div className="progress-secondary"
  //                 style={{ width: `${Math.max(0, Math.min(100, totalReceivables ? (overdueReceivables / totalReceivables) * 100 : 0))}%` }}>
  //               </div>

  //             </div>
  //             <div className="amount-details">
  //               <span>Current: ₹{currentReceivables.toLocaleString()}</span>
  //               <span>Overdue: ₹{overdueReceivables.toLocaleString()}</span>
  //             </div>
  //           </div>
  //         </div>




  return (
    <div className="layout">
      <button className="menu-button" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
  
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} />
  
      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Total Receivables Card */}

{/* Total Receivables Card */}
       <div className="dashboard-tile">
           <h3>TOTAL RECEIVABLES</h3>
           <div className="amount-display">
             <h2>₹{totalReceivables.toLocaleString()}</h2>
             <div className="progress-bar">
               <div className="progress"
                  style={{ width: `${Math.max(0, Math.min(100, totalReceivables ? (currentReceivables / totalReceivables) * 100 : 0))}%` }}>
                </div>

                <div className="progress-secondary"
                  style={{ width: `${Math.max(0, Math.min(100, totalReceivables ? (overdueReceivables / totalReceivables) * 100 : 0))}%` }}>
                </div>

              </div>
              <div className="amount-details">
                <span>Current: ₹{currentReceivables.toLocaleString()}</span>
                <span>Overdue: ₹{overdueReceivables.toLocaleString()}</span>
              </div>
            </div>
          </div>
  
          {/* Weekly Receivables Card */}
          <div className="dashboard-tile">
            <h3>THIS WEEK'S RECEIVABLES</h3>
            <div className="amount-display">
              <h2>₹{weeklyReceivables.total.toLocaleString()}</h2>
              <div className="progress-bar">
                <div className="progress"
                  style={{ width: `${Math.max(0, Math.min(100, weeklyReceivables.total ? (weeklyReceivables.current / weeklyReceivables.total) * 100 : 0))}%` }}>
                </div>
                <div className="progress-secondary"
                  style={{ width: `${Math.max(0, Math.min(100, weeklyReceivables.total ? (weeklyReceivables.overdue / weeklyReceivables.total) * 100 : 0))}%` }}>
                </div>
              </div>
              <div className="amount-details">
                <span>Current: ₹{weeklyReceivables.current.toLocaleString()}</span>
                <span>Overdue: ₹{weeklyReceivables.overdue.toLocaleString()}</span>
              </div>
            </div>
          </div>          
        </div>



        {/* Recent Bills Card */}
        <div className="dashboard-tile large">
          <h3>RECENT BILLS</h3>
          <div className="recent-bills-container">
            {recentBills.length > 0 ? (
              <table className="recent-bills-table">
                <thead>
                  <tr>
                    <th>JobNo</th>
                    <th>Client</th>
                    <th>Estimate Amount.</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBills.map((bill, index) => (
                    <tr key={index}>
                      <td>{bill.jobNo}</td>
                      <td>{bill.client}</td>
                   <td>₹{Number(bill.estimateAmount).toLocaleString()}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td className={`status ${new Date(bill.dueDate) < new Date() ? 'overdue' : 'current'}`}>
                        {new Date(bill.dueDate) < new Date() ? 'Overdue' : 'Current'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-bills">No recent bills found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

//       </div>
//     </div>
//   );
// }



          {/* <div className="dashboard-tile">
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

//           {/* Cash Flow Graph */}
//           <div className="dashboard-tile large">
//             <h3>CASH FLOW</h3>
//             <div className="graph-container">
//               {/* You'll need to add a chart library like recharts or chart.js for the graph */}
//               <div className="cash-flow-details">
//                 <div>Cash as on 01-04-23: ₹42,250.11</div>
//                 <div className="flow-item positive">Incoming: ₹11,153,838.29</div>
//                 <div className="flow-item negative">Outgoing: ₹12,359,118.12</div>
//                 <div>Cash as on 31-03-24: ₹1,541,933.67</div>
//               </div>
//             </div>
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// };

export default OverView;