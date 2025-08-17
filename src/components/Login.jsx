    import React, { useRef, useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';
    import { toast } from 'react-toastify';

    export default function Login() {
        const emailRef = useRef();
        const passwordRef = useRef();
        const { login } = useAuth();
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const navigate = useNavigate();

        async function handleSubmit(e) {
            e.preventDefault();

            try {
                setError('');
                setLoading(true);
                await login(emailRef.current.value, passwordRef.current.value);
                toast.success('Login successful!');
                navigate('/');
            } catch (error) {
                setError('Failed to sign in');
                toast.error('Failed to sign in');
            }

            setLoading(false);
        }

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                    <h3 className="text-2xl font-bold text-center">Log In</h3>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input type="email" id="email" ref={emailRef} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input type="password" id="password" ref={passwordRef} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        <button disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Log In
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-blue-500">Forgot Password?</Link>
                    </div>
                    <div className="mt-2 text-center">
                        Need an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
                    </div>
                </div>
            </div>
        );
    }