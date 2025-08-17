    import React from 'react';
    import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
    import { AuthProvider } from './contexts/AuthContext';
    import Signup from './components/Signup';
    import Login from './components/Login';
    import Dashboard from './components/Dashboard';
    import PrivateRoute from './components/PrivateRoute';
    import ForgotPassword from './components/ForgotPassword';
    import UpdateProfile from './components/UpdateProfile';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';

    function App() {
        return (
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
                        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    </Routes>
                </Router>
                <ToastContainer />
            </AuthProvider>
        );
    }

    export default App;