import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { signIn, logout } from '../lib/firebase';
import { formatCurrency, cn } from '../lib/utils';
import { LogOut, User as UserIcon, Wallet, Menu } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar({ isDemo, setIsDemo }: { isDemo?: boolean, setIsDemo?: (val: boolean) => void }) {
  const { user, userData } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#020617] border-b border-white/10 z-40 px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
         <div className="text-2xl font-black tracking-tighter italic text-sky-500">
           URUBU<span className="text-white">BET</span>
         </div>
         <div className="hidden md:flex gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            <a href="#" className="text-sky-500">Início</a>
            <a href="#" className="hover:text-white transition-colors">Cassino</a>
            {setIsDemo && (
              <button 
                onClick={() => setIsDemo(!isDemo)}
                className={cn("transition-colors uppercase", isDemo ? "text-orange-500" : "hover:text-white")}
              >
                {isDemo ? "Sair do Demo" : "Testar Grátis"}
              </button>
            )}
         </div>
      </div>

      <div className="flex items-center gap-4">
        {(user || isDemo) ? (
          <>
            <div className="bg-[#1e293b] rounded-full px-4 py-1.5 flex items-center gap-3 border border-white/5">
               <span className="text-[10px] uppercase font-bold text-gray-500">
                 {isDemo ? "Saldo Demo" : "Saldo"}
               </span>
               <span className={cn("font-mono font-bold", isDemo ? "text-orange-500" : "text-sky-400")}>
                 {formatCurrency(isDemo ? 1000 : (userData?.balance || 0))}
               </span>
            </div>
            
            {user && (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                 <div className="flex flex-col items-end">
                    <span className="text-xs text-white font-bold">{userData?.displayName}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-tighter">Malandro VIP</span>
                 </div>
                 <button 
                    onClick={logout}
                    className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                 </button>
              </div>
            )}
            
            {!user && isDemo && (
              <button 
                onClick={signIn}
                className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-1.5 rounded-md font-black text-[10px] uppercase transition-all"
              >
                ENTRAR
              </button>
            )}
          </>
        ) : (
          <button 
            onClick={signIn}
            className="bg-sky-600 hover:bg-sky-500 text-white px-6 py-2 rounded-md font-black text-xs uppercase transition-all transform active:scale-95"
          >
            ENTRAR
          </button>
        )}
      </div>
    </nav>
  );
}
