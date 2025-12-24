import { useState, useEffect } from 'react';
import { createGroup, getUsers } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateGroup = () => {
    const [name, setName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await getUsers();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const handleCheckboxChange = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createGroup({ name, members: selectedMembers });
            toast.success('Group Created!');
            navigate('/');
        } catch (error) {
            const msg = error.response?.data?.message || error.message;
            toast.error('Error: ' + msg);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Create Group</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Group Name</label>
                    <input
                        type="text"
                        className="w-full border rounded px-3 py-2"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-bold mb-2">Select Members</label>
                    <div className="max-h-40 overflow-y-auto border rounded p-2">
                        {users.map(user => (
                            <div key={user._id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={user._id}
                                    onChange={() => handleCheckboxChange(user._id)}
                                    className="mr-2"
                                />
                                <label htmlFor={user._id}>{user.name} ({user.email})</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600"
                >
                    Create Group
                </button>
            </form>
        </div>
    );
};

export default CreateGroup;
