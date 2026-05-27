import { useState } from 'react';
import axios from 'axios';
import { Terminal, Mail, Lock, User, GraduationCap, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        targetDegree: '',
        adminSecret: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            
            if (res.data.success) {
                toast.success("Entity Registered! Proceed to Login.", {
                    style: { borderRadius: '0', background: '#0f172a', color: '#14b8a6', border: '1px solid #14b8a6' }
                });
                navigate('/login'); // Signup ke baad seedha login par bhej denge
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Initialization Failed!", {
                style: { borderRadius: '0', background: '#0f172a', color: '#ef4444', border: '1px solid #ef4444' }
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-page-in py-12">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-[8px_8px_0px_0px_rgba(20,184,166,0.2)] p-8 relative">
                
                {/* Tech Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-500"></div>

                <div className="flex items-center gap-3 mb-8">
                    <Terminal className="text-teal-500 w-8 h-8" />
                    <h2 className="text-2xl font-mono text-slate-100 uppercase tracking-widest font-bold">
                        New_Entity
                    </h2>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-xs font-mono text-teal-500 uppercase tracking-wider">Full_Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                            <input 
                                type="text" 
                                name="name"
                                required
                                className="input-tech pl-11"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-mono text-teal-500 uppercase tracking-wider">Email_Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                            <input 
                                type="email" 
                                name="email"
                                required
                                className="input-tech pl-11"
                                placeholder="developer@system.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-mono text-teal-500 uppercase tracking-wider">Security_Key</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                            <input 
                                type="password" 
                                name="password"
                                required
                                className="input-tech pl-11"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-mono text-teal-500 uppercase tracking-wider">Target_Degree</label>
                        <div className="relative">
                            <GraduationCap className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                            <input 
                                type="text" 
                                name="targetDegree"
                                required
                                className="input-tech pl-11"
                                placeholder="e.g. MCA, BTech, BCA"
                                value={formData.targetDegree}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {/* Admin Override (Optional) */}
                    <div className="space-y-1.5 pt-2">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">System_Override (Optional)</label>
                        <div className="relative">
                            <Terminal className="absolute left-3 top-3.5 text-slate-600 w-4 h-4" />
                            <input 
                                type="password" 
                                name="adminSecret"
                                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700/50 border-l-2 border-l-slate-600 font-mono text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-teal-500/50 focus:border-l-teal-500 transition-all pl-10"
                                placeholder="Admin Secret Key"
                                value={formData.adminSecret}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="btn-tech w-full flex items-center justify-center gap-2 mt-6">
                        INITIALIZE <ChevronRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-sm font-mono text-slate-400">
                        Entity already exists? <Link to="/login" className="text-teal-400 hover:text-teal-300 underline decoration-teal-500/30 underline-offset-4 transition-all">Execute Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;