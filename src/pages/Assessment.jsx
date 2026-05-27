import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import {
  Menu,
  Compass,
  Terminal,
  ChevronRight,
  Activity,
  Target,
} from "lucide-react";
import toast from "react-hot-toast";

const Assessment = () => {
  const { token } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  // States
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // User ki choices save karenge
  const [results, setResults] = useState(null);

  const startDiscovery = async () => {
    setIsGenerating(true);
    setQuestions([]);
    setAnswers([]);
    setResults(null);
    setCurrentIndex(0);

    const loadingToast = toast.loading("Initializing Discovery Engine...", {
      style: {
        borderRadius: "0",
        background: "#0f172a",
        color: "#14b8a6",
        border: "1px solid #14b8a6",
      },
    });

    try {
      const res = await axios.post(
        "https://technavigatorbackend.onrender.com/api/quiz/generate",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        toast.success("Module Loaded!", { id: loadingToast });
        setQuestions(res.data.quiz);
      }
    } catch (error) {
      toast.error("Compilation Failed.", { id: loadingToast });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (option) => {
    // Answer record karo
    const currentQnA = {
      question: questions[currentIndex].question,
      selectedOption: option,
    };
    const newAnswers = [...answers, currentQnA];
    setAnswers(newAnswers);

    // Aage badho ya Finish karo
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      submitForAnalysis(newAnswers);
    }
  };

  const submitForAnalysis = async (finalAnswers) => {
    setIsAnalyzing(true);
    try {
      const res = await axios.post(
        "https://technavigatorbackend.onrender.com/api/quiz/analyze",
        { qnaHistory: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (res.data.success) {
        setResults(res.data.recommendations);
      }
    } catch (error) {
      toast.error("Analysis Failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-darkBg overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 z-10 shadow-md">
          <div className="flex items-center gap-2">
            <Compass className="text-teal-500 w-6 h-6" />
            <span className="font-mono font-bold tracking-widest text-slate-100">
              DISCOVERY
            </span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-teal-400 p-1.5 border border-teal-500/30 bg-teal-950/20 active:bg-teal-500 active:text-darkBg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 relative z-0 flex flex-col">
          <div className="max-w-4xl mx-auto w-full animate-page-in flex-1 flex flex-col">
            <div className="mb-6 md:mb-8 pb-4 border-b border-slate-800">
              <h1 className="text-2xl md:text-3xl font-mono font-bold tracking-widest text-slate-100 uppercase mb-2">
                Career_Discovery_Engine
              </h1>
              <p className="font-mono text-slate-400 text-xs md:text-sm">
                Find your ideal path in the tech industry based on your natural
                interests.
              </p>
            </div>

            {/* INITIAL STATE */}
            {!isGenerating &&
              questions.length === 0 &&
              !results &&
              !isAnalyzing && (
                <div className="bg-slate-900 border border-slate-800 p-8 relative max-w-xl mx-auto w-full mt-10 text-center">
                  <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/50"></div>
                  <Compass className="w-16 h-16 text-teal-500 mb-6 mx-auto" />
                  <h2 className="text-xl font-mono text-slate-100 mb-4 uppercase tracking-widest">
                    Find Your True Path
                  </h2>
                  <p className="font-mono text-slate-400 text-sm mb-8">
                    No right or wrong answers. We analyze your personality,
                    problem-solving approach, and interests to recommend the top
                    tech careers for you out of our database.
                  </p>
                  <button
                    onClick={startDiscovery}
                    className="btn-tech w-full flex items-center justify-center gap-2"
                  >
                    START_DIAGNOSTIC <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            {/* LOADING STATES */}
            {(isGenerating || isAnalyzing) && (
              <div className="flex-1 flex flex-col items-center justify-center text-teal-500 animate-pulse space-y-4">
                <Activity className="w-16 h-16" />
                <p className="font-mono text-sm tracking-widest">
                  {isGenerating
                    ? "SYNTHESIZING_SCENARIOS..."
                    : "COMPUTING_IDEAL_CAREERS..."}
                </p>
              </div>
            )}

            {/* QUIZ ACTIVE STATE */}
            {questions.length > 0 && !isAnalyzing && !results && (
              <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                <div className="mb-4">
                  <div className="flex justify-between font-mono text-xs text-slate-400 mb-2">
                    <span>PROGRESS</span>
                    <span>
                      {Math.round((currentIndex / questions.length) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-800">
                    <div
                      className="h-full bg-teal-500 transition-all duration-300"
                      style={{
                        width: `${(currentIndex / questions.length) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 mt-4">
                  <h3 className="font-mono text-lg text-slate-100 mb-8 leading-relaxed">
                    <span className="text-teal-500 mr-2">{">"}</span>
                    {questions[currentIndex].question}
                  </h3>

                  <div className="space-y-3">
                    {questions[currentIndex].options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(opt)}
                        className="w-full text-left p-4 border border-slate-700 bg-slate-800/30 text-slate-300 hover:border-teal-500 hover:bg-slate-800 hover:text-teal-400 font-mono text-sm transition-all group"
                      >
                        <span className="opacity-50 mr-3 group-hover:text-teal-500">
                          [{idx + 1}]
                        </span>{" "}
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS STATE */}
            {results && (
              <div className="flex-1 flex flex-col w-full">
                <h2 className="text-xl font-mono text-teal-400 uppercase mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5" /> Recommended_Trajectories
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.map((career, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 border border-slate-800 p-6 relative group hover:border-teal-500/50 transition-colors flex flex-col justify-between"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-teal-500/20 group-hover:bg-teal-500 transition-colors"></div>

                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-mono text-slate-100 uppercase tracking-wide">
                            {career.title}
                          </h3>
                          <span className="px-2 py-1 bg-teal-950/30 border border-teal-500/50 text-teal-400 font-mono text-[10px]">
                            {career.match}% MATCH
                          </span>
                        </div>

                        <p className="text-sm font-sans text-slate-400 mb-6 leading-relaxed">
                          {career.reason}
                        </p>
                      </div>

                      {/* INTERACTIVE CONNECTOR BUTTON */}
                      <button
                        onClick={() =>
                          navigate("/roadmaps", {
                            state: { targetRole: career.title },
                          })
                        }
                        className="w-full text-center py-2.5 border border-teal-500/30 text-teal-400 bg-teal-950/10 font-mono text-xs uppercase tracking-wider hover:bg-teal-500 hover:text-darkBg transition-all duration-300"
                      >
                        LAUNCH_ROADMAP_ENGINE_&gt;
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-10 text-center">
                  <button
                    onClick={() => setResults(null)}
                    className="text-teal-500 hover:text-teal-400 font-mono text-sm underline decoration-teal-500/30 underline-offset-4"
                  >
                    Retake Diagnostic Sequence
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
