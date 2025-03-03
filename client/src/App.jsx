import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import OverView from './pages/overview/OverView';
import LoginPage from './pages/login/Login';
import CreateClients from './pages/CreateClients/CreateClients';
import { useState } from 'react';

// import Dashboard from './pages/Dashboard';
// import Clients from './pages/Clients';
// import Bills from './pages/Bills';
// import Login from './pages/Login';
// import Register from './pages/Register';

// import Navbar from './components/Navbar';

function App() {
  const [loading] = useState(false);

  return (
    <div className="App">
      <Router>
        {/* <Navbar /> */}

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Routes>
            <Route path="/overview/:id/*" element={ <OverView />} />


            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route path='/dashboard' element={<OverView />} />
            <Route path="/createClients" element={<CreateClients />} />
            {/* <Route path="/clients" element={<Clients />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} /> */}
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
