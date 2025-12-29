"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Power, Eye, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function AdminElections() {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newElection, setNewElection] = useState({ title: '', description: '', candidates: [{ name: '', party: '' }] });

    const fetchElections = async () => {
        try {
            const res = await fetch('/api/admin/elections');
            const data = await res.json();
            if (data.success) setElections(data.elections);
        } catch (e) { toast.error('Failed to fetch elections'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchElections(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/elections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newElection),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Election created');
                setNewElection({ title: '', description: '', candidates: [{ name: '', party: '' }] });
                setShowModal(false);
                fetchElections();
            }
        } catch (e) { toast.error('Failed to create election'); }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'ended' : 'active'; // Simple toggle logic
        // Or cycle: upcoming -> active -> ended
        let nextStatus = 'active';
        if (currentStatus === 'active') nextStatus = 'ended';
        if (currentStatus === 'ended') nextStatus = 'upcoming'; // Optional cycle

        // Prompt Logic usually: Upcoming -> Active -> Ended.
        // Let's implement simpler toggle for now or explicit buttons.
        // I'll stick to: if upcoming/ended -> Active. If Active -> Ended.
        if (currentStatus === 'active') nextStatus = 'ended';
        else nextStatus = 'active';

        try {
            const res = await fetch(`/api/admin/elections/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus })
            });
            if (res.ok) {
                toast.success(`Status updated to ${nextStatus}`);
                fetchElections();
            }
        } catch (e) { toast.error('Failed to update status'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await fetch(`/api/admin/elections/${id}`, { method: 'DELETE' });
            toast.success('Election deleted');
            fetchElections();
        } catch (e) { toast.error('Delete failed'); }
    };

    const exportToExcel = (election) => {
        const data = election.candidates.map(c => ({
            Candidate: c.name,
            Party: c.party,
            Votes: c.voteCount
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Results");
        XLSX.writeFile(wb, `${election.title}_Results.xlsx`);
    };

    const addCandidateField = () => {
        setNewElection({ ...newElection, candidates: [...newElection.candidates, { name: '', party: '' }] });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Elections</h1>
                <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition">
                    <Plus size={20} /> New Election
                </button>
            </div>

            <div className="grid gap-6">
                {elections.map(election => (
                    <div key={election._id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold">{election.title}</h2>
                                <p className="text-slate-400 mt-1">{election.description}</p>
                                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                     ${election.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                        election.status === 'ended' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {election.status}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleToggleStatus(election._id, election.status)} title="Toggle Status" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                                    <Power size={18} className={election.status === 'active' ? 'text-green-400' : 'text-slate-400'} />
                                </button>
                                <button onClick={() => exportToExcel(election)} title="Export Results" className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition">
                                    <Download size={18} className="text-blue-400" />
                                </button>
                                <button onClick={() => handleDelete(election._id)} title="Delete" className="p-2 bg-slate-700 hover:bg-red-900/50 rounded-lg transition">
                                    <Trash2 size={18} className="text-red-400" />
                                </button>
                            </div>
                        </div>

                        {/* Candidates Preview / Results */}
                        <div className="mt-6 space-y-3">
                            <h3 className="font-medium text-slate-300">Candidates & Results</h3>
                            {election.candidates.map(candidate => (
                                <div key={candidate._id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg">
                                    <div>
                                        <span className="font-bold text-white">{candidate.name}</span>
                                        <span className="text-slate-500 text-sm ml-2">({candidate.party})</span>
                                    </div>
                                    <div className="font-mono font-bold text-blue-400">
                                        {candidate.voteCount} Votes
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 p-8 rounded-2xl w-full max-w-lg border border-slate-700 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold mb-6">Create Election</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Title</label>
                                <input required className="w-full bg-slate-900 border border-slate-600 rounded p-2"
                                    value={newElection.title} onChange={e => setNewElection({ ...newElection, title: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Description</label>
                                <textarea className="w-full bg-slate-900 border border-slate-600 rounded p-2"
                                    value={newElection.description} onChange={e => setNewElection({ ...newElection, description: e.target.value })} />
                            </div>

                            <div>
                                <label className="block text-sm mb-2">Candidates</label>
                                {newElection.candidates.map((c, i) => (
                                    <div key={i} className="flex gap-2 mb-2">
                                        <input placeholder="Name" className="flex-1 bg-slate-900 border border-slate-600 rounded p-2"
                                            value={c.name} onChange={e => {
                                                const newCands = [...newElection.candidates];
                                                newCands[i].name = e.target.value;
                                                setNewElection({ ...newElection, candidates: newCands });
                                            }} required />
                                        <input placeholder="Party" className="flex-1 bg-slate-900 border border-slate-600 rounded p-2"
                                            value={c.party} onChange={e => {
                                                const newCands = [...newElection.candidates];
                                                newCands[i].party = e.target.value;
                                                setNewElection({ ...newElection, candidates: newCands });
                                            }} required />
                                    </div>
                                ))}
                                <button type="button" onClick={addCandidateField} className="text-sm text-blue-400 hover:text-blue-300 mt-1">+ Add Candidate</button>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 hover:bg-slate-700 rounded transition">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition font-medium">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
