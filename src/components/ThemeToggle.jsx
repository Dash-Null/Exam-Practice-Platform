import React, { useEffect, useState } from 'react';

const ThemeToggle = () => {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        // Check initial theme
        if (localStorage.theme === 'light') {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        } else {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-4 right-4 z-[100] p-3 rounded-full bg-primary text-white shadow-lg hover:bg-primary-dark transition-all"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
            <span className="material-icons-outlined">
                {isDark ? 'light_mode' : 'dark_mode'}
            </span>
        </button>
    );
};

export default ThemeToggle;
