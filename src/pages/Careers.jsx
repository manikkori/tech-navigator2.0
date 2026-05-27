import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Menu, Compass, Plus, ServerCrash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'; // YEH NAYI LINE ADD KI HAI

const Careers = () => {
    const { user, token } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [careers, setCareers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate(); // YEH NAYI LINE ADD KI HAI

    // Form state for Admin
    const [formData, setFormData] = useState({
        title: '', description: '', topSkills: '', marketDemand: 'Medium', avgSalary: ''
    });

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        try {
            const res = await axios.get('https://technavigatorbackend.onrender.com/api/careers');
            setCareers(res.data.careers);
            setIsLoading(false);
        } catch (error) {
            toast.error("Failed to load career data!");
            setIsLoading(false);
        }
    };

    const handleAddCareer = async (e) => {
        e.preventDefault();
        try {
            const formattedData = {
                ...formData,
                topSkills: formData.topSkills.split(',').map(skill => skill.trim())
            };

            const res = await axios.post('https://technavigatorbackend.onrender.com/api/careers', formattedData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success("Career added to database!", {
                    style: { borderRadius: '0', background: '#0f172a', color: '#14b8a6', border: '1px solid #14b8a6' }
                });
                setFormData({ title: '', description: '', topSkills: '', marketDemand: 'Medium', avgSalary: '' });
                fetchCareers();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add career");
        }
    };

    return (
        <div className="flex h-screen w-full bg-darkBg overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <Compass className="text-teal-500 w-6 h-6" />
                        <span className="font-mono font-bold tracking-widest text-slate-100">CAREERS</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-teal-400 p-1.5 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-0">
                    <div className="max-w-6xl mx-auto animate-page-in">
                        
                        <div className="mb-6 md:mb-8 pb-4 border-b border-slate-800">
                            <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-slate-100 uppercase mb-2">
                                Career_Database
                            </h1>
                            <p className="font-mono text-slate-400 text-xs md:text-sm">
                                Master registry of technical professions and market data.
                            </p>
                        </div>

                        {/* Admin Only Section */}
                        {user?.role === 'admin' && (
                            <div className="mb-10 bg-slate-900 border border-teal-500/30 p-6 relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/20"></div>
                                <h3 className="font-mono text-teal-400 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                                    Admin_Command: Inject_New_Career
                                </h3>
                                <form onSubmit={handleAddCareer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Career Title (e.g. MERN Developer)" required className="input-tech"
                                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    <input type="text" placeholder="Avg Salary (e.g. ₹8LPA - ₹15LPA)" required className="input-tech"
                                        value={formData.avgSalary} onChange={e => setFormData({...formData, avgSalary: e.target.value})} />
                                    <input type="text" placeholder="Top Skills (comma separated)" required className="input-tech"
                                        value={formData.topSkills} onChange={e => setFormData({...formData, topSkills: e.target.value})} />
                                    <select className="input-tech cursor-pointer appearance-none" 
                                        value={formData.marketDemand} onChange={e => setFormData({...formData, marketDemand: e.target.value})}>
                                        <option value="High">Demand: High</option>
                                        <option value="Medium">Demand: Medium</option>
                                        <option value="Low">Demand: Low</option>
                                    </select>
                                    <textarea placeholder="Short Description..." required className="input-tech md:col-span-2 h-20 resize-none"
                                        value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
                                    <button type="submit" className="btn-tech md:col-span-2">EXECUTE_INJECTION</button>
                                </form>
                            </div>
                        )}

                        {/* Careers Grid */}
                        {isLoading ? (
                            <div className="text-center font-mono text-teal-500 animate-pulse py-10">FETCHING_DATABASE_RECORDS...</div>
                        ) : careers.length === 0 ? (
                            <div className="text-center border border-dashed border-slate-700 py-16 flex flex-col items-center">
                                <ServerCrash className="w-12 h-12 text-slate-600 mb-3" />
                                <p className="font-mono text-slate-500">Database is empty.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {careers.map((career) => (
                                    <div key={career._id} className="bg-slate-900 border border-slate-800 p-6 relative group hover:border-teal-500/50 transition-colors flex flex-col justify-between">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-700 group-hover:bg-teal-500 transition-colors"></div>
                                        
                                        <div>
                                            <h2 className="text-lg font-mono text-slate-100 uppercase tracking-wide mb-2">{career.title}</h2>
                                            <p className="text-xs font-sans text-slate-400 mb-4 line-clamp-3">{career.description}</p>
                                            
                                            <div className="mb-4 flex flex-wrap gap-2">
                                                {career.topSkills.map((skill, index) => (
                                                    <span key={index} className="px-2 py-1 bg-slate-800 border border-slate-700 text-[10px] font-mono text-teal-300">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <div className="flex justify-between items-end border-t border-slate-800 pt-3 mb-4">
                                                <div>
                                                    <p className="text-[10px] font-mono text-slate-500 uppercase">Est_Salary</p>
                                                    <p className="font-mono text-slate-300 text-sm">{career.avgSalary}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-mono text-slate-500 uppercase">Demand</p>
                                                    <p className={`font-mono text-sm ${career.marketDemand === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                        {career.marketDemand}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 🛠️ THE FIX: Interactive cross-page button */}
                                            <button 
                                                onClick={() => navigate('/roadmaps', { state: { targetRole: career.title } })}
                                                className="w-full text-center py-2.5 border border-teal-500/30 text-teal-400 bg-teal-950/10 font-mono text-xs uppercase tracking-wider hover:bg-teal-500 hover:text-darkBg transition-all duration-300"
                                            >
                                                INITIALIZE_ROADMAP_&gt;
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;