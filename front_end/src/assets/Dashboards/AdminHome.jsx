import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

const BASE_URL = 'http://localhost:8998';

export const AdminHome = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [deliveryPersonEmail, setDeliveryPersonEmail] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Update the fetchOrders function to include logging
  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${BASE_URL}/orders`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      console.log('Fetched orders:', data); // Debug log
      setOrders(data);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Error fetching orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const assignDeliveryPerson = async () => {
    if (!selectedOrderId || !deliveryPersonEmail) {
      toast.error('Please select an order and enter delivery person email');
      return;
    }

    const token = localStorage.getItem('token');
    const selectedOrder = orders.find(order => order.id === selectedOrderId);

    if (!selectedOrder?.customerEmail) {
      toast.error('Customer email is missing for this order');
      return;
    }

    try {
      // First assign the delivery person with both emails
      const assignUrl = new URL(`${BASE_URL}/orders/${selectedOrderId}/assign`);
      assignUrl.searchParams.append('deliveryPersonEmail', deliveryPersonEmail);
      assignUrl.searchParams.append('customerEmail', selectedOrder.customerEmail);

      const assignResponse = await fetch(assignUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (!assignResponse.ok) {
        const errorText = await assignResponse.text();
        console.error('Assignment failed:', {
          status: assignResponse.status,
          error: errorText,
          url: assignUrl.toString()
        });
        throw new Error('Failed to assign delivery person');
      }

      // Then update the status
      const status = `Assigned to ${deliveryPersonEmail}`;
      const statusResponse = await fetch(
        `${BASE_URL}/orders/${selectedOrderId}/status?status=${encodeURIComponent(status)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        }
      );

      if (!statusResponse.ok) {
        const errorText = await statusResponse.text();
        console.error('Status update failed:', errorText);
        throw new Error('Failed to update order status');
      }

      toast.success(`Order #${selectedOrderId} assigned to ${deliveryPersonEmail}`);
      console.log('Assignment successful:', {
        orderId: selectedOrderId,
        customerEmail: selectedOrder.customerEmail,
        deliveryPersonEmail: deliveryPersonEmail
      });

      setDeliveryPersonEmail('');
      setSelectedOrderId(null);
      await fetchOrders();
    } catch (error) {
      console.error('Assignment error:', error);
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem('token');
      window.location.href = '/';
    } catch (error) {
      toast.error('Logout failed');
      setIsLoggingOut(false);
    }
  };

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="admin-container">
      <ToastContainer />
      <nav className="admin-nav">
        <div className="nav-logo">Admin Dashboard</div>
        <div className="nav-links">
          <button onClick={() => scrollToSection('home')}>Home</button>
          <button onClick={() => scrollToSection('orders')}>Orders</button>
          <button onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

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
              <th>Quantity</th>
              <th>Status</th>
              <th>Delivery Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr
                key={order.id}
                className={`
                  order-row 
                  ${selectedOrderId === order.id ? 'selected' : ''} 
                  ${order.status?.startsWith('Assigned to') ? 'assigned' : ''}
                `}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <td>{order.id}</td>
                <td>{order.productId}</td>
                <td>{order.customerEmail || 'N/A'}</td>
                <td>{order.quantity || 1}</td>
                <td>
                  <span className={
                    order.status?.startsWith('Assigned to') ? 'status-assigned' : 'status-pending'
                  }>
                    {order.status || 'Pending'}
                  </span>
                </td>
                <td>{order.deliveryPersonEmail || 'Not Assigned'}</td>
                <td>
                  {!order.status?.startsWith('Assigned to') && (
                    <div className="assign-action">
                      {selectedOrderId === order.id && (
                        <input
                          type="email"
                          placeholder="Delivery Person Email"
                          value={deliveryPersonEmail}
                          onChange={e => setDeliveryPersonEmail(e.target.value)}
                          onClick={e => e.stopPropagation()}
                        />
                      )}
                      <button
                        className="assign-button"
                        onClick={e => {
                          e.stopPropagation();
                          assignDeliveryPerson();
                        }}
                        disabled={selectedOrderId !== order.id || !deliveryPersonEmail}
                      >
                        Assign
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHome;
