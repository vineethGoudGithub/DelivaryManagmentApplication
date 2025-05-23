import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import './DeliveryPersonPage.css';

const BASE_URL = 'http://localhost:8998';

export const DeliveryHome = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deliveryEmail, setDeliveryEmail] = useState(null);

  const getEmailFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const decoded = jwtDecode(token);
      return decoded.sub;
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  };

  const fetchAssignedOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        navigate('/');
        return;
      }

      const email = getEmailFromToken();
      if (!email) {
        toast.error('Invalid authentication');
        navigate('/');
        return;
      }

      setDeliveryEmail(email);

      const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('All orders:', data); // Debug log

      const assigned = data.filter(order => 
        order.status === `Assigned to ${email}` && 
        order.status !== 'Delivered'
      );

      console.log('Filtered orders:', assigned); // Debug log
      setOrders(assigned);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = getEmailFromToken();
    if (!email) {
      toast.error('Please login first');
      navigate('/');
      return;
    }

    fetchAssignedOrders();
    const interval = setInterval(fetchAssignedOrders, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
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

  const markAsDelivered = (orderId) => {
    fetch(`${BASE_URL}/orders/${orderId}/status?status=Delivered`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (res.ok) {
          toast.success(`Order #${orderId} marked as Delivered`);
          fetchAssignedOrders();
        } else {
          toast.error('Failed to update order status');
        }
      })
      .catch(err => {
        console.error('Error updating status:', err);
        toast.error('Failed to mark as delivered');
      });
  };

  return (
    <div className="delivery-person-container">
      <nav className="delivery-nav">
        <div className="nav-logo">
          <h1>Delivery Dashboard</h1>
        </div>
        <div className="nav-links">
          <button 
            className="nav-button" 
            onClick={() => scrollToSection('home')}
          >
            Home
          </button>
          <button 
            className="nav-button" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        {deliveryEmail && (
          <div className="user-info">
            Logged in as: {deliveryEmail}
          </div>
        )}
      </nav>

      <div id="home" className="delivery-content">
        <ToastContainer />
        <h1 className="delivery-title">Orders Assigned to You</h1>

        {loading ? (
          <p className="loading">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="no-orders">No orders assigned currently.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Customer Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="order-row">
                  <td>{order.id}</td>
                  <td>{order.productId}</td>
                  <td>{order.customerEmail}</td>
                  <td>{order.status}</td>
                  <td>
                    {order.status !== 'Delivered' ? (
                      <button
                        className="deliver-button"
                        onClick={() => markAsDelivered(order.id)}
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <span className="delivered-label">Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DeliveryHome;
