import React from 'react';

const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 w-full bg-slate-50 border-t border-slate-200 py-2.5 text-center z-[100]" style={{ boxShadow: '0 -4px 20px rgba(0,0,0,0.03)' }}>
            <p className="text-slate-600 text-[15px] flex items-center justify-center gap-2 font-sans font-medium">
                Designed & Developed by
                <span
                    className="text-pink-500 text-[2.2rem] leading-none -mt-1 font-normal tracking-wide"
                    style={{
                        fontFamily: "'Great Vibes', cursive"
                    }}
                >
                    Gautam Gupta
                </span>
                &copy; {new Date().getFullYear()}
            </p>
        </footer>
    );
};

export default Footer;
