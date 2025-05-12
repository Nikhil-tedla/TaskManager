import { Navigate, Outlet } from 'react-router-dom';
import AdminLayout from '../admin/AdminLayout';
import UserLayout from '../user/UserLayout';

const ProtectedRoute = ({ user,requiredRole }) => {
  
  if (requiredRole && user && user.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === 'admin') {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    )
  }
  
  if (user?.role === 'member') {
    
    return(
    <UserLayout>
      <Outlet />
    </UserLayout>
    )
  }
  else {
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
