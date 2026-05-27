import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Menu, FileText, UploadCloud, Target, Activity, ChevronRight, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const ResumeScan = () => {
    const { token, user } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // States
    const [file, setFile] = useState(null);
    const [targetRole, setTargetRole] = useState('');
    const [isScanning, setIsScanning] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            toast.error("INVALID FORMAT: Only PDF files are accepted.", {
                style: { borderRadius: '0', background: '#0f172a', color: '#ef4444', border: '1px solid #ef4444' }
            });
            e.target.value = null; // Reset input
        }
    };

    const handleScan = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload a file first.");
            return;
        }

        setIsScanning(true);
        setAnalysis(null);
        
        const loadingToast = toast.loading("Extracting PDF data & Analyzing ATS...", {
            style: { borderRadius: '0', background: '#0f172a', color: '#14b8a6', border: '1px solid #14b8a6' }
        });

        // File bhejne ke liye FormData use karna padta hai
        const formData = new FormData();
        formData.append('resume', file);
        if (targetRole) {
            formData.append('targetRole', targetRole);
        }

        try {
            const res = await axios.post('https://technavigatorbackend.onrender.com/api/resume/analyze', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` 
                }
            });

            if (res.data.success) {
                toast.success("Scan Complete!", { id: loadingToast });
                setAnalysis(res.data.analysis);
            }
        } catch (error) {
            toast.error("Scan Failed. Document might be corrupted or too large.", { id: loadingToast });
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-darkBg overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10 shadow-md">
                    <div className="flex items-center gap-2">
                        <FileText className="text-teal-500 w-6 h-6" />
                        <span className="font-mono font-bold tracking-widest text-slate-100">SCANNER</span>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="text-teal-400 p-1.5 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-0">
                    <div className="max-w-6xl mx-auto animate-page-in">
                        
                        <div className="mb-6 md:mb-8 pb-4 border-b border-slate-800">
                            <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-slate-100 uppercase mb-2">
                                ATS_Scanner
                            </h1>
                            <p className="font-mono text-slate-400 text-xs md:text-sm">
                                Upload your PDF resume to detect missing skills and get an ATS compatibility score.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            
                            {/* Left Side: Upload Form */}
                            <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 relative h-fit">
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500/50"></div>
                                
                                <form onSubmit={handleScan} className="space-y-6">
                                    {/* Role Input */}
                                    <div>
                                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                            <Target className="w-4 h-4 text-teal-500" /> Target_Position (Optional)
                                        </label>
                                        <input 
                                            type="text" 
                                            className="input-tech" 
                                            placeholder={`e.g. SDE, AI Engineer (Default: ${user?.targetDegree || 'Tech'})`}
                                            value={targetRole} 
                                            onChange={e => setTargetRole(e.target.value)} 
                                        />
                                    </div>

                                    {/* File Dropzone / Uploader */}
                                    <div>
                                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 block">
                                            Document_Upload (PDF)
                                        </label>
                                        <div className="border-2 border-dashed border-slate-700 bg-slate-800/30 p-8 flex flex-col items-center justify-center text-center relative hover:border-teal-500/50 hover:bg-slate-800/50 transition-all cursor-pointer group">
                                            
                                            <input 
                                                type="file" 
                                                accept="application/pdf"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                            />
                                            
                                            {file ? (
                                                <>
                                                    <CheckCircle2 className="w-12 h-12 text-teal-500 mb-3" />
                                                    <p className="font-mono text-slate-200 text-sm">{file.name}</p>
                                                    <p className="font-mono text-slate-500 text-[10px] mt-1">Ready for scan</p>
                                                </>
                                            ) : (
                                                <>
                                                    <UploadCloud className="w-12 h-12 text-slate-500 mb-3 group-hover:text-teal-400 transition-colors" />
                                                    <p className="font-mono text-slate-300 text-sm">Click or Drag PDF here</p>
                                                    <p className="font-mono text-slate-600 text-[10px] mt-1">MAX SIZE: 5MB</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isScanning || !file} 
                                        className="btn-tech w-full flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isScanning ? 'ANALYZING...' : 'INITIATE_SCAN'} <ChevronRight className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>

                            {/* Right Side: Analysis Output */}
                            <div className="bg-slate-900 border border-slate-800 relative min-h-[400px] flex flex-col">
                                <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-teal-500" />
                                    <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Scan_Results</span>
                                </div>
                                <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                                    {isScanning ? (
                                        <div className="h-full flex flex-col items-center justify-center text-teal-500 animate-pulse space-y-4">
                                            <Activity className="w-12 h-12" />
                                            <p className="font-mono text-sm tracking-widest">PARSING_DOCUMENT...</p>
                                        </div>
                                    ) : analysis ? (
                                        <div className="prose prose-invert prose-teal max-w-none font-sans text-slate-300 
                                            prose-headings:font-mono prose-headings:text-slate-100 prose-headings:uppercase prose-headings:tracking-wide
                                            prose-a:text-teal-400 prose-strong:text-teal-300 prose-ul:list-square prose-li:marker:text-teal-500">
                                            <ReactMarkdown>{analysis}</ReactMarkdown>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-3">
                                            <FileText className="w-12 h-12 opacity-50" />
                                            <p className="font-mono text-sm text-center">Output will be displayed here.<br/>Awaiting document.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeScan;