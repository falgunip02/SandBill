import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route 
} from 'react-router-dom';
import './App.css';
import OverView from './pages/overview/OverView';
import LoginPage from './pages/login/Login';
import CreateClients from './pages/CreateClients/CreateClients';
import ViewClients from './pages/ViewClients/ViewClients';
import ClientDetails from './pages/ViewClients/ClientDetails';
import CreateBill from './pages/Bills/CreateBill';
import BillDetails from './pages/Bills/BillDetails';  

import { useState } from 'react';
import ViewBill from './pages/ViewBill/ViewBill';
import EditBill from './pages/EditBill/EditBill';

// import Dashboard from './pages/Dashboard';
// import Clients from './pages/Clients';
// import Bills from './pages/Bills';
// import Login from './pages/Login';
// import Register from './pages/Register';

// import Navbar from './components/Navbar';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/overview/:id/*" element={<OverView />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path='/dashboard' element={<OverView />} />
      <Route path="/createClients" element={<CreateClients />} />
      <Route path="/viewClients" element={<ViewClients />} />
      <Route path="/viewClients/:id" element={<ClientDetails />} />
      <Route path="/clients/create" element={<CreateClients />} />
      <Route path="/bills/create/:clientId" element={<CreateBill />} />
      <Route path="/bill/:billId" element={<BillDetails />} />
      <Route path='/viewBill' element={<ViewBill />} /> 
      <Route path="/edit-bill/:billId" element={<EditBill />} />
    </Route>
  )
);

function App() {
  const [loading] = useState(false);

  return (
    <div className="App">
      {/* <Navbar /> */}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <RouterProvider 
          router={router}
          future={{
            v7_startTransition: true
          }}
        />
      )}
    </div>
  );
}

export default App;
