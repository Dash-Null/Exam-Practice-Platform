import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName') || 'Student';

    const subjects = [
        {
            id: 'physics',
            name: 'Physics',
            icon: 'bolt',
            chapters: 'Ch 1-5',
            mastery: 45,
            next: 'Light - Reflection & Refraction'
        },
        {
            id: 'chemistry',
            name: 'Chemistry',
            icon: 'science',
            chapters: 'Ch 1-4',
            mastery: 70,
            next: 'Carbon & its Compounds'
        },
        {
            id: 'biology',
            name: 'Biology',
            icon: 'eco',
            chapters: 'Ch 6-9',
            mastery: 20,
            next: 'Life Processes'
        }
    ];

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset your progress?')) {
            localStorage.clear();
            navigate('/');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-800 dark:text-slate-100 min-h-screen flex flex-col">
            {/* Header */}
            <header className="w-full bg-white dark:bg-background-dark/50 border-b border-primary/10 dark:border-primary/30 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <span className="material-icons text-primary text-2xl">science</span>
                            </div>
                            <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Science<span className="text-primary">Pro</span></span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:block text-right">
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Student Profile</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Welcome, {userName}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary-dark overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm flex items-center justify-center text-white font-bold text-lg">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                            <button
                                onClick={handleReset}
                                className="ml-2 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors duration-200"
                                title="Reset all progress"
                            >
                                <span className="material-icons text-lg">restart_alt</span>
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome Section */}
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Let's crush Class 10 Science.</h1>
                    <p className="text-slate-600 dark:text-slate-300 text-lg">Track your progress and master every concept.</p>
                </div>

                {/* Subject Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                    {subjects.map((subject) => (
                        <div key={subject.id} className="group relative bg-white dark:bg-[#162e2e] rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className="material-icons text-8xl text-primary">{subject.icon}</span>
                            </div>
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <span className="material-icons text-3xl text-primary">{subject.icon}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{subject.name}</h2>
                                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">{subject.chapters}</span>
                                </div>
                            </div>
                            <div className="mb-8 flex-grow relative z-10">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Mastery</span>
                                    <span className="text-lg font-bold text-primary">{subject.mastery}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${subject.mastery}%` }}></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Next up: {subject.next}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/revision/${subject.id}`)}
                                    className="flex-1 py-3 px-4 bg-white dark:bg-[#162e2e] border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md relative z-10"
                                >
                                    Study
                                    <span className="material-icons text-sm">auto_stories</span>
                                </button>
                                <button
                                    onClick={() => navigate(`/mcq-practice/${subject.id}`)}
                                    className="flex-1 py-3 px-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 relative z-10"
                                >
                                    Quiz
                                    <span className="material-icons text-sm">quiz</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Full Mock Test CTA */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 dark:from-[#1a3838] dark:to-[#0f2323] shadow-lg">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute -right-10 -top-20 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
                        <div className="absolute left-10 bottom-0 w-32 h-32 bg-primary rounded-full blur-2xl"></div>
                    </div>
                    <div className="relative z-10 px-8 py-10 md:py-12 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-xs font-bold uppercase tracking-wider mb-4 border border-accent/20">
                                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                                Recommended
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready for the Boards?</h2>
                            <p className="text-slate-300 text-lg">Test your knowledge across all three subjects with a standard 3-hour mock exam.</p>
                        </div>
                        <div className="w-full md:w-auto shrink-0">
                            <button
                                onClick={() => navigate('/mock-test')}
                                className="w-full md:w-auto bg-accent hover:bg-accent-hover text-slate-900 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 text-lg"
                            >
                                <span className="material-icons">timer</span>
                                Take Full 80-Mark Mock Test
                            </button>
                            <p className="text-center text-slate-400 text-xs mt-3">Estimated time: 3 hours • Full Syllabus</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-background-dark border-t border-slate-100 dark:border-primary/20 py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-sm">© 2023 Science Revision Pro. Happy Studying!</p>
                    <div className="flex gap-6">
                        <a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Syllabus</a>
                        <a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Past Papers</a>
                        <a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
