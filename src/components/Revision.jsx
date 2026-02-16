import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuestions } from '../services/dataService';

const Revision = () => {
    const { subject } = useParams();
    const navigate = useNavigate();
    const [questionsGroups, setQuestionsGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedAnswers, setExpandedAnswers] = useState({});

    useEffect(() => {
        const groups = getQuestions(subject);
        setQuestionsGroups(groups);
        setLoading(false);
    }, [subject]);

    const toggleAnswer = (id) => {
        setExpandedAnswers(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (loading) return <div>Loading...</div>;

    const subjectTitle = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'Subject';

    // Helper to get number from group name (1-mark -> 1, 3-mark -> 3)
    const getMarkValue = (groupName) => {
        const match = groupName.match(/(\d+)/);
        return match ? match[0] : '1';
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen font-display">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard')}>
                            <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <span className="material-icons-outlined">biotech</span>
                            </div>
                            <div>
                                <nav className="flex text-xs text-slate-500 dark:text-slate-400 gap-2 mb-0.5">
                                    <span>Class 10</span>
                                    <span>/</span>
                                    <span>Science</span>
                                </nav>
                                <h1 className="text-lg font-semibold text-slate-900 dark:text-white leading-none">{subjectTitle} Revision</h1>
                            </div>
                        </div>
                        <button onClick={() => window.print()} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                            <span className="material-icons-outlined text-sm">print</span>
                            Print Notes
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Left Sidebar Navigation */}
                    <aside className="col-span-3 hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            {/* Tab Switcher */}
                            <div className="bg-white dark:bg-slate-900/50 p-1.5 rounded-xl border border-primary/10 flex">
                                <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium bg-primary text-white shadow-sm">
                                    Questions
                                </button>
                                <button className="flex-1 py-2 px-4 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-all">
                                    Theory
                                </button>
                            </div>
                            {/* Section Links */}
                            <nav className="space-y-1">
                                <p className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Question Bank</p>
                                {questionsGroups.map((group) => {
                                    const mark = getMarkValue(group.group);
                                    const iconName = mark === '1' ? 'looks_one' : mark === '2' ? 'looks_two' : mark === '3' ? 'looks_3' : mark === '4' ? 'looks_4' : mark === '5' ? 'looks_5' : 'list';

                                    return (
                                        <a
                                            key={group.group}
                                            href={`#section-${group.group.replace(/\s+/g, '-')}`}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                        >
                                            <span className="material-icons-outlined text-[1.2rem]">{iconName}</span>
                                            {group.group}
                                        </a>
                                    );
                                })}
                            </nav>
                            {/* Stats Card */}
                            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                <h3 className="text-sm font-semibold text-primary mb-3">Revision Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Reviewed today</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-200">12 / 45</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Mastery Level</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-200">Low (24%)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <div className="col-span-12 lg:col-span-9 space-y-10 pb-20">
                        {questionsGroups.map((group) => {
                            const mark = getMarkValue(group.group);
                            return (
                                <section key={group.group} id={`section-${group.group.replace(/\s+/g, '-')}`} className="scroll-mt-24">
                                    <div className="flex items-center gap-3 mb-6 border-b border-primary/20 pb-4">
                                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">{mark}</div>
                                        <div>
                                            <h2 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{group.group} Questions</h2>
                                            <p className="text-sm text-slate-500">Practice questions for {mark} marks.</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {group.questions.map((q, idx) => (
                                            <div key={q.id} className="bg-white dark:bg-slate-900 border border-primary/10 rounded-xl overflow-hidden shadow-sm">
                                                <div className="p-5">
                                                    <div className="flex justify-between items-start gap-4">
                                                        <div className="space-y-2 w-full">
                                                            <h3 className="text-base font-medium text-slate-800 dark:text-slate-100 leading-relaxed">
                                                                Q{idx + 1}. {q.question_text}
                                                            </h3>
                                                            {q.type === 'MCQ' && q.options && (
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                                                    {Object.entries(q.options).map(([key, val]) => (
                                                                        <div key={key} className={`p-2 border rounded-lg text-sm ${key === q.correct_answer && expandedAnswers[q.id] ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700'}`}>
                                                                            <span className="font-bold mr-2">{key})</span> {val}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleAnswer(q.id)}
                                                            className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"
                                                        >
                                                            <span className="material-icons-outlined text-lg">
                                                                {expandedAnswers[q.id] ? 'visibility_off' : 'visibility'}
                                                            </span>
                                                            {expandedAnswers[q.id] ? 'Hide Answer' : 'Show Answer'}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Expanded Answer */}
                                                {expandedAnswers[q.id] && (
                                                    <div className="p-6 bg-primary/[0.02] border-t border-primary/5">
                                                        <div className="space-y-2">
                                                            <p className="font-bold text-primary">Answer:</p>
                                                            <p className="text-slate-600 dark:text-slate-400">{q.correct_answer}</p>
                                                            {q.answer_explanation && (
                                                                <div className="mt-2 text-sm text-slate-500 italic">
                                                                    <span className="font-semibold">Explanation:</span> {q.answer_explanation}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Revision;
