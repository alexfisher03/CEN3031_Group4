import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isNewUser, setIsNewUser] = useState(false);
    const navigate = useNavigate();

    const handleLoginOrRegister = async (e) => {
        e.preventDefault();
        try {
            if (isNewUser) {
                //register new user
                const response = await axios.post('/api/register/', { username, email, password });
                alert(response.data.message);
                setIsNewUser(false); //switch to login mode after registration
            } else {
                //login existing user
                const response = await axios.post('/api/login/', { username, password });
                setIsAuthenticated(true);
                navigate('/main');
            }
        } catch (error) {
            console.error(error.response?.data || "There was an error");
            if (error.response?.status === 401) {
                setIsNewUser(true);
                alert('User not found. Please sign up.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold text-center mb-4">{isNewUser ? "Sign Up" : "Login"}</h2>
                <form onSubmit={handleLoginOrRegister} className="space-y-4">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                    {isNewUser && (
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                        />
                    )}
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                    >
                        {isNewUser ? "Sign Up" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;