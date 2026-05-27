import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Menu, LayoutDashboard, Users, Compass, Terminal, Activity, Server, Database } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { token, user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            if (!token) return;
            try {
                const res = await axios.get('http://localhost:5000/api/dashboard/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data.success) {
                    setStats(res.data.stats);
                }
            } catch (error) {
                toast.error("Failed to sync system metrics.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    return (
        <div className="flex h-screen w-full bg-darkBg overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <LayoutDashboard className="text-teal-500 w-6 h-6" />
                        <span className="font-mono font-bold tracking-widest text-slate-100">SYSTEM_STATUS</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-teal-400 p-1.5 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-0">
                    <div className="max-w-6xl mx-auto animate-page-in">
                        
                        <div className="mb-6 md:mb-10 pb-4 border-b border-slate-800 flex justify-between items-end">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-slate-100 uppercase mb-2">
                                    Command_Center
                                </h1>
                                <p className="font-mono text-slate-400 text-xs md:text-sm">
                                    Welcome back, Developer {user?.name || 'Operator'}. System metrics are online.
                                </p>
                            </div>
                            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-950/30 border border-green-500/30">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="font-mono text-green-400 text-[10px] uppercase">Connection Stable</span>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-teal-500 space-y-4">
                                <Activity className="w-12 h-12 animate-spin" />
                                <p className="font-mono text-sm tracking-widest animate-pulse">SYNCING_CORE_DATABASES...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Top Row - Primary Metrics */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Users Metric */}
                                    <div className="bg-slate-900 border border-slate-800 p-6 relative group hover:border-teal-500/50 transition-colors">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-700 group-hover:bg-teal-500 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <Users className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                            <span className="font-mono text-[10px] text-slate-500 uppercase">Registered</span>
                                        </div>
                                        <div className="text-4xl font-mono text-slate-100 mb-1">{stats?.users || 0}</div>
                                        <div className="font-mono text-xs text-slate-400">Total System Operators</div>
                                    </div>

                                    {/* Careers Metric */}
                                    <div className="bg-slate-900 border border-slate-800 p-6 relative group hover:border-teal-500/50 transition-colors">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-700 group-hover:bg-teal-500 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <Compass className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                            <span className="font-mono text-[10px] text-slate-500 uppercase">Database</span>
                                        </div>
                                        <div className="text-4xl font-mono text-slate-100 mb-1">{stats?.careers || 0}</div>
                                        <div className="font-mono text-xs text-slate-400">Tech Career Trajectories</div>
                                    </div>

                                    {/* Roadmaps Metric */}
                                    <div className="bg-slate-900 border border-slate-800 p-6 relative group hover:border-teal-500/50 transition-colors">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-700 group-hover:bg-teal-500 transition-colors"></div>
                                        <div className="flex justify-between items-start mb-4">
                                            <Terminal className="w-6 h-6 text-slate-400 group-hover:text-teal-400 transition-colors" />
                                            <span className="font-mono text-[10px] text-slate-500 uppercase">Generated</span>
                                        </div>
                                        <div className="text-4xl font-mono text-slate-100 mb-1">{stats?.roadmaps || 0}</div>
                                        <div className="font-mono text-xs text-slate-400">AI Roadmaps Synthesized</div>
                                    </div>
                                </div>

                                {/* Bottom Row - Server Details */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-900 border border-slate-800 p-6 flex items-center gap-4">
                                        <div className="p-3 bg-teal-950/30 border border-teal-500/30">
                                            <Server className="w-6 h-6 text-teal-400" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">Server_Status</div>
                                            <div className="font-mono text-teal-400 font-bold">{stats?.serverStatus || 'OFFLINE'}</div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-900 border border-slate-800 p-6 flex items-center gap-4">
                                        <div className="p-3 bg-teal-950/30 border border-teal-500/30">
                                            <Database className="w-6 h-6 text-teal-400" />
                                        </div>
                                        <div>
                                            <div className="font-mono text-xs text-slate-500 uppercase tracking-wider mb-1">Database_Health</div>
                                            <div className="font-mono text-teal-400 font-bold">{stats?.systemHealth || 'UNKNOWN'}</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;