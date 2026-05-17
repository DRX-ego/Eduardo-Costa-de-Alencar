import React, { useState } from 'react';
import { motion } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, increment, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { formatCurrency, cn } from '../lib/utils';
import { CircleDot, Trophy, Zap } from 'lucide-react';

const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export default function RouletteTable({ isDemo }: { isDemo?: boolean }) {
  const { user, userData } = useAuth();
  const [bets, setBets] = useState<Record<string, number>>({});
  const [rolling, setRolling] = useState(false);
  const [lastResult, setLastResult] = useState<{ number: number; color: string } | null>(null);

  const placeBet = (type: string) => {
    if (rolling) return;
    const currentBet = bets[type] || 0;
    const totalBet = (Object.values(bets) as number[]).reduce((a: number, b: number) => a + b, 0);
    
    if (!isDemo && (userData?.balance || 0) < totalBet + 1) return;

    setBets({ ...bets, [type]: currentBet + 1 });
  };

  const clearBets = () => !rolling && setBets({});

  const roll = async () => {
    const totalBet = (Object.values(bets) as number[]).reduce((a: number, b: number) => a + b, 0);
    if ((!isDemo && !user) || totalBet === 0 || rolling) return;

    setRolling(true);
    try {
      if (!isDemo) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { balance: increment(-totalBet) });
      }

      const response = await fetch('/api/games/roll-roulette', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bets }),
      });

      const data = await response.json();
      
      // Animation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      setLastResult({ number: data.resultNumber, color: data.resultColor });
      
      if (data.totalWin > 0) {
        if (!isDemo) {
          const userRef = doc(db, 'users', user.uid);
          await updateDoc(userRef, { balance: increment(data.totalWin) });
        }
      }

      if (!isDemo) {
        await addDoc(collection(db, 'bets'), {
          userId: user.uid,
          gameType: 'roulette',
          amount: totalBet,
          winAmount: data.totalWin,
          result: { number: data.resultNumber, color: data.resultColor },
          timestamp: serverTimestamp(),
        });
      }

      setBets({});
    } catch (err) {
      console.error(err);
    } finally {
      setRolling(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 md:gap-10 p-4 md:p-8 bg-[#0f172a] rounded-[2rem] border border-white/10 relative overflow-hidden group w-full">
      <div className="absolute inset-0 bg-sky-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-2">
           <span className="bg-sky-600 text-[10px] font-black uppercase px-2 py-0.5 rounded italic">Mesa do Urubu</span>
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter text-white">
          ROLETA DO <span className="text-sky-500 font-black">CHINELO</span>
        </h2>
      </div>

      <div className="flex items-center justify-center h-32 w-32 md:h-40 md:w-40 rounded-full border-8 border-navy-800 bg-[#020617] relative shadow-[0_0_50px_rgba(14,165,233,0.1)] overflow-hidden">
        {rolling ? (
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-full h-full flex flex-col items-center justify-center"
          >
             <div className="w-1.5 h-full bg-sky-500/20 absolute" />
             <div className="w-3 h-3 bg-white rounded-full absolute top-2 shadow-[0_0_15px_white]" />
          </motion.div>
        ) : lastResult ? (
          <div className={cn("w-full h-full flex flex-col items-center justify-center font-black text-5xl italic tracking-tighter", lastResult.color === 'red' ? 'text-red-500' : lastResult.color === 'black' ? 'text-white' : 'text-sky-500')}>
            {lastResult.number}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
             <CircleDot className="text-gray-800 w-12 h-12" />
             <span className="text-[8px] text-gray-600 font-bold tracking-widest uppercase">Girando o Chinelo</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 md:gap-3 w-full max-w-md relative z-10">
        <BetButton label="VERMELHO" type="red" color="red" onPlace={placeBet} amount={bets['red']} rolling={rolling} />
        <BetButton label="ZERO" type="green" color="green" onPlace={placeBet} amount={bets['green']} rolling={rolling} />
        <BetButton label="PRETO" type="black" color="black" onPlace={placeBet} amount={bets['black']} rolling={rolling} />
        
        <BetButton label="PAR" type="even" color="black" onPlace={placeBet} amount={bets['even']} rolling={rolling} />
        <div className="flex flex-col items-center justify-center bg-navy-800 rounded-xl border border-white/10 p-2 text-center">
          <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Aposta</span>
          <span className="font-mono text-sky-400 font-bold">{formatCurrency((Object.values(bets) as number[]).reduce((a: number, b: number) => a + b, 0))}</span>
        </div>
        <BetButton label="ÍMPAR" type="odd" color="red" onPlace={placeBet} amount={bets['odd']} rolling={rolling} />
      </div>

      <div className="flex gap-3 w-full max-w-sm relative z-10">
        <button 
          onClick={clearBets} 
          disabled={rolling}
          className="flex-1 py-4 bg-navy-800 border border-white/5 rounded-xl text-gray-500 font-bold text-xs hover:bg-white/5 hover:text-white transition-all uppercase tracking-widest"
        >
          Limpar
        </button>
        <button 
          onClick={roll} 
          disabled={rolling || (Object.values(bets) as number[]).reduce((a: number, b: number) => a + b, 0) === 0}
          className="flex-[2] py-4 bg-white text-black font-black italic text-sm rounded-xl hover:brightness-110 disabled:grayscale transition-all active:scale-95 shadow-xl uppercase tracking-widest"
        >
          {rolling ? "Rodando..." : isDemo ? "TESTAR GRÁTIS" : "APOSTAR REAL"}
        </button>
      </div>
    </div>
  );
}

function BetButton({ label, type, amount, onPlace, color, rolling }: any) {
  const colorMap = {
    red: "bg-red-600/10 border-red-500/20 text-red-500",
    black: "bg-white/5 border-white/10 text-white",
    green: "bg-green-600/10 border-green-500/20 text-sky-500"
  };

  return (
    <button
      onClick={() => onPlace(type)}
      disabled={rolling}
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all active:scale-95 group",
        colorMap[color as keyof typeof colorMap],
        !amount && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100"
      )}
    >
      <span className="text-[9px] font-black tracking-[0.15em]">{label}</span>
      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-mono font-bold text-white border border-white/10 shadow-inner group-hover:border-sky-500/50 transition-colors">
        {amount || 0}
      </div>
    </button>
  );
}
