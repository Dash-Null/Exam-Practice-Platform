import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMCQs } from '../services/dataService';

const MCQPractice = () => {
    const { subject } = useParams(); // e.g., 'biology'
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [stats, setStats] = useState({ correct: 0, wrong: 0 });

    useEffect(() => {
        const fetched = getMCQs(subject || 'Biology');
        // Shuffle or just take them. For now, let's take up to 20.
        setQuestions(fetched.slice(0, 20));
    }, [subject]);

    const handleOptionClick = (optionKey) => {
        if (selectedOption) return; // Prevent changing after selection
        setSelectedOption(optionKey);

        const currentQ = questions[currentIndex];
        if (optionKey === currentQ.correct_answer) {
            setScore(s => s + 10); // +10 points
            setStats(prev => ({ ...prev, correct: prev.correct + 1 }));
        } else {
            setStats(prev => ({ ...prev, wrong: prev.wrong + 1 }));
        }
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
        } else {
            // End of practice
            alert(`Practice Complete! Score: ${score}`);
            navigate('/dashboard');
        }
    };

    const prevQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setSelectedOption(null); // NOTE: This resets state for previous question, usually we'd want to persist it, but for simple practice this is okay or we track history.
            // For a refined experience, we should track history, but per spec "Note that in the MCQ practice, the answer should be revealed upon clicking any of the options", implying a fresh attempt or review.
            // Let's keep it simple: resetting allows re-attempting (cheating?) or just re-viewing.
            // Better: Store user answers in an array if we want persistence.
            // For now, reset to allow 're-practice' or purely navigation. 
        }
    };

    if (questions.length === 0) return <div>Loading...</div>;

    const currentQ = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const accuracy = (stats.correct + stats.wrong) === 0 ? 0 : Math.round((stats.correct / (stats.correct + stats.wrong)) * 100);

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen">
            {/* Header & Navigation */}
            <header className="bg-white dark:bg-slate-900 border-b border-primary/10 shadow-sm sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
                            <span className="material-icons">biotech</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-primary">Class 10 Science</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold">{subject} Revision</p>
                        </div>
                    </div>
                    <nav className="hidden md:flex h-full">
                        <button className="px-8 h-full border-b-4 border-primary text-primary font-semibold flex items-center gap-2 transition-all">
                            <span className="material-icons text-sm">quiz</span>
                            MCQ Practice
                        </button>
                        <button onClick={() => navigate(`/revision/${subject}`)} className="px-8 h-full border-b-4 border-transparent text-slate-500 hover:text-accent font-medium flex items-center gap-2 transition-all">
                            <span className="material-icons text-sm">menu_book</span>
                            Theory
                        </button>
                    </nav>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] uppercase font-bold text-slate-400">Current Score</p>
                            <p className="text-lg font-bold text-primary">{score} <span className="text-sm font-normal text-slate-400">pts</span></p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary overflow-hidden flex items-center justify-center text-primary font-bold">
                            S
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Progress Tracking */}
                <div className="mb-10">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <span className="bg-accent/20 text-accent text-[10px] font-bold px-2 py-1 rounded-full uppercase mb-2 inline-block">Chapter 01</span>
                            <h2 className="text-2xl font-bold dark:text-white">General Test</h2>
                        </div>
                        <div className="text-right">
                            <span className="text-sm font-medium text-slate-500">Question <span className="text-primary font-bold text-lg">{currentIndex + 1}</span> of {questions.length}</span>
                        </div>
                    </div>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                {/* Question Section */}
                <div className="space-y-6">
                    {/* MCQ Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 p-8 border border-primary/5">
                        <div className="flex items-start gap-4 mb-8">
                            <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">Q</span>
                            <p className="text-xl leading-relaxed font-medium text-slate-800 dark:text-slate-100">
                                {currentQ.question_text}
                            </p>
                        </div>

                        {/* Options List */}
                        <div className="grid gap-4">
                            {Object.entries(currentQ.options).map(([key, value]) => {
                                const isSelected = selectedOption === key;
                                const isCorrect = key === currentQ.correct_answer;
                                const showResult = !!selectedOption;

                                let containerClasses = "group flex items-center gap-4 w-full p-5 rounded-lg border-2 text-left transition-all duration-200 transform";
                                let iconContent = key;
                                let iconClasses = "w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold transition-colors";
                                let textClass = "text-lg font-medium";

                                if (!showResult) {
                                    // Default State
                                    containerClasses += " border-slate-100 dark:border-slate-800 hover:border-primary/30 hover:bg-primary/5";
                                    iconClasses += " border-slate-200 dark:border-slate-700 text-slate-400 group-hover:border-primary group-hover:text-primary";
                                } else {
                                    // Result State
                                    if (isCorrect) {
                                        containerClasses += " border-green-500 bg-green-500/10 scale-[1.02] shadow-md";
                                        iconClasses += " bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20";
                                        textClass += " text-green-700 dark:text-green-400 font-bold";
                                        iconContent = <span className="material-icons">check</span>;
                                    } else if (isSelected && !isCorrect) {
                                        containerClasses += " border-red-500 bg-red-500/10";
                                        iconClasses += " bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20";
                                        textClass += " text-red-700 dark:text-red-400 line-through";
                                        iconContent = <span className="material-icons text-xl">close</span>;
                                    } else {
                                        // Unselected options
                                        containerClasses += " border-slate-100 dark:border-slate-800 opacity-50";
                                        iconClasses += " border-slate-200 dark:border-slate-700 text-slate-400";
                                    }
                                }

                                return (
                                    <button
                                        key={key}
                                        onClick={() => handleOptionClick(key)}
                                        disabled={!!selectedOption}
                                        className={containerClasses}
                                    >
                                        <span className={iconClasses}>
                                            {iconContent}
                                        </span>
                                        <span className={textClass}>{value}</span>
                                        {showResult && isCorrect && (
                                            <span className="ml-auto text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400 animate-pulse">Correct Answer</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Explanation Box */}
                        {selectedOption && (
                            <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border-l-4 border-primary animate-fade-in-up">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <span className="material-icons text-sm">info</span>
                                    <h4 className="font-bold text-sm uppercase tracking-wider">Concept Brief</h4>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {currentQ.answer_explanation}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center justify-between pt-4">
                        <button
                            onClick={prevQuestion}
                            disabled={currentIndex === 0}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-slate-500 hover:text-primary hover:bg-primary/5 transition-all disabled:opacity-50"
                        >
                            <span className="material-icons">chevron_left</span>
                            Previous Question
                        </button>
                        <div className="flex items-center gap-3">
                            {/* <button className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-accent border-2 border-accent/20 hover:bg-accent/10 transition-all">
                                <span className="material-icons">lightbulb</span>
                                Hint
                            </button> */}
                            <button
                                onClick={nextQuestion}
                                className="flex items-center gap-2 px-10 py-3 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:translate-x-1"
                            >
                                {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                                <span className="material-icons">chevron_right</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sidebar Status - Desktop Floating */}
            <div className="fixed right-8 top-32 w-64 hidden xl:block">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-primary/10 shadow-lg">
                    <h3 className="font-bold mb-4 text-slate-500 uppercase text-xs tracking-widest">Session Statistics</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Accuracy</span>
                            <span className="text-green-500 font-bold">{accuracy}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${accuracy}%` }}></div>
                        </div>
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Correct</p>
                                    <p className="text-lg font-bold text-green-500">{stats.correct}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Wrong</p>
                                    <p className="text-lg font-bold text-red-500">{stats.wrong}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Footer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-100 p-4 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold">{currentIndex + 1}</span>
                    <span className="text-sm font-medium">/ {questions.length}</span>
                </div>
                <button onClick={nextQuestion} className="bg-primary text-white px-6 py-2 rounded font-bold">Next</button>
            </div>
        </div>
    );
};

export default MCQPractice;
