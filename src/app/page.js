import Link from 'next/link';
import { Vote, Shield, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black text-white">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-2">
          <Vote className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            SecureVote
          </span>
        </div>
        <div className="space-x-4">
          <Link href="/login" className="px-4 py-2 hover:text-blue-300 transition">Login</Link>
          <Link href="/signup" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-full font-medium transition shadow-lg shadow-blue-500/30">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center mt-20 px-4">
        <div className="relative">
          <Shield className="w-24 h-24 text-blue-500 opacity-20 absolute -top-8 -left-8 animate-pulse" />
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Your Voice, <span className="text-blue-500">Your Power</span>
          </h1>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mb-10 leading-relaxed">
          Experience the future of democracy with our secure, transparent, and user-friendly online voting platform.
        </p>
        <div className="flex space-x-4">
          <Link href="/login" className="px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition transform hover:scale-105 shadow-xl">
            Get Started
          </Link>
          <Link href="/about" className="px-8 py-4 border border-slate-600 rounded-full font-medium text-lg hover:bg-slate-800 transition">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto mt-32 grid md:grid-cols-3 gap-8 px-4 pb-20">
        {[
          { title: "Secure", desc: "End-to-end encryption ensures your vote remains private and tamper-proof.", icon: Shield },
          { title: "Transparent", desc: "Real-time results and verifiable audits for complete trust.", icon: CheckCircle },
          { title: "Accessible", desc: "Vote from anywhere, anytime, on any device.", icon: Vote },
        ].map((feature, idx) => (
          <div key={idx} className="p-8 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 hover:border-blue-500/50 transition duration-300">
            <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-400">{feature.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
