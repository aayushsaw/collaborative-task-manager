
// import { useAuth } from "../context/AuthContext"; 
// Assuming AuthContext exists. I will verify context dir. 
// For now, using a placeholder until I verify context file name.

// Since I am in parallel block I can't read the context file yet to know the hook name.
// But I can guess standard pattern. 
// Better: I will write this file in the next step after listing context.
// For now I will write Navbar.

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import api from "../api/client";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    if (!user) return null;

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                        TF
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
                        TaskFlow
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 border border-white/20 shadow-sm backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-sm text-slate-600 font-medium">
                            {user.name}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary !py-2 !px-4 !text-sm hover:!bg-red-50 hover:!text-red-600 hover:!border-red-100"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
