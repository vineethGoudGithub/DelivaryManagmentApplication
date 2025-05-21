import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

const BASE_URL = 'http://localhost:8998';

export const AdminHome = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deliveryPersonEmail, setDeliveryPersonEmail] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchOrders = () => {
    fetch(`${BASE_URL}/orders`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(err => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const assignDeliveryPerson = () => {
    if (!selectedOrderId || !deliveryPersonEmail) {
      alert('Select order and enter delivery person email');
      return;
    }

    const status = `Assigned to ${deliveryPersonEmail}`;
    fetch(`${BASE_URL}/orders/${selectedOrderId}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => {
        if (res.ok) {
          alert('Delivery person assigned successfully');
          setDeliveryPersonEmail('');
          setSelectedOrderId(null);
          fetchOrders();
        } else {
          alert('Failed to assign delivery person');
        }
      })
      .catch(err => {
        console.error('Error assigning delivery person:', err);
        alert('Failed to assign delivery person');
      });
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="admin-container">
      <nav className="admin-nav">
        <div className="nav-logo">Admin Dashboard</div>
        <div className="nav-links">
          <button onClick={() => scrollToSection('home')}>Home</button>
          <button onClick={() => scrollToSection('orders')}>Orders</button>
          <button 
            onClick={handleLogout} 
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      {isLoggingOut && (
        <div className="logout-overlay">
          <div className="logout-spinner">Logging out...</div>
        </div>
      )}

      <div id="home" className="admin-content">
        <h1 className="admin-title">Admin Dashboard</h1>
      </div>

      <div id="orders" className="admin-content">
        <h2>Orders Management</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product ID</th>
              <th>Customer Email</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr
                key={order.id}
                className={selectedOrderId === order.id ? 'order-row selected' : 'order-row'}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <td>{order.id}</td>
                <td>{order.productId}</td>
                <td>{order.customerEmail}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="assign-section">
          <input
            type="email"
            placeholder="Delivery Person Email"
            className="email-input"
            value={deliveryPersonEmail}
            onChange={(e) => setDeliveryPersonEmail(e.target.value)}
          />
          <button
            className="assign-button"
            onClick={assignDeliveryPerson}
            disabled={!selectedOrderId || !deliveryPersonEmail}
          >
            Assign Delivery Person
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
