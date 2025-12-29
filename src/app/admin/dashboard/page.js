export default function AdminDashboard() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-slate-400 text-sm font-medium uppercase">Total Elections</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                    {/* We can fetch stats here later if needed */}
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-slate-400 text-sm font-medium uppercase">Total Voters</h3>
                    <p className="text-4xl font-bold mt-2">--</p>
                </div>
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
                    <h3 className="text-slate-400 text-sm font-medium uppercase">Active Elections</h3>
                    <p className="text-4xl font-bold text-green-400 mt-2">--</p>
                </div>
            </div>

            <div className="mt-8 bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                <p className="text-slate-400">Select an option from the sidebar to manage elections or voters.</p>
            </div>
        </div>
    );
}
