import React, { useState } from 'react';

const VerifiedSignIn = () => {
    const [loading, setLoading] = useState(false);

    const loginWithFayda = () => {
        setLoading(true);
        // Redirect to Backend to initiate OIDC Flow
        window.location.href = 'http://localhost:3000/api/auth/fayda/login';
    };

    return (
        <div className="w-full">
            <button
                onClick={loginWithFayda}
                disabled={loading}
                className="w-full bg-[#0052cc] hover:bg-[#0042a4] text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all relative overflow-hidden group disabled:opacity-70"
            >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                {/* Fayda Placeholder Icon */}
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#0052cc] font-bold text-xs ring-2 ring-white/50">
                    F
                </div>
                {loading ? 'Connecting to National ID...' : 'Verify & Sign In with Fayda ID'}
            </button>
            <p className="text-xs text-gray-500 mt-3 text-center italic">
                Secure e-KYC powered by Ethiopia's National ID Program.
            </p>
        </div>
    );
};

export default VerifiedSignIn;
