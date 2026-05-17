import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Trophy, Zap } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { cn, formatCurrency } from '../lib/utils';
import confetti from 'canvas-confetti';

const SYMBOLS = ["🐦‍⬛", "🧢", "🩴", "💰", "💸", "🎰"];

export default function SlotMachine({ isDemo }: { isDemo?: boolean }) {
  const { user, userData } = useAuth();
  const [betAmount, setBetAmount] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState([["🐦‍⬛", "🧢", "🩴"], ["🐦‍⬛", "🧢", "🩴"], ["🐦‍⬛", "🧢", "🩴"]]);
  const [lastWin, setLastWin] = useState<number | null>(null);

  const spin = async () => {
    const hasBalance = isDemo || (userData?.balance || 0) >= betAmount;
    if ((!isDemo && !user) || !hasBalance || spinning) return;

    setSpinning(true);
    setLastWin(null);

    try {
      if (!isDemo) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { balance: increment(-betAmount) });
      }

      const response = await fetch('/api/games/spin-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ betAmount }),
      });

      const data = await response.json();
      
      // Animate reels (simulated)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update symbols to thematic ones if grid from server uses tiger symbols
      // (The server uses its own symbols, let's keep them distinct or map them)
      setReels(data.grid);
      
      if (data.winAmount > 0) {
        if (!isDemo) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { balance: increment(data.winAmount) });
        }
        setLastWin(data.winAmount);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0ea5e9', '#38bdf8', '#7dd3fc']
        });
      }

      if (!isDemo) {
        await addDoc(collection(db, 'bets'), {
          userId: user.uid,
          gameType: 'slot',
          amount: betAmount,
          winAmount: data.winAmount,
          result: JSON.stringify(data.grid),
          timestamp: serverTimestamp(),
        });
      }

    } catch (err) {
      console.error(err);
    } finally {
      setSpinning(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8 bg-[#0f172a] rounded-[2rem] border border-white/10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div className="flex items-center gap-2 mb-2">
           <span className="bg-sky-600 text-[10px] font-black uppercase px-2 py-0.5 rounded italic">Urubuzinho</span>
           <span className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase">Original da Malandra</span>
        </div>
        <h2 className="text-5xl font-black text-white italic tracking-tighter flex items-center gap-2">
          URUBU DA <span className="text-sky-500">GRANA</span>
        </h2>
      </div>

      <div className="relative flex gap-2 md:gap-4 p-4 md:p-6 bg-navy-900 rounded-3xl border border-white/5 shadow-2xl overflow-x-auto w-full justify-center">
        {reels.map((column, colIdx) => (
          <div key={colIdx} className="w-20 md:w-24 h-48 md:h-64 bg-[#020617] rounded-xl overflow-hidden border border-white/5 relative flex-shrink-0">
            <motion.div
              animate={spinning ? { y: [-1000, 0] } : { y: 0 }}
              transition={spinning ? { duration: 0.1, repeat: Infinity, ease: "linear" } : { duration: 0.5, type: "spring" }}
              className="flex flex-col items-center py-2 gap-4"
            >
              {(spinning ? [...SYMBOLS, ...SYMBOLS, ...SYMBOLS] : column).map((sym, i) => (
                <div key={i} className="text-3xl md:text-5xl h-12 md:h-16 flex items-center justify-center bg-white/5 w-full rounded-lg">
                  {sym === "🐯" ? "🐦‍⬛" : sym === "💰" ? "💸" : sym === "🎰" ? "🩴" : sym}
                </div>
              ))}
            </motion.div>
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(3,7,18,1)]" />
          </div>
        ))}
        {/* Win Line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-sky-600/50 -translate-y-1/2 pointer-events-none blur-[1px] z-20" />
      </div>

      <div className="flex flex-col w-full gap-4 max-w-sm relative z-10">
        <div className="flex justify-between items-end px-2">
          <label className="text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
            {isDemo ? 'Aposta em Fichas' : 'Aposta Real'}
          </label>
          <span className="text-sky-400 font-mono font-bold text-lg">{formatCurrency(betAmount)}</span>
        </div>
        <div className="flex gap-2">
          {[1, 5, 10, 50].map(val => (
            <button
              key={val}
              onClick={() => setBetAmount(val)}
              className={cn(
                "flex-1 py-3 rounded-xl font-black text-xs transition-all border",
                betAmount === val 
                  ? "bg-sky-500 text-white border-sky-400 scale-95" 
                  : "bg-navy-800 text-gray-400 border-white/5 hover:bg-white/5 hover:text-white"
              )}
            >
              {val}
            </button>
          ))}
        </div>

        <button
          onClick={spin}
          disabled={spinning || (!isDemo && (userData?.balance || 0) < betAmount)}
          className={cn(
            "w-full py-6 rounded-2xl text-xl font-black uppercase tracking-tighter italic transition-all transform active:scale-95 shadow-xl relative overflow-hidden group",
            spinning || (!isDemo && (userData?.balance || 0) < betAmount)
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-white text-[#020617] hover:brightness-110"
          )}
        >
          {spinning ? "Pousando..." : isDemo ? "TESTAR GRÁTIS" : "JOGAR AGORA"}
          {!spinning && <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="w-8 h-8" /></div>}
        </button>
      </div>

      <AnimatePresence>
        {lastWin && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 p-6"
          >
            <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white px-12 py-6 rounded-3xl font-black text-4xl shadow-[0_0_100px_rgba(14,165,233,0.5)] flex flex-col items-center gap-2 border border-white/20 italic tracking-tighter">
              <Trophy className="w-12 h-12 mb-2" />
              {isDemo ? 'DEMO WIN!' : 'GANHOU NO PIX!'}
              <span className="text-white text-6xl break-all text-center">{formatCurrency(lastWin)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
