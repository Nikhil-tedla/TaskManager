import { useState } from 'react'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Userdashboard from './components/user/dashboard';
import Admindashboard from './components/admin/dashboard';
// import AdminRoute from './components/protected/AdminRoute';
import AppRoutes from './AppRoutes';
import { AuthProvider } from './context/AuthContext';

function App() {



  return (
    <>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>

    </>
  )
}

export default App
