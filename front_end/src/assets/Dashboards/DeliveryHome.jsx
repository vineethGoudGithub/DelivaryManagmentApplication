import React, { useState, useEffect } from 'react';
import './DeliveryPersonPage.css';

const BASE_URL = 'http://localhost:8998';

export const DeliveryHome = ({ deliveryEmail }) => {
  const [orders, setOrders] = useState([]);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
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
          alert(`Order #${orderId} marked as Delivered`);
          fetchAssignedOrders();
        } else {
          alert('Failed to update order status');
        }
      })
      .catch(err => {
        console.error('Error updating status:', err);
        alert('Failed to mark as delivered.');
      });
  };

  return (
    <div className='add_background'>
      <div className="delivery-container">
        <h1 className="delivery-title">Delivery Dashboard</h1>
        <h2>Orders Assigned to You</h2>

        {orders.length === 0 ? (
          <p>No orders assigned currently.</p>
        ) : (
          <table className="delivery-table">
            <thead>
              <tr className="table-header">
                <th>Order ID</th>
                <th>Product ID</th>
                <th>Customer Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
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
