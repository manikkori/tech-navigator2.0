import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Terminal, Mail, Lock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Backend server ka API URL
            const res = await axios.post('https://technavigatorbackend.onrender.com/api/auth/login', { email, password });
            
            if (res.data.success) {
                toast.success(res.data.message, {
                    style: { borderRadius: '0', background: '#0f172a', color: '#14b8a6', border: '1px solid #14b8a6' }
                });
                login(res.data.user, res.data.token);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed!", {
                style: { borderRadius: '0', background: '#0f172a', color: '#ef4444', border: '1px solid #ef4444' }
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 animate-page-in">
            {/* Geometric Card Container */}
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 shadow-[8px_8px_0px_0px_rgba(20,184,166,0.2)] p-8 relative">
                
                {/* Tech Accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-teal-500"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-teal-500"></div>

                <div className="flex items-center gap-3 mb-8">
                    <Terminal className="text-teal-500 w-8 h-8" />
                    <h2 className="text-2xl font-mono text-slate-100 uppercase tracking-widest font-bold">
                        System_Login
                    </h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-teal-500 uppercase tracking-wider">Email_Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                className="input-tech pl-11"
                                placeholder="developer@system.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-teal-500 uppercase tracking-wider">Security_Key</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3.5 text-slate-500 w-5 h-5" />
                            <input 
                                type="password" 
                                required
                                className="input-tech pl-11"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-tech w-full flex items-center justify-center gap-2 mt-4">
                        AUTHENTICATE <ChevronRight className="w-4 h-4" />
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                    <p className="text-sm font-mono text-slate-400">
                        New entity detected? <Link to="/signup" className="text-teal-400 hover:text-teal-300 underline decoration-teal-500/30 underline-offset-4 transition-all">Initialize Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
