import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Menu, Users as UsersIcon, ShieldAlert, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Users = () => {
    const { user, token } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [usersList, setUsersList] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsersList(res.data.users);
        } catch (error) {
            toast.error("Failed to load entity registry!");
        }
    };

    const handleDelete = async (id, role) => {
        if (role === 'admin') {
            toast.error("Cannot terminate another Admin!");
            return;
        }
        
        if (window.confirm("WARNING: Are you sure you want to terminate this entity?")) {
            try {
                const res = await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    toast.success(res.data.message, { style: { borderRadius: '0', background: '#0f172a', color: '#14b8a6', border: '1px solid #14b8a6' }});
                    setUsersList(usersList.filter(u => u._id !== id));
                }
            } catch (error) {
                toast.error("Termination Failed!");
            }
        }
    };

    // Agar normal student is page par aane ki koshish kare
    if (user?.role !== 'admin') {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-darkBg text-red-500 font-mono">
                <ShieldAlert className="w-16 h-16 mb-4 animate-pulse" />
                <h1 className="text-2xl">ACCESS DENIED</h1>
                <p className="text-sm text-slate-500 mt-2">Clearance Level: Admin Required.</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-darkBg overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <UsersIcon className="text-teal-500 w-6 h-6" />
                        <span className="font-mono font-bold tracking-widest text-slate-100">REGISTRY</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-teal-400 p-1.5 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-0">
                    <div className="max-w-6xl mx-auto animate-page-in">
                        <div className="mb-6 md:mb-8 pb-4 border-b border-slate-800">
                            <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-slate-100 uppercase mb-2">
                                Entity_Registry
                            </h1>
                            <p className="font-mono text-slate-400 text-xs md:text-sm">
                                Complete list of registered users. Terminate rogue entities here.
                            </p>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 overflow-x-auto">
                            <table className="w-full text-left font-mono text-sm text-slate-300">
                                <thead className="bg-slate-800 text-teal-500 text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-4 border-b border-slate-700">Name</th>
                                        <th className="px-6 py-4 border-b border-slate-700">Email</th>
                                        <th className="px-6 py-4 border-b border-slate-700">Degree</th>
                                        <th className="px-6 py-4 border-b border-slate-700">Role</th>
                                        <th className="px-6 py-4 border-b border-slate-700 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {usersList.map((u) => (
                                        <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                            <td className="px-6 py-4 font-bold text-slate-200">{u.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{u.email}</td>
                                            <td className="px-6 py-4">{u.targetDegree}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-[10px] border ${u.role === 'admin' ? 'border-teal-500 text-teal-400 bg-teal-950/30' : 'border-slate-600 text-slate-400'}`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete(u._id, u.role)}
                                                    className="p-2 border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-darkBg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={u.role === 'admin'}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;