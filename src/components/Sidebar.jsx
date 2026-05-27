import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit } from 'lucide-react';
import { Terminal, LayoutDashboard, Compass, FileText, LogOut, X, Users as UsersIcon } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Base menu items (Sabko dikhenge)
    const menuItems = [
        { name: 'SYSTEM_STATUS', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'CAREER_DATABASE', icon: Compass, path: '/careers' },
        { name: 'AI_ROADMAPS', icon: Terminal, path: '/roadmaps' },
        { name: 'RESUME_SCANNER', icon: FileText, path: '/resume-scan' },
        { name: 'EVALUATION', icon: BrainCircuit, path: '/assessment' },
    ];

    // Agar user admin hai, toh Registry tab add kar do
    if (user?.role === 'admin') {
        menuItems.push({ name: 'USER_REGISTRY', icon: UsersIcon, path: '/users' });
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out flex flex-col md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Header Area (Desktop Logo + Mobile Close Button) */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <Terminal className="text-teal-500 w-8 h-8" />
                        <h2 className="text-xl font-mono text-slate-100 uppercase tracking-widest font-bold md:block">
                            NAVIGATOR
                        </h2>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-teal-400 p-1 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="p-4 border-b border-slate-800 bg-slate-800/30">
                    <p className="text-xs font-mono text-teal-500 uppercase tracking-wider mb-1">Current_User:</p>
                    <p className="font-mono text-slate-200 truncate">{user?.name || 'UNKNOWN_ENTITY'}</p>
                    <p className="text-[10px] font-mono text-slate-500 uppercase mt-1">Role: {user?.role || 'STUDENT'}</p>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)} // Mobile par link click karte hi menu band ho jayega
                            className={({ isActive }) => 
                                `flex items-center gap-3 px-6 py-3 font-mono text-sm tracking-wider transition-all duration-200 ${
                                    isActive 
                                    ? 'bg-teal-500/10 text-teal-400 border-r-4 border-teal-500' 
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </div>

                {/* Logout Button */}
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="btn-tech w-full flex items-center justify-center gap-2 border-red-500/50 text-red-400 bg-red-950/20 hover:bg-red-500/20 hover:text-red-300">
                        <LogOut className="w-4 h-4" /> DISCONNECT
                    </button>
                </div>
            </div>

            {/* Mobile Overlay Background */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-darkBg/80 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;