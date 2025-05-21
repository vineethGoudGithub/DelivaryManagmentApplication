import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DeliveryPersonPage.css';

const BASE_URL = 'http://localhost:8998';

export const DeliveryHome = ({ deliveryEmail }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const handleHome = () => {
    navigate('/delivery');
  };

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  });

  const fetchAssignedOrders = () => {
    fetch(`${BASE_URL}/orders`, {
      headers: getAuthHeaders(),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const assigned = data.filter(
          order =>
            order.status === `Assigned to ${deliveryEmail}` ||
            order.status === 'Pending'
        );
        setOrders(assigned);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        alert('Failed to fetch assigned orders.');
      });
  };

  useEffect(() => {
    fetchAssignedOrders();
  }, [deliveryEmail]);

  const markAsDelivered = (orderId) => {
    fetch(`${BASE_URL}/orders/${orderId}/status?status=Delivered`, {
      method: 'PUT',
      headers: getAuthHeaders(),
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
          <button className="nav-button" onClick={handleHome}>
            Home
          </button>
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="delivery-content">
        <ToastContainer />
        <h1 className="delivery-title">Orders Assigned to You</h1>

        {orders.length === 0 ? (
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
