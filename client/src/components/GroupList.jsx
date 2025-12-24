import { useState, useEffect } from 'react';
import { getGroups, getGroupBalance } from '../services/api';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Users, ArrowRight, Search, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
};

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ owe: 0, owed: 0, net: 0 });
    const [searchTerm, setSearchTerm] = useState('');

    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                // 1. Fetch Groups
                const { data: groupData } = await getGroups(user._id);
                setGroups(groupData);
                setFilteredGroups(groupData);

                // 2. Calculate Stats (Simplified version of Profile logic)
                // We fetch all balances to show a quick "Net Status" on dashboard
                let totalOwe = 0;
                let totalOwed = 0;

                const balancePromises = groupData.map(group => getGroupBalance(group._id));
                const balanceResponses = await Promise.all(balancePromises);

                balanceResponses.forEach(res => {
                    const debts = res.data;
                    debts.forEach(debt => {
                        if (debt.from.id === user._id) {
                            totalOwe += debt.amount;
                        } else if (debt.to.id === user._id) {
                            totalOwed += debt.amount;
                        }
                    });
                });

                setStats({
                    owe: totalOwe,
                    owed: totalOwed,
                    net: totalOwed - totalOwe
                });
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [user._id]);

    // Handle Search
    useEffect(() => {
        const lowerTerm = searchTerm.toLowerCase();
        const filtered = groups.filter(g => g.name.toLowerCase().includes(lowerTerm));
        setFilteredGroups(filtered);
    }, [searchTerm, groups]);

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    // Number Counting Animation Component
    const CountUp = ({ value, color }) => {
        return (
            <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={value} // Re-animate on change
                className={`text-2xl font-black ${color}`}
            >
                {formatCurrency(value)}
            </motion.span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="pb-24 max-w-7xl mx-auto space-y-10">
            {/* 1. Header & Stats Section */}
            <header className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl font-black text-slate-800 tracking-tight"
                        >
                            Dashboard
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-slate-500 font-medium mt-1"
                        >
                            Overview for <span className="text-indigo-600 font-bold">{user.name}</span>
                        </motion.p>
                    </div>
                </div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    {/* Net Balance Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Wallet className="w-24 h-24" />
                        </div>
                        <p className="text-indigo-100 font-medium text-sm uppercase tracking-wider mb-1">Net Balance</p>
                        <CountUp value={stats.net} color="text-white" />
                        <div className="mt-4 text-xs font-medium bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-sm">
                            {stats.net >= 0 ? "You are owed overall" : "You owe overall"}
                        </div>
                    </div>

                    {/* Owed to You */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                            <span className="text-slate-500 font-bold text-sm">Owed to You</span>
                        </div>
                        <CountUp value={stats.owed} color="text-slate-800" />
                    </div>

                    {/* You Owe */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                <TrendingDown className="w-5 h-5" />
                            </div>
                            <span className="text-slate-500 font-bold text-sm">You Owe</span>
                        </div>
                        <CountUp value={stats.owe} color="text-slate-800" />
                    </div>
                </motion.div>
            </header>

            {/* 2. Controls & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 sticky top-20 z-30 py-4 bg-slate-50/80 backdrop-blur-sm -mx-4 px-4 md:static md:bg-transparent md:p-0">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                </div>

                <Link
                    to="/create-group"
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-500/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" /> New Group
                </Link>
            </div>

            {/* 3. Groups Grid */}
            <div>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-500" />
                    Active Groups
                </h2>

                {filteredGroups.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border border-slate-100 border-dashed"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No groups found</h3>
                        <p className="text-slate-500">
                            {searchTerm ? `No results for "${searchTerm}"` : "Create a group to get started!"}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <AnimatePresence>
                            {filteredGroups.map(group => (
                                <motion.div
                                    key={group._id}
                                    variants={itemVariants}
                                    layout
                                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/50 transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <Link to={`/groups/${group._id}`} className="block h-full relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-indigo-200">
                                                {group.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="bg-slate-50 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold border border-slate-100">
                                                {group.members.length} Members
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-slate-900 mb-2 truncate pr-4">{group.name}</h3>

                                        <div className="flex items-center gap-1 mb-6">
                                            <div className="flex -space-x-2 overflow-hidden">
                                                {group.members.slice(0, 3).map((m, i) => (
                                                    <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                ))}
                                                {group.members.length > 3 && (
                                                    <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        +{group.members.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs text-slate-400 ml-2">Active now</span>
                                        </div>

                                        <div className="pt-4 border-t border-slate-50 flex items-center justify-between group-hover:text-indigo-600 transition-colors">
                                            <span className="text-sm font-bold">Open Group</span>
                                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>

                                    {/* Decor blob */}
                                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-2xl group-hover:bg-indigo-100 transition-colors duration-500"></div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default GroupList;
