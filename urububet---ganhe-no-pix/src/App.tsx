/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Navbar from './components/Navbar';
import SlotMachine from './components/SlotMachine';
import RouletteTable from './components/RouletteTable';
import { motion, AnimatePresence } from 'motion/react';
import { signIn } from './lib/firebase';
import { LayoutGrid, Gamepad2, TrendingUp, ShieldCheck } from 'lucide-react';
import { cn } from './lib/utils';

function AppContent() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = React.useState<'slots' | 'roulette'>('slots');
  const [isDemoMode, setIsDemoMode] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center overflow-hidden relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        </div>
        
        <Navbar isDemo={isDemoMode} setIsDemo={setIsDemoMode} />
        <main className="flex-1 w-full max-w-7xl px-4 md:px-8 flex flex-col items-center justify-center gap-10 py-10 md:py-20 relative z-10">
          <div className="relative group text-center space-y-8">
            <motion.div 
               initial={{ opacity: 0, y: 20 }} 
               animate={{ opacity: 1, y: 0 }}
               className="relative space-y-4"
            >
              <div className="flex justify-center mb-6">
                <img 
                  src="/urubu_mascot.png" 
                  alt="Urubu mascot" 
                  className="w-40 h-40 md:w-64 md:h-64 object-contain drop-shadow-[0_0_50px_rgba(14,165,233,0.3)]" 
                />
              </div>
              <span className="bg-sky-600 text-[10px] font-black uppercase px-2 py-1 rounded inline-block tracking-tighter italic">O Urubu tá ON</span>
              <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter leading-none">
                BÔNUS DE <span className="text-sky-500 font-black">500%</span>
              </h1>
              <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-2xl mx-auto italic">
                A casa do urubu de boné e chinelo. Ganhe bônus de boas-vindas na <span className="text-sky-500">UrubuBet</span>.
              </p>
            </motion.div>

            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={signIn}
                className="relative px-12 py-5 bg-white text-black text-xl font-black rounded-full overflow-hidden hover:scale-105 active:scale-95 transition-all group"
              >
                <span className="relative z-10">CADASTRAR E GANHAR</span>
                <div className="absolute inset-0 bg-sky-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.button>

              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setIsDemoMode(true)}
                className="relative px-12 py-5 bg-[#1e293b] text-sky-400 text-xl font-black rounded-full border border-sky-500/30 overflow-hidden hover:scale-105 active:scale-95 transition-all group"
              >
                <span className="relative z-10">TESTAR GRÁTIS</span>
                <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.button>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} label="Saque via PIX" />
            <FeatureCard icon={<TrendingUp className="w-6 h-6" />} label="Malandragem VIP" />
            <FeatureCard icon={<Gamepad2 className="w-6 h-6" />} label="+999 Jogos" />
            <FeatureCard icon={<LayoutGrid className="w-6 h-6" />} label="O Urubu Paga Muito" />
          </motion.div>
        </main>
        <FooterTicker />
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden selection:bg-sky-500 selection:text-black">
      <Navbar isDemo={isDemoMode} setIsDemo={setIsDemoMode} />
      
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 border-r border-white/10 bg-[#0f172a] flex-col p-4">
          <p className="text-[10px] uppercase font-black text-gray-500 mb-6 px-4 tracking-[0.2em]">Categorias</p>
          <div className="flex flex-col gap-1">
            <SidebarButton 
              active={activeTab === 'slots'} 
              onClick={() => setActiveTab('slots')} 
              icon="🐦‍⬛" 
              label="Urubuzinho Slots" 
              color="bg-sky-600" 
            />
            <SidebarButton 
              active={activeTab === 'roulette'} 
              onClick={() => setActiveTab('roulette')} 
              icon="🎡" 
              label="Roleta Imperial" 
              color="bg-green-600" 
            />
          </div>

          <div className="mt-8 px-4 py-4 bg-sky-500/10 rounded-2xl border border-sky-500/20 space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-sky-400">Modo Treino</span>
                <button 
                  onClick={() => setIsDemoMode(!isDemoMode)}
                  className={cn(
                    "w-10 h-5 rounded-full transition-colors relative",
                    isDemoMode ? "bg-sky-500" : "bg-slate-700"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all",
                    isDemoMode ? "left-5" : "left-0.5"
                  )} />
                </button>
             </div>
             <p className="text-[10px] text-gray-400 italic">No modo treino você usa fichas grátis e não gasta seu saldo real!</p>
          </div>

          <div className="mt-auto p-4 bg-gradient-to-t from-sky-500/10 to-transparent rounded-xl border border-sky-500/20">
             <p className="text-[10px] font-black text-sky-500 mb-1 uppercase tracking-widest italic">Suporte do Urubu</p>
             <p className="text-[10px] text-gray-400">O malandro te ajuda 24h.</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-[#020617] to-[#0f172a]">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                 {activeTab === 'slots' ? 'Fortune Urubu' : 'Roleta do Chinelo'} 
                 {isDemoMode && <span className="ml-3 text-sky-500 text-xs px-2 py-0.5 bg-sky-500/10 rounded border border-sky-500/20">MODO TREINO ATIVO</span>}
               </h2>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'slots' ? (
                <motion.div
                  key="slots"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <SlotMachine isDemo={isDemoMode} />
                </motion.div>
              ) : (
                <motion.div
                  key="roulette"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <RouletteTable isDemo={isDemoMode} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex w-72 flex-col gap-6">
            <UrubuTips />
            <div className="bg-[#0f172a] border border-white/5 p-6 rounded-3xl space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
                Vencendo Agora
              </h4>
              <div className="space-y-4">
                 <WinnerItem name="User777" amount={150.50} game="Slots" />
                 <WinnerItem name="UrubuKing" amount={2400} game="Roleta" />
                 <WinnerItem name="Ana_Pix" amount={50.00} game="Slots" />
              </div>
            </div>
          </aside>
        </main>
      </div>

      <FooterTicker />
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#020617] border-t border-white/10 h-16 flex items-center justify-around z-50">
          <button onClick={() => setActiveTab('slots')} className={cn("flex flex-col items-center p-2", activeTab === 'slots' ? 'text-sky-500' : 'text-gray-500')}>
            <Gamepad2 className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsDemoMode(!isDemoMode)}
            className={cn("relative -top-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all", isDemoMode ? "bg-sky-500 shadow-sky-500/40" : "bg-slate-800")}
          >
            <TrendingUp className="w-6 h-6" />
          </button>
          <button onClick={() => setActiveTab('roulette')} className={cn("flex flex-col items-center p-2", activeTab === 'roulette' ? 'text-sky-500' : 'text-gray-500')}>
            <LayoutGrid className="w-6 h-6" />
          </button>
      </div>
    </div>
  );
}

