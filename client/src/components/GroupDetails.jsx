import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getGroupExpenses, getGroupBalance, settleDebt } from '../services/api';
import { toast } from 'react-toastify';
import AddExpense from './AddExpense';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, DollarSign, Calendar, User, ArrowRight, Check } from 'lucide-react';

const GroupDetails = () => {
    const { groupId } = useParams();
    const [expenses, setExpenses] = useState([]);
    const [balances, setBalances] = useState([]);
    const [showAddExpense, setShowAddExpense] = useState(false);
    const [loading, setLoading] = useState(true);
    const [confirmingDebt, setConfirmingDebt] = useState(null);

    const fetchData = async () => {
        try {
            const [expensesRes, balanceRes] = await Promise.all([
                getGroupExpenses(groupId),
                getGroupBalance(groupId)
            ]);
            setExpenses(expensesRes.data);
            setBalances(balanceRes.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [groupId]);

    const handleSettle = async (debt) => {
        const { from, to, amount } = debt;
        try {
            await settleDebt({
                payer: from.id,
                receiver: to.id,
                amount: amount,
                group: groupId
            });
            toast.success('Settled successfully!');
            setConfirmingDebt(null);
            fetchData();
        } catch (error) {
            toast.error('Error settling: ' + (error.response?.data?.message || error.message));
        }
    };

    const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-20"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Group Details</h1>
                    <p className="text-slate-500">Manage expenses and view balances</p>
                </div>

                <button
                    onClick={() => setShowAddExpense(!showAddExpense)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${showAddExpense ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30'}`}
                >
                    {showAddExpense ? <><X className="w-5 h-5" /> Cancel</> : <><Plus className="w-5 h-5" /> Add Expense</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Expenses */}
                <div className="lg:col-span-2 space-y-6">
                    <AnimatePresence>
                        {showAddExpense && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white p-6 rounded-3xl shadow-xl border border-indigo-100 mb-6 relative z-20">
                                    <AddExpense groupId={groupId} onExpenseAdded={() => {
                                        setShowAddExpense(false);
                                        fetchData();
                                    }} />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-indigo-500" /> Recent Expenses
                            </h2>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{expenses.length} records</span>
                        </div>

                        {expenses.length === 0 ? (
                            <div className="p-12 text-center text-slate-500">
                                No expenses recorded yet.
                            </div>
                        ) : (
                            <ul className="divide-y divide-slate-100">
                                {expenses.map(expense => (
                                    <motion.li
                                        layout
                                        key={expense._id}
                                        className="p-6 hover:bg-slate-50 transition-colors flex justify-between items-center group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                <DollarSign className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{expense.description}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {expense.payer?.name} paid</span>
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(expense.date).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-lg text-slate-800">{formatCurrency(expense.amount)}</p>
                                        </div>
                                    </motion.li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Sidebar: Simplified Balances */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 text-white rounded-3xl shadow-2xl p-6 relative overflow-hidden">
                        {/* Decorative BG */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                        <h2 className="text-xl font-bold mb-2 relative z-10">Simplified Balances</h2>
                        <p className="text-slate-400 text-sm mb-6 relative z-10">Optimized debt settlement plan.</p>

                        {balances.length === 0 ? (
                            <div className="bg-white/10 rounded-xl p-6 text-center backdrop-blur-sm">
                                <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <p className="font-bold">All settled up!</p>
                            </div>
                        ) : (
                            <ul className="space-y-3 relative z-10">
                                {balances.map((debt, index) => (
                                    <li key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-red-400">{debt.from.name}</span>
                                                <ArrowRight className="w-3 h-3 text-slate-500" />
                                                <span className="font-bold text-green-400">{debt.to.name}</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className="text-2xl font-bold">{formatCurrency(debt.amount)}</span>

                                            {/* Settle Logic */}
                                            {JSON.parse(localStorage.getItem('currentUser'))?._id === debt.from.id ? (
                                                confirmingDebt === index ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleSettle(debt)}
                                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmingDebt(null)}
                                                            className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmingDebt(index)}
                                                        className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-lg transition-colors"
                                                    >
                                                        Pay
                                                    </button>
                                                )
                                            ) : (
                                                <span className="text-xs text-slate-500 italic">
                                                    {JSON.parse(localStorage.getItem('currentUser'))?._id === debt.to.id ? "Waiting" : "Pending"}
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GroupDetails;
