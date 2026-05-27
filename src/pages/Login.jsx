import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    // AuthContext se direct 'login' function nikal rahe hain
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            
            const res = await axios.post('https://technavigatorbackend.onrender.com/api/auth/login', { email, password });
            
            if (res.data.success) {
                // Context wale login function ko call kiya
                login(res.data.token, res.data.user);
                
                toast.success("SYSTEM_ACCESS_GRANTED", {
                    style: { background: '#0f172a', color: '#14b8a6', border: '1px solid #14b8a6' }
                });
                
                // Seedha dashboard par bhej do
                navigate('/dashboard'); 
            }
        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.response?.data?.message || "Invalid Credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-darkBg flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-8 w-full max-w-md">
                <div className="flex items-center gap-2 mb-8 justify-center">
                    <Terminal className="text-teal-500 w-8 h-8" />
                    <h2 className="font-mono text-2xl font-bold text-slate-100 tracking-widest uppercase">SYS_LOGIN</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs text-slate-400 mb-2 uppercase">Email_Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 font-mono text-sm focus:border-teal-500 focus:outline-none transition-colors"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block font-mono text-xs text-slate-400 mb-2 uppercase">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-200 p-3 font-mono text-sm focus:border-teal-500 focus:outline-none transition-colors"
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-teal-500/20 text-teal-400 border border-teal-500/50 p-3 font-mono font-bold tracking-widest uppercase hover:bg-teal-500 hover:text-darkBg transition-all disabled:opacity-50"
                    >
                        {loading ? 'AUTHENTICATING...' : 'ENTER_SYSTEM'}
                    </button>
                </form>

                <p className="mt-6 text-center font-mono text-xs text-slate-500">
                    NEW_OPERATOR? <Link to="/register" className="text-teal-400 hover:underline">REGISTER_HERE</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
