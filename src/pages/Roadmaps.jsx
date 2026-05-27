import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import {
  Menu,
  Terminal,
  Cpu,
  History,
  ChevronRight,
  MessageSquareCode,
} from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";

const Roadmaps = () => {
  const { token } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Form & UI States
  const [formData, setFormData] = useState({
    careerTitle: "",
    currentSkills: "",
    language: "English",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [history, setHistory] = useState([]);

  // Live Doubt Chat States
  const [userDoubt, setUserDoubt] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatLog, setChatLog] = useState([]); // Local storage for chat session

  useEffect(() => {
    fetchHistory();
  }, [token]);

  useEffect(() => {
    if (location.state?.targetRole) {
      setFormData((prev) => ({
        ...prev,
        careerTitle: location.state.targetRole,
      }));
    }
  }, [location.state]);

  const fetchHistory = async () => {
    if (!token) return;
    try {
      const res = await axios.get(
        "https://technavigatorbackend.onrender.com/api/roadmaps/my-roadmaps",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        setHistory(res.data.roadmaps);
      }
    } catch (error) {
      console.error("History engine synced failed.");
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setActiveRoadmap(null);
    setChatLog([]); // Reset chat for new roadmap

    const loadingToast = toast.loading(
      "AI is synthesizing your trajectory...",
      {
        style: {
          borderRadius: "0",
          background: "#0f172a",
          color: "#14b8a6",
          border: "1px solid #14b8a6",
        },
      },
    );

    try {
      const res = await axios.post(
        "https://technavigatorbackend.onrender.com/api/roadmaps/generate",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        toast.success("Trajectory Generated!", { id: loadingToast });
        setActiveRoadmap(res.data.roadmap.aiGeneratedPlan);
        fetchHistory(); // Immediate reload history database
      }
    } catch (error) {
      toast.error("Generation Failed.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  // 🔥 NAYA FEATURE: Download Roadmap as a File
  const downloadRoadmap = () => {
    if (!activeRoadmap) return;

    // Blob memory banakar direct text/markdown download karvana
    const blob = new Blob([activeRoadmap], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${formData.careerTitle.replace(/\s+/g, "_")}_Roadmap.md`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Matrix Downloaded Successfully!", {
      style: {
        borderRadius: "0",
        background: "#0f172a",
        color: "#14b8a6",
        border: "1px solid #14b8a6",
      },
    });
  };

  // 🔥 SAFE Doubt Handler Function
  const handleAskDoubt = async (e) => {
    e.preventDefault();
    if (!userDoubt.trim()) return;

    const currentQuery = userDoubt;
    setUserDoubt("");
    setChatLoading(true);

    // Student query ko strictly text maan kar array me daalna
    setChatLog((prev) => [
      ...prev,
      { type: "user", text: String(currentQuery) },
    ]);

    try {
      // String() se crash proofing
      const safeContext = activeRoadmap
        ? String(activeRoadmap).substring(0, 1000)
        : "Tech Path";

      const res = await axios.post(
        "https://technavigatorbackend.onrender.com/api/roadmaps/ask-doubt",
        {
          question: currentQuery,
          roadmapContext: safeContext,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (res.data.success) {
        // AI Response ko bhi strictly text banana
        setChatLog((prev) => [
          ...prev,
          { type: "ai", text: String(res.data.answer) },
        ]);
      } else {
        toast.error("Mentor returned an error.");
      }
    } catch (error) {
      console.error("Chat Error:", error);
      toast.error("AI Mentor is currently unreachable.");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-darkBg overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10 shadow-md">
          <div className="flex items-center gap-2">
            <Terminal className="text-teal-500 w-6 h-6" />
            <span className="font-mono font-bold tracking-widest text-slate-100">
              ROADMAPS
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-teal-400 p-1.5 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Frame */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-0">
          <div className="max-w-7xl mx-auto animate-page-in">
            <div className="mb-6 md:mb-8 pb-4 border-b border-slate-800">
              <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-slate-100 uppercase mb-2">
                AI_Trajectory_Engine
              </h1>
              <p className="font-mono text-slate-400 text-xs md:text-sm">
                Custom engineering paths integrated with a real-time guidance
                terminal.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Left Box: Form & Logs */}
              <div className="space-y-6 lg:col-span-1">
                <div className="bg-slate-900 border border-slate-800 p-6 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50"></div>
                  <h3 className="font-mono text-teal-400 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                    <Cpu className="w-4 h-4" /> Parameters
                  </h3>
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 block">
                        Target Position
                      </label>
                      <input
                        type="text"
                        required
                        className="input-tech"
                        placeholder="e.g. MERN Developer"
                        value={formData.careerTitle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            careerTitle: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 block">
                        Current Stack
                      </label>
                      <textarea
                        required
                        className="input-tech h-24 resize-none"
                        placeholder="e.g. HTML, CSS, basics of JS"
                        value={formData.currentSkills}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentSkills: e.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1 block">
                        Language
                      </label>
                      <select
                        className="input-tech cursor-pointer appearance-none"
                        value={formData.language}
                        onChange={(e) =>
                          setFormData({ ...formData, language: e.target.value })
                        }
                      >
                        <option value="English">English</option>
                        <option value="Hinglish">
                          Hinglish (Hindi + English)
                        </option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className="btn-tech w-full flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                    >
                      {isGenerating ? "PROCESSING..." : "INITIALIZE_ENGINE"}{" "}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {/* History Logs Box */}
                <div className="bg-slate-900 border border-slate-800 p-6">
                  <h3 className="font-mono text-slate-300 mb-4 flex items-center gap-2 uppercase tracking-widest text-sm">
                    <History className="w-4 h-4 text-teal-500" /> Previous_Logs
                  </h3>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2">
                    {history.length === 0 ? (
                      <p className="text-xs font-mono text-slate-500">
                        Database empty or loading...
                      </p>
                    ) : (
                      history.map((log) => (
                        <button
                          key={log._id}
                          onClick={() => {
                            setActiveRoadmap(log.aiGeneratedPlan);
                            setChatLog([]);
                          }}
                          className="w-full text-left p-3 bg-slate-800/50 border border-slate-700 hover:border-teal-500/50 transition-colors group rounded-none"
                        >
                          <p className="font-mono text-slate-200 text-xs truncate group-hover:text-teal-300 uppercase font-bold">
                            {log.careerTitle}
                          </p>
                          <p className="font-mono text-slate-500 text-[9px] mt-1">
                            {new Date(log.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Box: Output + Chat doubt panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-slate-900 border border-slate-800 min-h-[400px] max-h-[600px] overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-slate-800 bg-slate-800/30 flex items-center gap-2">
                    <div className="w-2 h-2 bg-teal-500"></div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      {activeRoadmap && !isGenerating && (
                        <button
                          onClick={downloadRoadmap}
                          className="text-[10px] font-mono text-teal-400 hover:text-darkBg border border-teal-500/30 px-3 py-1 bg-teal-950/20 uppercase hover:bg-teal-500 transition-colors"
                        >
                          DOWNLOAD_ROADMAP
                        </button>
                      )}
                    </span>
                  </div>

                  <div className="p-6 md:p-8 flex-1 overflow-y-auto">
                    {isGenerating ? (
                      <div className="h-full flex flex-col items-center justify-center text-teal-500 animate-pulse space-y-3">
                        <Cpu className="w-10 h-10 animate-spin" />
                        <p className="font-mono text-xs tracking-widest">
                          SYNTHESIZING_MATRIX...
                        </p>
                      </div>
                    ) : activeRoadmap ? (
                      <div
                        className="prose prose-invert prose-teal max-w-none font-sans text-slate-300 text-sm md:text-base
                                                prose-headings:font-mono prose-headings:text-slate-100 prose-headings:uppercase 
                                                prose-strong:text-teal-400 prose-ul:list-square prose-li:marker:text-teal-500"
                      >
                        <ReactMarkdown>{activeRoadmap}</ReactMarkdown>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-20">
                        <Terminal className="w-10 h-10 opacity-40" />
                        <p className="font-mono text-xs">
                          System idle. Awaiting configuration launch.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 🔥 DOUBT SOLVER CHAT INTERFACE */}
                {activeRoadmap && (
                  <div className="bg-slate-900 border border-slate-800 p-4 md:p-6 flex flex-col relative">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-teal-500/30"></div>
                    <div className="flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-widest mb-4">
                      <MessageSquareCode className="w-4 h-4" />{" "}
                      AI_Guidance_Terminal_v2.0
                    </div>

                    {/* Dynamic Chat Logs (CRASH PROOF) */}
                    <div className="space-y-3 mb-4 max-h-[250px] overflow-y-auto font-mono text-xs md:text-sm pr-2">
                      {chatLog.map((msg, index) => (
                        <div
                          key={index}
                          className={`p-3 border ${msg.type === "user" ? "border-slate-800 bg-slate-800/20 text-slate-300 ml-8" : "border-teal-500/20 bg-teal-950/10 text-teal-300 mr-8"}`}
                        >
                          <span className="font-bold block text-[10px] text-slate-500 mb-1 uppercase">
                            {msg.type === "user"
                              ? "STUDENT_QUERY"
                              : "MENTOR_FEEDBACK"}
                          </span>

                          {/* THE FIX: Safe Text Rendering */}
                          {msg.type === "user" ? (
                            <span>{msg.text}</span>
                          ) : (
                            <div className="prose prose-invert prose-sm max-w-none text-xs">
                              <ReactMarkdown>
                                {msg.text || "Loading..."}
                              </ReactMarkdown>
                            </div>
                          )}
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="text-teal-500 animate-pulse text-xs">
                          AI_MENTOR IS TYPING...
                        </div>
                      )}
                    </div>
                    {/* Chat Input */}
                    <form onSubmit={handleAskDoubt} className="flex gap-2">
                      <input
                        type="text"
                        className="input-tech py-2 text-xs md:text-sm"
                        placeholder="Ask any doubt about this roadmap path..."
                        value={userDoubt}
                        onChange={(e) => setUserDoubt(e.target.value)}
                        disabled={chatLoading}
                      />
                      <button
                        type="submit"
                        disabled={chatLoading}
                        className="btn-tech py-2 px-4 text-xs"
                      >
                        ASK
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
