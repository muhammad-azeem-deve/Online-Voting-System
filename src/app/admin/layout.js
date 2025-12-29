"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Vote, Users, LogOut, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
            toast.success('Logged out');
        } catch (e) { toast.error('Logout failed'); }
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Elections', href: '/admin/elections', icon: Vote },
        { name: 'Voters', href: '/admin/voters', icon: Users },
        // { name: 'Results', href: '/admin/results', icon: BarChart3 }, // Can be part of Elections or separate. Let's make it separate for clarity "view results"
    ];

    return (
        <div className="flex h-screen bg-slate-900 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Admin Panel
                    </h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
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
