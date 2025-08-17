
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaSignOutAlt, FaPlus } from 'react-icons/fa';

export default function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const expensesCollectionRef = collection(db, 'users', currentUser.uid, 'expenses');
        const unsubscribe = onSnapshot(expensesCollectionRef, (snapshot) => {
            setExpenses(
                snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, [currentUser.uid]);

    const addExpense = async (e) => {
        e.preventDefault();
        if (!name || !amount) {
            toast.error('Please fill in all fields');
            return;
        }

        const expensesCollectionRef = collection(db, 'users', currentUser.uid, 'expenses');
        await addDoc(expensesCollectionRef, {
            name,
            amount: parseFloat(amount),
            createdAt: new Date(),
        });

        setName('');
        setAmount('');
        toast.success('Expense added!');
    };

    const startEditing = (expense) => {
        setEditingId(expense.id);
        setName(expense.name);
        setAmount(expense.amount);
    };

    const updateExpense = async (e) => {
        e.preventDefault();
        if (!name || !amount) {
            toast.error('Please fill in all fields');
            return;
        }

        const expenseDocRef = doc(db, 'users', currentUser.uid, 'expenses', editingId);
        await updateDoc(expenseDocRef, {
            name,
            amount: parseFloat(amount),
        });
        setEditingId(null);
        setName('');
        setAmount('');
        toast.success('Expense updated!');
    };

    const deleteExpense = async (id) => {
        const expenseDocRef = doc(db, 'users', currentUser.uid, 'expenses', id);
        await deleteDoc(expenseDocRef);
        toast.success('Expense deleted!');
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logout successful!');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'} transition-colors duration-300`}>
            <div className="container mx-auto p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-semibold">Expense Tracker</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                        >
                            <FaSignOutAlt className="mr-2" /> Logout
                        </button>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                                checked={isDarkMode}
                                onChange={() => setIsDarkMode(!isDarkMode)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <form onSubmit={editingId ? updateExpense : addExpense} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-gray-800">
                            <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Expense' : 'Add Expense'}</h2>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                                    id="name"
                                    type="text"
                                    placeholder="Expense Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="amount">
                                    Amount
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
                                    id="amount"
                                    type="number"
                                    placeholder="Expense Amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
                                type="submit"
                            >
                                {editingId ? 'Update Expense' :
                                    <>
                                        <FaPlus className="mr-2" /> Add Expense
                                    </>
                                }
                            </button>
                            {editingId && (
                                <button onClick={() => {
                                    setEditingId(null);
                                    setName('');
                                    setAmount('');
                                }} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2">
                                    Cancel
                                </button>
                            )}
                        </form>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4">Expenses</h2>
                        {expenses.length === 0 ? (
                            <p>No expenses added yet.</p>
                        ) : (
                            <div className="shadow-md rounded">
                                <table className="table-auto w-full">
                                    <thead className="bg-gray-200 dark:bg-gray-700">
                                        <tr>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Amount</th>
                                            <th className="px-4 py-2">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {expenses.map((expense) => (
                                            <tr key={expense.id} className="border-b dark:border-gray-600">
                                                <td className="px-4 py-2">{expense.name}</td>
                                                <td className="px-4 py-2">${expense.amount.toFixed(2)}</td>
                                                <td className="px-4 py-2">
                                                    <button onClick={() => startEditing(expense)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 rounded mr-2">
                                                        <FaEdit />
                                                    </button>
                                                    <button onClick={() => deleteExpense(expense.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 rounded">
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}