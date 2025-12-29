"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut, CheckCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VoterLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            toast.success('Logged out');
        } catch (e) { toast.error('Logout failed'); }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            {/* Sidebar - keeping it simple for voters too */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
                        Voter Panel
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link href="/voter/dashboard" className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${pathname === '/voter/dashboard' ? 'bg-green-600/20 text-green-400' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                        }`}>
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Elections</span>
                    </Link>
                    {/* <Link href="/voter/history" ... optional /> */}
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-red-400 hover:text-red-300 w-full px-4 py-3 transition hover:bg-slate-700 rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}
