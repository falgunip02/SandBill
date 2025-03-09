import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Drawer.css';

const Drawer = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Profile', path: '/profile' },
    { text: 'Settings', path: '/settings' },
    {text: 'Create Clients', path: '/createClients'},
    {text: 'View Clients', path: '/viewClients'},
    {text: 'Time Tracking', path: '/timeTracking'},
    {text: 'View Bills', path: '/viewBill'},
    { text: 'Logout', path: '/logout' }
  ];

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <button 
        className="close-button"
        onClick={() => setIsOpen(false)}
      >
        ×
      </button>
      
      <nav className="nav-menu">
        {menuItems.map((item) => (
          <button
            key={item.text}
            className="nav-item"
            onClick={() => {
              navigate(item.path);
              setIsOpen(false);
            }}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Drawer;
