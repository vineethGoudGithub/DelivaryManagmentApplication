import React from 'react';

const CustomerProfile = () => {
  const customer = {
    name: 'Raghu',
    email: 'raghu@gmail.com',
    phoneNumber: '9876543210',
    role: 'CUSTOMER'
  };

  return (
    <div style={styles.container}>
      <h2>Customer Profile</h2>
      <div style={styles.infoBox}>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone Number:</strong> {customer.phoneNumber}</p>
        <p><strong>Role:</strong> {customer.role}</p>
      </div>
    </div>
  );
};

export default CustomerProfile;



