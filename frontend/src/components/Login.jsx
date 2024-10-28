import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated, setIsGuest }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    const handleLoginOrRegister = async (e) => {
        e.preventDefault();
        try {
            if (isNewUser) {
                // Register user
                if (password !== confirmPassword) {
                    alert("Passwords do not match.");
                    return;
                }
                const response = await axios.post('/api/register/', { email, password });
                alert(response.data.message);
                setIsNewUser(false); // Switch to login mode after registration
            } else {
                // Login existing user
                const response = await axios.post('/api/login/', { email, password });
                if (response.data.message === "Login successful") {
                    setIsAuthenticated(true);
                    setIsGuest(false);
                    navigate('/main');
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error;
            alert(errorMessage);
            if (error.response?.status === 404) {
                setIsNewUser(true); // Prompt to sign up if user not found
            }
        }
    };

    const handleGuestLogin = () => {
        setIsAuthenticated(true);
        setIsGuest(true);
        navigate('/main');
    };

    return (
        <div className='min-h-screen bg-mesh bg-cover'>
            <div className="flex justify-center">
                <header className="flex-col text-center pt-16 mb-16">
                    <h1 className='text-3xl text-white font-extrabold'>Welcome to GatorSync</h1>
                    <p className="text-lg text-white font-bold">Please login or register to modify the UF Org Scheduler</p>
                </header>
            </div>
            <div className="flex items-center justify-center">
                <div className="bg-opacity-40 backdrop-blur-lg rounded-lg shadow-lg w-96 p-8 text-white bg-gray-800">
                    <h2 className="text-3xl font-bold text-center mb-6">
                        {isNewUser ? "Register" : "Login"}
                    </h2>
                    <form onSubmit={handleLoginOrRegister} className="space-y-4">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
                        />
                        {isNewUser && (
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded focus:ring focus:ring-indigo-500 focus:outline-none"
                            />
                        )}
                        <button
                            type="submit"
                            className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-700 transition"
                        >
                            {isNewUser ? "Sign Up" : "Login"}
                        </button>
                    </form>

                    {/* Toggle button for switching between Login and Register */}
                    <div className="text-center mt-4">
                        <button
                            onClick={() => setIsNewUser(!isNewUser)}
                            className="text-sm text-indigo-400 hover:text-indigo-300 transition"
                        >
                            {isNewUser ? "Already have an account? Login" : "No account? Register"}
                        </button>
                    </div>

                    {/* Guest Login Button */}
                    <button
                        onClick={handleGuestLogin}
                        className="mt-6 w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
