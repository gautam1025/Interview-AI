import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { Loader2, Send, AlertCircle, FileQuestion, Mic, Square, MicOff, Code } from "lucide-react";
import Editor from "@monaco-editor/react";

function Interview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isRecording, setIsRecording] = useState(null); // stores the index of the question currently being recorded
  const [speechError, setSpeechError] = useState("");
  const [activeEditors, setActiveEditors] = useState({}); // tracks { index: boolean } for code editor toggle
  const [editorLanguages, setEditorLanguages] = useState({}); // tracks { index: string } for selected language

  // Reference for the active SpeechRecognition instance
  const recognitionRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await API.get(`/interview/${id}`);
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(""));
      } catch {
        setError("Failed to load interview questions.");
      } finally {
        setLoading(false);
      }
    })();

    // Cleanup function: stop mic if component unmounts while recording
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [id]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const toggleEditor = (index) => {
    setActiveEditors(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    // Default to javascript if no language is selected yet
    if (!editorLanguages[index]) {
       setEditorLanguages(prev => ({ ...prev, [index]: 'javascript' }));
    }
  };

  const changeLanguage = (index, lang) => {
    setEditorLanguages(prev => ({ ...prev, [index]: lang }));
  };

  const startRecording = (index) => {
    setSpeechError("");
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Your browser doesn't support speech recognition. Please use Google Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAnswers(prev => {
          const updated = [...prev];
          updated[index] = updated[index] + (updated[index] ? " " : "") + finalTranscript;
          return updated;
        });
      }
    };

    recognition.onerror = (event) => {
      let errorMessage = "Error recognizing speech: " + event.error;

      if (event.error === "network") {
        errorMessage = "Network error: The browser cannot reach the speech recognition servers. If you are using Brave browser, a restrictive VPN, or specific firewalls, this feature may be blocked. Please try using standard Google Chrome or Edge.";
      } else if (event.error === "not-allowed") {
        errorMessage = "Microphone access denied. Please allow microphone permissions in your browser settings.";
      }

      setSpeechError(errorMessage);
      setIsRecording(null);
    };

    recognition.onend = () => {
      if (isRecording === index) {
        setIsRecording(null);
      }
    };

    recognition.start();
    recognitionRef.current = recognition; // Store instance to stop it later
    setIsRecording(index);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsRecording(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await API.post(`/interview/submit/${id}`, { answers });
      navigate(`/evaluation/${id}`);
    } catch {
      setError("Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-400 animate-fade-in">
      <Loader2 size={28} className="animate-spin text-blue-500" />
      <p className="text-sm font-medium">Loading your questions…</p>
    </div>
  );

  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <div className="mb-2"><span className="badge-blue">Interview Session</span></div>
        <h1 className="text-2xl font-bold text-slate-800">Answer the Questions</h1>
        <p className="text-slate-500 text-sm mt-1">
          Take your time. Answer each question as thoroughly as possible.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" /> {error}
        </div>
      )}
      {speechError && (
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" /> {speechError}
        </div>
      )}

      {/* Questions */}
      {questions.map((q, index) => (
        <div key={index} className="card space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileQuestion size={14} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Question {index + 1}
                </p>
                <div className="flex items-center gap-2">
                  {activeEditors[index] && (
                    <select
                      value={editorLanguages[index] || "javascript"}
                      onChange={(e) => changeLanguage(index, e.target.value)}
                      className="text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="javascript">JS</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleEditor(index)}
                    className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg transition-colors border shadow-sm ${
                      activeEditors[index] 
                        ? "bg-blue-50 text-blue-700 border-blue-200" 
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Code size={13} className={activeEditors[index] ? "text-blue-600" : "text-slate-400"} />
                    {activeEditors[index] ? "Use Text Area" : "Use Code Editor"}
                  </button>
                </div>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{q}</p>
            </div>
          </div>
          
          {activeEditors[index] ? (
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-inner">
              <Editor
                height="200px"
                language={editorLanguages[index] || "javascript"}
                theme="vs-light"
                value={answers[index]}
                onChange={(value) => handleChange(index, value || "")}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 13,
                  padding: { top: 12, bottom: 12 },
                  wordWrap: "on"
                }}
              />
            </div>
          ) : (
            <textarea
              className={`input-base resize-none ${isRecording === index ? 'ring-2 ring-red-400 border-red-400 bg-red-50/10' : ''}`}
              rows={5}
              placeholder="Write or speak your answer here…"
              value={answers[index]}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          )}

          <div className="flex items-center justify-between">
            <div>
              {isRecording !== index ? (
                <button
                  onClick={() => {
                    // If recording another question, stop it first
                    if (isRecording !== null) stopRecording();
                    startRecording(index);
                  }}
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 shadow-sm"
                >
                  <Mic size={14} className="text-blue-600" /> Start Speaking
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  type="button"
                  className="flex items-center gap-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors shadow-sm animate-pulse-slight"
                >
                  <Square size={13} className="fill-white" /> Stop Recording
                </button>
              )}
            </div>
            <span className="text-xs text-slate-400">{answers[index].length} characters</span>
          </div>
        </div>
      ))}

      {/* Submit */}
      {questions.length > 0 && (
        <div className="flex justify-end pt-2 pb-8">
          <button
            onClick={handleSubmit}
            disabled={submitting || answers.every(a => !a.trim())}
            className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <><Loader2 size={15} className="animate-spin" /> Submitting…</>
            ) : (
              <><Send size={15} /> Submit Interview</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default Interview;