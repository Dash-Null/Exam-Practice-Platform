import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [grade, setGrade] = useState('10');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Save user details if needed, for now just navigate
        localStorage.setItem('userName', name);
        localStorage.setItem('userGrade', grade);
        navigate('/dashboard');
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center p-4 font-body">
            {/* Main Container */}
            <main className="w-full max-w-md relative z-10">
                {/* Logo/Brand Icon Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
                        <span className="material-icons-outlined text-white text-3xl">science</span>
                    </div>
                    <h1 className="font-display text-3xl font-bold text-primary dark:text-primary tracking-tight">Focus Lab Revision</h1>
                    <p className="text-primary/70 dark:text-primary/50 text-sm mt-1 font-medium">Class 10 Science Excellence</p>
                </div>
                {/* Central Onboarding Card */}
                <div className="bg-white dark:bg-background-dark/50 border border-primary/10 dark:border-primary/20 rounded-xl shadow-xl p-8 backdrop-blur-sm">
                    <div className="mb-8">
                        <h2 className="font-display text-xl font-semibold text-gray-800 dark:text-white">Welcome!</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Let's get your personalized revision session started.</p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Name Input */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="full-name">
                                What is your name?
                            </label>
                            <div className="relative">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-xl">person</span>
                                <input
                                    className="w-full pl-11 pr-4 py-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all outline-none"
                                    id="full-name"
                                    placeholder="e.g., John Doe"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {/* Class Selection Dropdown */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="class-select">
                                Select your class
                            </label>
                            <div className="relative">
                                <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary/40 text-xl">school</span>
                                <select
                                    className="w-full pl-11 pr-10 py-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-lg text-gray-900 dark:text-white appearance-none transition-all outline-none"
                                    id="class-select"
                                    value={grade}
                                    onChange={(e) => setGrade(e.target.value)}
                                >
                                    <option value="10">Class 10</option>
                                    <option value="9">Class 9 (Coming Soon)</option>
                                    <option value="11">Class 11 (Coming Soon)</option>
                                </select>
                                <span className="material-icons-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary/40 pointer-events-none">expand_more</span>
                            </div>
                        </div>
                        {/* CTA Button */}
                        <div className="pt-4">
                            <button className="w-full py-4 bg-accent-amber hover:bg-[#FFB300] active:scale-[0.98] text-gray-900 font-display font-bold text-lg rounded-lg shadow-lg shadow-accent-amber/20 transition-all flex items-center justify-center gap-2 group" type="submit">
                                Start Revision
                                <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </form>
                    <div className="mt-8 pt-6 border-t border-primary/10 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold">
                            <span className="w-8 h-px bg-primary/20"></span>
                            <span>Resources Included</span>
                            <span className="w-8 h-px bg-primary/20"></span>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <span className="material-icons-outlined text-sm">auto_stories</span>
                                <span>Notes</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <span className="material-icons-outlined text-sm">quiz</span>
                                <span>MCQs</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <span className="material-icons-outlined text-sm">history_edu</span>
                                <span>PYQs</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements & Footer */}
                <div className="mt-12 text-center space-y-6">
                    <div className="grid grid-cols-3 gap-4 opacity-40">
                        {/* Images replaced with divs for now or linked if using external */}
                        <div className="w-full h-1 bg-primary/20 rounded-full"></div>
                        <div className="w-full h-1 bg-primary/20 rounded-full"></div>
                        <div className="w-full h-1 bg-primary/20 rounded-full"></div>
                    </div>
                    <p className="text-sm text-primary/60 dark:text-primary/40 font-display font-medium">
                        Prepare for your boards with precision.
                    </p>
                    <div className="flex justify-center gap-6">
                        <a className="text-xs text-primary/50 hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="text-xs text-primary/50 hover:text-primary transition-colors" href="#">Help Center</a>
                        <a className="text-xs text-primary/50 hover:text-primary transition-colors" href="#">Terms of Service</a>
                    </div>
                </div>
            </main>
            {/* Background Decoration */}
            <div className="fixed top-0 left-0 w-full h-full -z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-accent-amber/5 rounded-full blur-3xl"></div>
                {/* Abstract BG Pattern */}
            </div>
        </div>
    );
};

export default Onboarding;
