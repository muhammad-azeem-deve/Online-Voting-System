"use client";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, AlertCircle, BarChart3 } from 'lucide-react';

export default function VoterDashboard() {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [votingFor, setVotingFor] = useState(null); // { electionId, candidateId }

    const fetchElections = async () => {
        try {
            const res = await fetch('/api/voter/elections');
            const data = await res.json();
            if (data.success) {
                // Add local state for 'hasVoted' if API doesn't provide it directly per election.
                // Since API is generic, we might rely on the error message "You have already voted" 
                // OR we should ideally check it.
                // For now, we will rely on trying to vote.
                setElections(data.elections);
            }
        } catch (e) { toast.error('Failed to fetch elections'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchElections(); }, []);

    const handleVote = async (electionId, candidateId) => {
        if (!confirm("Confirm your vote? This cannot be undone.")) return;
        try {
            const res = await fetch('/api/voter/vote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ electionId, candidateId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Vote cast successfully!');
                fetchElections(); // Refresh to see updated counts if visible
            } else {
                if (data.error.includes("already voted")) {
                    toast.error("You have already cast your vote for this election.");
                } else {
                    toast.error(data.error);
                }
            }
        } catch (e) { toast.error("Voting failed"); }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Active Elections</h1>

            <div className="grid gap-8">
                {elections.map(election => (
                    <div key={election._id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{election.title}</h2>
                                <p className="text-slate-400">{election.description}</p>
                            </div>
                            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                     ${election.status === 'active' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>
                                {election.status}
                            </span>
                        </div>

                        <div className="p-6 grid md:grid-cols-2 gap-4">
                            {election.candidates.map(candidate => (
                                <div key={candidate._id} className="relative group bg-slate-900/50 hover:bg-slate-700/50 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 transition duration-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{candidate.name}</h3>
                                            <p className="text-sm text-slate-400">{candidate.party}</p>
                                        </div>
                                        {/* Only show vote button if active */}
                                        {election.status === 'active' && (
                                            <button
                                                onClick={() => handleVote(election._id, candidate._id)}
                                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition shadow-lg shadow-blue-600/20"
                                            >
                                                Vote
                                            </button>
                                        )}
                                    </div>

                                    {/* Show Progress Bar/Results always or only if voted? 
                             The requirement says "view results". I'll show it universally for transparency. */}
                                    <div className="mt-4">
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Votes</span>
                                            <span>{candidate.voteCount}</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                            {/* Calculate percentage if total votes > 0.
                                     Need total votes of election. */}
                                            <div className="bg-blue-500 h-full rounded-full"
                                                style={{ width: `${(candidate.voteCount / (election.candidates.reduce((a, b) => a + b.voteCount, 0) || 1)) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="px-6 py-4 bg-slate-900/30 border-t border-slate-700 text-center text-sm text-slate-500">
                            {election.status === 'active' ?
                                <span className="flex items-center justify-center gap-2"><CheckCircle2 size={16} className="text-green-500" /> Voting is Open</span> :
                                <span className="flex items-center justify-center gap-2"><AlertCircle size={16} /> Election Ended</span>
                            }
                        </div>
                    </div>
                ))}

                {elections.length === 0 && !loading && (
                    <div className="text-center py-20 bg-slate-800 rounded-2xl border border-slate-700">
                        <p className="text-slate-400 text-lg">No elections found at the moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
