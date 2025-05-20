import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomerSignIn from './assets/pages/SignUpPages/CustomerSignIn';
import DeliveryHome from './assets/Dashboards/DeliveryHome';
import AdminDashboard, { AdminHome } from './assets/Dashboards/AdminHome';
import CustomerProfile from './assets/Components/CustomerProfile';
import Support from './assets/Components/Support';
import CustomerHomeP from './assets/Dashboards/CustomerHomeP';
import ForgetPassword from './assets/pages/SignUpPages/ForgetPassword';
import UserLogin from './assets/pages/Login/UserLogin';
import ProtectedRoute from './assets/Components/ProtectedRoute ';
import About from './assets/Components/About';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLogin />} />
        <Route path="/SignIn" element={<CustomerSignIn />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
            <Route path="/About" element={<About />} />
        <Route
          path="/CustomerHome"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <CustomerHomeP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Delivary-Home"
          element={
            <ProtectedRoute allowedRoles={['DELIVERY_PERSON']}>
              <DeliveryHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

     
        <Route
          path="/customer-profile"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
              <CustomerProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute allowedRoles={['CUSTOMER', 'DELIVERY_PERSON', 'ADMIN']}>
              <Support />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
