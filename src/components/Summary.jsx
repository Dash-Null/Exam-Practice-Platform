import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Summary = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const {
        total = 0,
        answered = 0,
        score = 0,
        questions = [],
        userAnswers = {},
        timeTaken = 0
    } = location.state || {};

    const [filter, setFilter] = useState('all'); // all, correct, incorrect, skipped

    // Derived stats
    const correctCount = score; // Assuming 1 mark per question for simplicity from MockTest logic
    const incorrectCount = answered - correctCount;
    const skippedCount = total - answered;
    const accuracy = total > 0 ? Math.round((correctCount / answered) * 100) || 0 : 0;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    // Filter questions
    const filteredQuestions = questions.filter((q, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === q.correct_answer;
        const isSkipped = !userAnswer;

        if (filter === 'all') return true;
        if (filter === 'correct') return isCorrect;
        if (filter === 'incorrect') return !isCorrect && !isSkipped;
        if (filter === 'skipped') return isSkipped;
        return true;
    });

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark min-h-screen transition-colors duration-200">
            {/* Top Navigation */}
            <nav className="bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-primary/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                                <span className="material-icons-outlined text-primary text-3xl">science</span>
                                <span className="font-bold text-xl tracking-tight text-primary">SciMaster 10</span>
                            </div>
                            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                                <button onClick={() => navigate('/dashboard')} className="border-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Dashboard</button>
                                <button className="border-primary text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Test Results</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-primary font-bold">S</div>
                                <span className="text-sm font-medium hidden md:block text-slate-700 dark:text-slate-200">Student</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center text-sm text-text-secondary-light dark:text-text-secondary-dark mb-1">
                            <span className="hover:text-primary">Science</span>
                            <span className="mx-2">/</span>
                            <span className="font-medium text-primary">Full Syllabus Mock Test</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Mock Test Results</h1>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">Completed just now</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/dashboard')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                            <span className="material-icons-outlined mr-2 text-lg">arrow_forward</span>
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Score Overview Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Left: Donut Chart & Main Score */}
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 flex flex-col items-center justify-center lg:col-span-1 border border-gray-100 dark:border-primary/10">
                        {/* CSS Donut Chart */}
                        <div className="relative w-[200px] h-[200px] rounded-full flex justify-center items-center mb-6"
                            style={{
                                background: `conic-gradient(#007f80 0% ${percentage}%, #e5e7eb ${percentage}% 100%)`
                            }}
                        >
                            <div className="absolute w-[160px] h-[160px] rounded-full bg-surface-light dark:bg-surface-dark"></div>
                            <div className="relative z-10 text-center">
                                <span className="block text-4xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
                                <span className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Score</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                {percentage >= 80 ? "Great Job!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
                            </h2>
                            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm mb-4">
                                You scored <strong>{score}/{total}</strong> marks.
                            </p>
                        </div>
                    </div>

                    {/* Right: Detailed Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Stat Card 1 */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-primary/10 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <span className="material-icons-outlined text-primary text-2xl">timer</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Time Taken</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatTime(timeTaken)}</p>
                            </div>
                        </div>
                        {/* Stat Card 2 */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-primary/10 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <span className="material-icons-outlined text-success text-2xl">check_circle</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Accuracy</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{accuracy}%</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">{correctCount}/{answered} Correct</p>
                            </div>
                        </div>
                        {/* Stat Card 3 */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-primary/10 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <span className="material-icons-outlined text-error text-2xl">highlight_off</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Incorrect</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{incorrectCount}</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Needs review</p>
                            </div>
                        </div>
                        {/* Stat Card 4 */}
                        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-primary/10 shadow-sm flex items-start gap-4">
                            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                <span className="material-icons-outlined text-gray-500 text-2xl">help_outline</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Skipped</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{skippedCount}</p>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">Unattempted</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="sticky top-16 z-40 bg-background-light dark:bg-background-dark pt-4 pb-4">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm p-1 inline-flex border border-gray-200 dark:border-primary/20 flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${filter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-primary/10'}`}
                        >
                            All Questions
                        </button>
                        <button
                            onClick={() => setFilter('incorrect')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${filter === 'incorrect' ? 'bg-error text-white shadow-sm' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-primary/10'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${filter === 'incorrect' ? 'bg-white' : 'bg-error'}`}></span> Incorrect
                        </button>
                        <button
                            onClick={() => setFilter('correct')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${filter === 'correct' ? 'bg-success text-white shadow-sm' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-primary/10'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${filter === 'correct' ? 'bg-white' : 'bg-success'}`}></span> Correct
                        </button>
                        <button
                            onClick={() => setFilter('skipped')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${filter === 'skipped' ? 'bg-neutral-500 text-white shadow-sm' : 'text-text-secondary-light dark:text-text-secondary-dark hover:bg-gray-50 dark:hover:bg-primary/10'}`}
                        >
                            <span className={`w-2 h-2 rounded-full ${filter === 'skipped' ? 'bg-white' : 'bg-gray-400'}`}></span> Skipped
                        </button>
                    </div>
                </div>

                {/* Detailed Question List */}
                <div className="space-y-6">
                    {filteredQuestions.map((q, i) => {
                        // We need the original index to access userAnswers correctly if filtering changes mapping
                        // In filter we lost the original index. Let's find it or use a better way.
                        // Actually filteredQuestions logic above uses the index from the map.
                        // But here mapping over filteredQuestions means 'i' is the filtered index.
                        // We should store the original index in `filteredQuestions`.

                        // Let's refactor filtering to include valid question object + original state
                        // Actually, let's just use the original question ID to look up if needed, or better, 
                        // rework the map above to just return components, or filter indices.

                        // Re-finding index in original array
                        const originalIndex = questions.findIndex(orig => orig.id === q.id);
                        const userAnswer = userAnswers[originalIndex];
                        const isCorrect = userAnswer === q.correct_answer;
                        const isSkipped = !userAnswer;
                        const displayId = q.displayId || originalIndex + 1;

                        let borderClass = 'border-l-4 border-gray-300 dark:border-gray-600';
                        let badgeClass = 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
                        let statusText = 'Skipped';
                        let statusIcon = 'help_outline';
                        let statusColor = 'text-gray-500';

                        if (!isSkipped) {
                            if (isCorrect) {
                                borderClass = 'border-l-4 border-success';
                                badgeClass = 'bg-success/10 text-success';
                                statusText = 'Correct';
                                statusIcon = 'check_circle';
                                statusColor = 'text-success';
                            } else {
                                borderClass = 'border-l-4 border-error';
                                badgeClass = 'bg-error/10 text-error';
                                statusText = 'Incorrect';
                                statusIcon = 'cancel';
                                statusColor = 'text-error';
                            }
                        }

                        return (
                            <div key={q.id} className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm ${borderClass} overflow-hidden`}>
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${badgeClass}`}>
                                                Q{displayId}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                                                {statusText}
                                            </span>
                                            <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider font-semibold">Multiple Choice</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                                        {q.question_text}
                                    </h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        {/* User Answer (if not skipped) */}
                                        {!isSkipped && (
                                            <div className={`border-2 rounded-lg p-4 relative ${isCorrect ? 'border-success/50 bg-success/5' : 'border-error/50 bg-error/5'}`}>
                                                <div className={`absolute -top-3 left-4 text-white text-xs px-2 py-1 rounded shadow-sm ${isCorrect ? 'bg-success' : 'bg-error'}`}>Your Answer</div>
                                                <div className="flex items-start gap-3">
                                                    <span className={`material-icons-outlined mt-0.5 ${isCorrect ? 'text-success' : 'text-error'}`}>{isCorrect ? 'check_circle' : 'cancel'}</span>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">{userAnswer}) {q.options[userAnswer]}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Correct Answer */}
                                        <div className="border-2 border-success/50 bg-success/5 rounded-lg p-4 relative">
                                            <div className="absolute -top-3 left-4 bg-success text-white text-xs px-2 py-1 rounded shadow-sm">Correct Answer</div>
                                            <div className="flex items-start gap-3">
                                                <span className="material-icons-outlined text-success mt-0.5">check_circle</span>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{q.correct_answer}) {q.options[q.correct_answer]}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Explanation */}
                                    <div className="bg-neutral-light dark:bg-primary/5 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2 text-primary font-medium">
                                            <span className="material-icons-outlined text-lg">lightbulb</span>
                                            Explanation
                                        </div>
                                        <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                                            {q.answer_explanation || 'No explanation provided.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {filteredQuestions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No questions found for this filter.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Summary;
