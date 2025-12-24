import { useState, useEffect } from 'react';
import { getGroup, addExpense } from '../services/api';
import { toast } from 'react-toastify';

const AddExpense = ({ groupId, onExpenseAdded }) => {
    const [members, setMembers] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState('');
    const [splitType, setSplitType] = useState('EQUAL');
    const [splits, setSplits] = useState({}); // { userId: amount/percentage }

    useEffect(() => {
        const fetchGroup = async () => {
            try {
                const { data } = await getGroup(groupId);
                setMembers(data.members);
                if (data.members.length > 0) setPayer(data.members[0]._id);
            } catch (error) {
                console.error(error);
            }
        };
        fetchGroup();
    }, [groupId]);

    const handleSplitChange = (userId, value) => {
        setSplits(prev => ({ ...prev, [userId]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const expenseData = {
            description,
            amount: parseFloat(amount),
            payer,
            group: groupId,
            splitType,
            splits: []
        };

        if (splitType === 'EQUAL') {
            // Implicit equal split for all members (or selected ones? Assignment simplifies to all usually)
            // Let's assume all members are involved for EQUAL
            expenseData.splits = members.map(m => ({ user: m._id }));
        } else if (splitType === 'EXACT') {
            expenseData.splits = Object.keys(splits).map(userId => ({
                user: userId,
                amount: splits[userId]
            }));
        } else if (splitType === 'PERCENTAGE') {
            expenseData.splits = Object.keys(splits).map(userId => ({
                user: userId,
                percentage: splits[userId]
            }));
        }

        try {
            await addExpense(expenseData);
            toast.success('Expense added successfully!');
            // Reset form
            setDescription('');
            setAmount('');
            setSplits({});
            onExpenseAdded();
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            toast.error('Error: ' + msg);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-bold text-lg">Add New Expense</h3>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full border rounded p-2" required />
                </div>
                <div>
                    <label className="block text-sm font-medium">Amount ($)</label>
                    <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full border rounded p-2" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium">Paid By</label>
                <select value={payer} onChange={e => setPayer(e.target.value)} className="w-full border rounded p-2">
                    {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Split Method</label>
                <div className="flex space-x-2">
                    {['EQUAL', 'EXACT', 'PERCENTAGE'].map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setSplitType(type)}
                            className={`px-3 py-1 rounded text-sm ${splitType === type ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {splitType !== 'EQUAL' && (
                <div className="bg-gray-100 p-3 rounded">
                    <p className="text-sm font-bold mb-2">Split Details</p>
                    {members.map(m => (
                        <div key={m._id} className="flex items-center justify-between mb-2">
                            <span className="text-sm">{m.name}</span>
                            <input
                                type="number"
                                placeholder={splitType === 'EXACT' ? '$' : '%'}
                                className="w-20 border rounded p-1 text-sm"
                                onChange={e => handleSplitChange(m._id, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            )}

            <button type="submit" className="w-full bg-blue-500 text-white font-bold py-2 rounded">
                Save Expense
            </button>
        </form>
    );
};

export default AddExpense;
