import React, { useState, useEffect } from 'react';
import './AdminHome.css';

const BASE_URL = 'http://localhost:8998';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
});

export const AdminHome = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersonEmail, setDeliveryPersonEmail] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = () => {
    fetch(`${BASE_URL}/orders`, {
      headers: getAuthHeaders(),
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
      headers: getAuthHeaders(),
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

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1 className="admin-title">Admin Home</h1>
        <h2>Orders</h2>
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