function UrubuTips() {
  const [tip, setTip] = React.useState<string>("Pedindo dica para o Urubu...");
  const [loading, setLoading] = React.useState(true);

  const fetchTip = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tiger-tips');
      const data = await res.json();
      setTip(data.tip);
    } catch (e) {
      setTip("O Urubu tá de olho! 🐦‍⬛");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTip();
    const interval = setInterval(fetchTip, 30000); // 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-sky-500/20 to-blue-600/20 border border-sky-500/30 p-6 rounded-3xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Gamepad2 className="w-12 h-12" /></div>
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">Dica do Urubu</span>
      </div>
      <p className={cn("text-xs leading-relaxed italic font-black text-white", loading ? "opacity-50" : "opacity-100")}>
        "{tip.replace(/"/g, '')}"
      </p>
    </div>
  );
}

function SidebarButton({ active, onClick, icon, label, color, disabled }: any) {
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg flex items-center gap-4 transition-all group",
        active ? "bg-white/5 border-l-2 border-sky-500 text-white" : "text-gray-400 hover:text-white hover:bg-white/5",
        disabled && "opacity-30 grayscale cursor-not-allowed"
      )}
    >
      <div className={cn("w-2 h-2 rounded-full", color || 'bg-gray-600')} />
      <span className="text-xs font-bold uppercase tracking-tight">{label}</span>
      <span className="ml-auto text-lg grayscale group-hover:grayscale-0 transition-all">{icon}</span>
    </button>
  );
}

function FeatureCard({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-6 rounded-2xl flex flex-col items-center gap-3 text-center transition-transform hover:-translate-y-1">
      <div className="p-3 bg-white/5 rounded-xl text-sky-500">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{label}</span>
    </div>
  );
}

function FooterTicker() {
  const gains = [
    { name: "MALANDRO88", game: "URUBUZINHO", amount: "R$ 1.250,80" },
    { name: "PIX_URUB", game: "ROLETA", amount: "R$ 840,00" },
    { name: "CHINELO_AZUL", game: "URUBUZINHO", amount: "R$ 5.120,00" },
    { name: "BONE_MARINHO", game: "ROLETA", amount: "R$ 250,50" },
    { name: "REI_DO_PIX", game: "URUBUZINHO", amount: "R$ 15.000,00" },
  ];

  return (
    <footer className="h-12 bg-[#020617] border-t border-white/10 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 overflow-hidden relative z-50">
      <div className="animate-marquee whitespace-nowrap gap-12 px-8 flex">
        {[...gains, ...gains].map((gain, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-sky-500">{gain.name}</span> GANHOU <span className="text-white">{gain.amount}</span> NO {gain.game}
          </div>
        ))}
      </div>
    </footer>
  );
}

function WinnerItem({ name, amount, game }: any) {
  return (
    <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2 last:border-0 last:pb-0">
      <div className="flex flex-col">
        <span className="font-bold">{name}</span>
        <span className="text-[10px] opacity-60 uppercase">{game}</span>
      </div>
      <span className="text-green-300 font-mono">+R$ {amount.toFixed(2)}</span>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
