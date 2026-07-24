'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('bty_auth');
    if (isAuth === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      if (username.trim() === 'xu4ns0n' && password === 'Sondeptrai123@k') {
        localStorage.setItem('bty_auth', 'true');
        document.cookie = 'bty_auth=true; path=/; max-age=2592000'; // 30 days
        router.push('/');
      } else {
        setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#090D16] text-slate-100 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Login Container Box */}
      <div className="w-full max-w-md modern-card p-6 sm:p-8 bg-[#0D1117]/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10 space-y-6">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30">
            <Flame className="w-8 h-8 fill-white animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white whitespace-nowrap">
              Better Than Yesterday
            </h1>
            <p className="text-xs font-bold text-amber-400 mt-1 whitespace-nowrap">
              Tốt Hơn 1% Mỗi Ngày • Đăng Nhập
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tài Khoản
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Mật Khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap mt-2"
          >
            <span>{isLoading ? 'Đang xác thực...' : 'Truy Cập Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Note */}
        <p className="text-[11px] text-center text-slate-500 font-medium">
          🔒 Trang web được bảo mật cá nhân.
        </p>

      </div>

    </div>
  );
}
