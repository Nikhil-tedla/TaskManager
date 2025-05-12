



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Userdashboard from './components/user/dashboard';
import Admindashboard from './components/admin/dashboard';
import ProtectedRoute from "./components/protected/ProtectedRoute";
import { useAuth } from './context/AuthContext';
import CreateTaskPage from "./components/admin/CreateTaskPage";
import ViewTaskPage from "./components/admin/ViewTaskPage";
import ViewTaskUser from "./components/user/ViewTaskUser";
import UserProfileView from "./components/Profile";

const AppRoutes = () => {
    const { user, authLoading } = useAuth();

    if (authLoading) return <div>Loading...</div>;

    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<Home />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute user={user} requiredRole="admin" />}>
                    <Route path="/admin/dashboard" element={<Admindashboard />} />
                    <Route path="/admin/create-task" element={<CreateTaskPage />} />
                    <Route path="/admin/tasks" element={<ViewTaskPage />} />
                    <Route path="/admin/profile" element={<UserProfileView />} />
                </Route>
                <Route element={<ProtectedRoute user={user} requiredRole="member" />}>
                    <Route path="/user/dashboard" element={<Userdashboard />} />
                    <Route path="/user/tasks" element={<ViewTaskUser />} />
                    <Route path="/user/profile" element={<UserProfileView />} />
                </Route>

            </Routes></Router>


    );
};

export default AppRoutes;
