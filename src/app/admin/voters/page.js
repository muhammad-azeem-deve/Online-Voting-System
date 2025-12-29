"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminVoters() {
    const [voters, setVoters] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVoters = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) setVoters(data.users);
        } catch (e) { toast.error('Failed to fetch voters'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchVoters(); }, []);

    const exportVoters = () => {
        const data = voters.map(v => ({
            ID: v._id,
            Username: v.username,
            FullName: v.fullName,
            Role: v.role,
            JoinedAt: new Date(v.createdAt).toLocaleDateString()
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Voters");
        XLSX.writeFile(wb, "Voters_List.xlsx");
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Voter Management</h1>
                <button onClick={exportVoters} className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <Download size={18} /> Export List
                </button>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-6 py-4">Full Name</th>
                                <th className="px-6 py-4">Username</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {voters.map((voter) => (
                                <tr key={voter._id} className="hover:bg-slate-700/30 transition">
                                    <td className="px-6 py-4 font-medium text-white">{voter.fullName}</td>
                                    <td className="px-6 py-4 text-slate-300">{voter.username}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 font-bold uppercase">
                                            {voter.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{new Date(voter.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {voters.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No voters found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
