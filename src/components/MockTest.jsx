import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllMCQs } from '../services/dataService'; // We'll just use Biology MCQs for now as a sample

const MockTest = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [statusMap, setStatusMap] = useState({}); // 'answered', 'marked', 'not_visited', 'skipped'
    const [timer, setTimer] = useState(3 * 60 * 60); // 3 hours

    useEffect(() => {
        const allQuestions = getAllMCQs();
        // Shuffle and pick 30 for the mock test
        const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
        const selectedQuestions = shuffled.slice(0, 30).map((q, i) => ({
            ...q,
            id: `q-${i + 1}`,
            displayId: i + 1
        }));
        setQuestions(selectedQuestions);

        // Initialize status
        const initialStatus = {};
        selectedQuestions.forEach((_, i) => initialStatus[i] = 'not_visited');
        // Mark first as visited (or active)
        setStatusMap(initialStatus);

        const interval = setInterval(() => {
            setTimer(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSubmitTest = () => {
        const answeredCount = Object.keys(selectedAnswers).length;
        // Simple scoring: +1 for correct
        let score = 0;
        questions.forEach((q, i) => {
            if (selectedAnswers[i] === q.correct_answer) score += 1;
        });

        const timeTaken = (3 * 60 * 60) - timer; // Total time - remaining time

        navigate('/summary', {
            state: {
                total: questions.length,
                answered: answeredCount,
                score: score,
                questions: questions,
                userAnswers: selectedAnswers,
                timeTaken: timeTaken
            }
        });
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (option) => {
        setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: option }));
        setStatusMap(prev => ({ ...prev, [currentQuestionIndex]: 'answered' }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const markForReview = () => {
        setStatusMap(prev => ({ ...prev, [currentQuestionIndex]: 'marked' }));
        handleNext();
    };

    const clearResponse = () => {
        const newAnswers = { ...selectedAnswers };
        delete newAnswers[currentQuestionIndex];
        setSelectedAnswers(newAnswers);
        setStatusMap(prev => ({ ...prev, [currentQuestionIndex]: 'not_visited' })); // Or visited but unanswered
    };

    if (questions.length === 0) return <div>Loading Test...</div>;

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 min-h-screen flex flex-col font-display">
            {/* Sticky Top Bar */}
            <header className="sticky top-0 z-50 bg-primary text-white shadow-lg h-16 flex items-center px-6 justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <span className="material-icons-round">science</span>
                    </div>
                    <div>
                        <h1 className="font-semibold text-lg leading-tight">Class 10 Science Revision</h1>
                        <p className="text-xs text-white/80">Full Syllabus Mock Test #04</p>
                    </div>
                    {currentQ.subject && (
                        <span className="bg-white/20 px-2 py-0.5 rounded text-xs ml-2">{currentQ.subject}</span>
                    )}
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                        <span className="material-icons-round text-sm">timer</span>
                        <span className="font-mono text-xl font-medium tracking-wider">{formatTime(timer)}</span>
                    </div>
                    <button
                        onClick={handleSubmitTest}
                        className="bg-white text-primary hover:bg-white/90 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md"
                    >
                        <span>Submit Test</span>
                        <span className="material-icons-round text-sm">send</span>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 shadow-md text-sm"
                    >
                        <span>End Test</span>
                        <span className="material-icons-round text-sm">close</span>
                    </button>
                </div>
            </header>

            {/* Main Layout Container */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Side: Question Area */}
                <section className="flex-1 overflow-y-auto custom-scrollbar p-8 flex flex-col">
                    {/* Question Header Info */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className="bg-primary/10 dark:bg-primary/20 text-primary font-bold px-3 py-1 rounded-lg">Question {currentQ.displayId}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-sm">Multiple Choice Question</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="text-green-600 dark:text-green-400">+1.0 Marks</span>
                            <span className="text-red-500 dark:text-red-400">0.0 Negative</span>
                        </div>
                    </div>

                    {/* Question Content Card */}
                    <div className="bg-white dark:bg-slate-800/50 rounded-xl p-8 border border-slate-200 dark:border-primary/20 shadow-sm flex-1">
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-xl font-medium leading-relaxed mb-8">
                                {currentQ.question_text}
                            </h2>
                            {/* Options */}
                            <div className="space-y-4">
                                {currentQ.options && Object.entries(currentQ.options).map(([key, value]) => {
                                    const isSelected = selectedAnswers[currentQuestionIndex] === key;
                                    return (
                                        <label key={key} className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all group ${isSelected ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-100 dark:border-slate-700 hover:border-primary/50'}`}>
                                            <input
                                                className={`w-5 h-5 text-primary focus:ring-primary ${isSelected ? 'border-primary' : 'border-slate-300'}`}
                                                name="mock-option"
                                                type="radio"
                                                checked={isSelected}
                                                onChange={() => handleOptionSelect(key)}
                                            />
                                            <span className={`ml-4 font-medium ${isSelected ? 'text-primary font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {key}) {value}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Question Footer Actions */}
                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex gap-4">
                            <button onClick={clearResponse} className="px-6 py-2.5 rounded-lg border-2 border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                Clear Response
                            </button>
                            <button onClick={markForReview} className="px-6 py-2.5 rounded-lg border-2 border-purple-500 text-purple-600 dark:text-purple-400 font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                Mark for Review & Next
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handlePrev} disabled={currentQuestionIndex === 0} className="px-6 py-2.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                                <span className="material-icons-round text-sm">chevron_left</span>
                                Previous
                            </button>
                            <button onClick={handleNext} className="px-8 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-shadow shadow-md shadow-primary/20 flex items-center gap-2">
                                Save & Next
                                <span className="material-icons-round text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Right Side: Sidebar */}
                <aside className="w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-primary/20 flex flex-col hidden lg:flex">
                    {/* User Info & Progress */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                <span className="material-icons-round text-3xl">account_circle</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-100 leading-none">Student</h3>
                                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Candidate</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 dark:text-slate-400">Total Progress</span>
                                <span className="font-bold text-primary">{Object.keys(selectedAnswers).length} / {questions.length} Answered</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${(Object.keys(selectedAnswers).length / questions.length) * 100}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Question Palette */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <h4 class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Question Palette</h4>
                        <div className="grid grid-cols-5 gap-3">
                            {questions.map((q, i) => {
                                let statusClass = "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600";
                                if (i === currentQuestionIndex) {
                                    statusClass = "border-2 border-primary text-primary bg-primary/10 ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900";
                                } else if (statusMap[i] === 'answered' || selectedAnswers[i]) {
                                    statusClass = "bg-primary text-white";
                                } else if (statusMap[i] === 'marked') {
                                    statusClass = "bg-purple-500 text-white";
                                }

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => setCurrentQuestionIndex(i)}
                                        className={`aspect-square rounded-lg font-medium flex items-center justify-center text-sm transition-all ${statusClass}`}
                                    >
                                        {i + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default MockTest;
