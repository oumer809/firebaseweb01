    import React, { useRef, useState } from 'react';
    import { Link } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';
    import { toast } from 'react-toastify';

    export default function ForgotPassword() {
        const emailRef = useRef();
        const { resetPassword } = useAuth();
        const [error, setError] = useState('');
        const [message, setMessage] = useState('');
        const [loading, setLoading] = useState(false);

        async function handleSubmit(e) {
            e.preventDefault();

            try {
                setMessage('');
                setError('');
                setLoading(true);
                await resetPassword(emailRef.current.value);
                setMessage('Check your inbox for further instructions');
                toast.success('Check your inbox for further instructions');
            } catch (error) {
                setError('Failed to reset password');
                toast.error('Failed to reset password');
            }

            setLoading(false);
        }

        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
                    <h3 className="text-2xl font-bold text-center">Password Reset</h3>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                    {message && <div className="text-green-500 mt-2">{message}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input type="email" id="email" ref={emailRef} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
                        </div>
                        <button disabled={loading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Reset Password
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-blue-500">Log In</Link>
                    </div>
                    <div className="mt-2 text-center">
                        Need an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
                    </div>
                </div>
            </div>
        );
    }