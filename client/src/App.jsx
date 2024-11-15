import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { CircularProgress, Box } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
    },
});

const PrivateRoute = ({ children }) => {
    const [isVerifying, setIsVerifying] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsVerifying(false);
                return;
            }

            try {
                const response = await axios.get('http://localhost:3000/auth/verify', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIsAuthenticated(response.data.valid);
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setIsVerifying(false);
            }
        };

        verifyToken();
    }, []);

    if (isVerifying) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/dashboard/*"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App; 