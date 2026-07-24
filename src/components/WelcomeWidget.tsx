'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Sparkles, Flame, Trophy, Sun, Moon, Sunrise } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface WelcomeWidgetProps {
  streakCount: number;
  userName?: string;
  onOpenMotivationModal: () => void;
}

export const WelcomeWidget: React.FC<WelcomeWidgetProps> = ({
  streakCount,
  userName = 'Sơn',
  onOpenMotivationModal,
}) => {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime ? currentTime.getHours() : 12;
  let timeGreeting = 'Chào Buổi Tối 🌙';
  let GreetingIcon = Moon;
  let greetingColor = 'text-indigo-400';

  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Chào Buổi Sáng 🌅';
    GreetingIcon = Sunrise;
    greetingColor = 'text-amber-400';
  } else if (hour >= 12 && hour < 18) {
    timeGreeting = 'Chào Buổi Chiều ☀️';
    GreetingIcon = Sun;
    greetingColor = 'text-amber-500';
  }

  const timeString = currentTime ? format(currentTime, 'HH:mm:ss') : '--:--:--';
  const dateString = currentTime ? format(currentTime, "EEEE, 'ngày' dd/MM/yyyy", { locale: vi }) : '';

  return (
    <div className="modern-card p-5 sm:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-indigo-500/30">
      
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
        
        {/* Left Greeting & Time */}
        <div className="min-w-0 flex-1 w-full">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/10 backdrop-blur-md border border-white/20 whitespace-nowrap ${greetingColor}`}>
              <GreetingIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{timeGreeting}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse flex-shrink-0" />
              <span>{streakCount} Ngày Liên Tục</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-1.5 whitespace-nowrap truncate">
            Xin chào <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-indigo-300 bg-clip-text text-transparent">{userName}</span>! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-medium leading-relaxed">
            Hôm nay bạn đã sẵn sàng chiến thắng sự lười biếng để tốt hơn 1% chưa?
          </p>
        </div>

        {/* Right Real-time Clock Display */}
        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-indigo-500/30 backdrop-blur-md shadow-xl flex-shrink-0 w-full lg:w-auto justify-between lg:justify-start">
          <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md flex-shrink-0">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping flex-shrink-0" />
              <span>Real-time (GMT+7)</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-amber-400 whitespace-nowrap">
              {timeString}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-400 capitalize whitespace-nowrap truncate">
              {dateString}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
