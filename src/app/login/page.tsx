'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, 
  Flame, UserPlus, Compass, Sparkles, CheckCircle2 
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('bty_auth');
    if (isAuth === 'true') {
      router.push('/');
    }
  }, [router]);

  const saveAuthSession = (u: string, fullName: string) => {
    localStorage.setItem('bty_auth', 'true');
    localStorage.setItem('bty_current_user', JSON.stringify({ username: u, fullName }));
    localStorage.removeItem('bty_guest');
    document.cookie = 'bty_auth=true; path=/; max-age=2592000'; // 30 days
    setIsLoading(false);
    router.push('/');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const u = username.trim();
      const p = password;

      // 1. Admin hardcoded
      if (u === 'xu4ns0n' && p === 'Sondeptrai123@k') {
        saveAuthSession(u, 'Nguyễn Xuân Sơn');
        return;
      }

      // 2. Check registered users
      const usersRaw = localStorage.getItem('bty_users');
      const users: Array<{ username: string; password: string; fullName: string }> = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find((user) => user.username.toLowerCase() === u.toLowerCase() && user.password === p);

      if (found) {
        saveAuthSession(found.username, found.fullName);
      } else {
        setErrorMsg('Tài khoản hoặc mật khẩu không chính xác!');
        setIsLoading(false);
      }
    }, 500);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const u = regUsername.trim();
      const p = regPassword;
      const fn = regFullName.trim();

      if (u.length < 3) {
        setErrorMsg('Tên đăng nhập phải có ít nhất 3 ký tự!');
        setIsLoading(false);
        return;
      }

      if (p.length < 6) {
        setErrorMsg('Mật khẩu phải có ít nhất 6 ký tự!');
        setIsLoading(false);
        return;
      }

      if (p !== regConfirmPassword) {
        setErrorMsg('Mật khẩu xác nhận không trùng khớp!');
        setIsLoading(false);
        return;
      }

      const usersRaw = localStorage.getItem('bty_users');
      const users: Array<{ username: string; password: string; fullName: string }> = usersRaw ? JSON.parse(usersRaw) : [];
      if (u.toLowerCase() === 'xu4ns0n' || users.some((user) => user.username.toLowerCase() === u.toLowerCase())) {
        setErrorMsg('Tên đăng nhập này đã tồn tại, vui lòng chọn tên khác!');
        setIsLoading(false);
        return;
      }

      const newUser = { username: u, password: p, fullName: fn || u, createdAt: new Date().toISOString() };
      users.push(newUser);
      localStorage.setItem('bty_users', JSON.stringify(users));

      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng...');
      setTimeout(() => {
        saveAuthSession(newUser.username, newUser.fullName);
      }, 700);
    }, 500);
  };

  const handleQuickLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      saveAuthSession(u, u === 'xu4ns0n' ? 'Nguyễn Xuân Sơn' : 'Người Dùng Thử Nghiệm');
    }, 350);
  };

  const handleContinueAsGuest = () => {
    localStorage.setItem('bty_guest', 'true');
    router.push('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#090D16] text-slate-100 font-sans relative overflow-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-indigo-500/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Login / Register Container Box */}
      <div className="w-full max-w-md modern-card p-6 sm:p-8 bg-[#0D1117]/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative z-10 space-y-5 rounded-3xl">
        
        {/* Top Logo & Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-amber-500/30">
            <Flame className="w-8 h-8 fill-white animate-pulse" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white whitespace-nowrap">
              Better Than Yesterday
            </h1>
            <p className="text-xs font-bold text-amber-400 mt-0.5 whitespace-nowrap">
              Tốt Hơn 1% Mỗi Ngày • Kỷ Luật Là Tự Do
            </p>
          </div>
        </div>

        {/* Navigation Tabs: ĐĂNG NHẬP / ĐĂNG KÝ */}
        <div className="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setTab('LOGIN');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'LOGIN'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('REGISTER');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'REGISTER'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng Ký Mới</span>
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN FORM */}
        {tab === 'LOGIN' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Tài Khoản</label>
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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Mật Khẩu</label>
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
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Đang xác thực...' : 'Truy Cập Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* TAB 2: REGISTER FORM */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Họ Và Tên</label>
              <input
                type="text"
                required
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="VD: Nguyễn Văn A..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Tên Đăng Nhập</label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="VD: nguyenvana..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Mật Khẩu (Ít nhất 6 ký tự)</label>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Nhập mật khẩu..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Xác Nhận Mật Khẩu</label>
              <input
                type="password"
                required
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-[#161B22] text-sm text-white font-medium placeholder-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? 'Đang tạo tài khoản...' : 'Đăng Ký Tài Khoản'}</span>
              <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo 1-Click Accounts */}
        <div className="pt-3 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-bold text-slate-400 text-center flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tài Khoản Mẫu Trải Nghiệm Nhanh (1-Click)</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('xu4ns0n', 'Sondeptrai123@k')}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 text-center transition-all hover:scale-[1.02]"
            >
              <span className="block text-[10px] text-amber-400 font-bold uppercase">Quản Trị</span>
              <span>xu4ns0n</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('guest_demo', '123456')}
              className="py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 text-center transition-all hover:scale-[1.02]"
            >
              <span className="block text-[10px] text-emerald-400 font-bold uppercase">Thành Viên</span>
              <span>guest_demo</span>
            </button>
          </div>
        </div>

        {/* Continue as Guest Button */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Khám Phá Thử với Tư Cách Khách (Guest Mode)</span>
          </button>

          <button
            type="button"
            onClick={() => router.push('/intro')}
            className="text-[11px] text-center text-slate-400 hover:text-amber-400 transition-colors font-medium"
          >
            ✨ Xem Giới Thiệu 3D (Intro Showcase)
          </button>
        </div>

      </div>

    </div>
  );
}
