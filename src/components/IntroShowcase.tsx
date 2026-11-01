'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Flame, Sparkles, ArrowRight, ShieldCheck, CheckCircle2, 
  BarChart3, Wallet, Camera, FileText, PiggyBank, 
  TrendingUp, Compass, Award, Star, Play, ChevronRight, UserCheck
} from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';

interface IntroShowcaseProps {
  onStartGuest?: () => void;
  onAuthSuccess?: (username: string) => void;
}

export const IntroShowcase: React.FC<IntroShowcaseProps> = ({
  onStartGuest,
  onAuthSuccess,
}) => {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Start exploration as Guest
  const handleStartGuestMode = () => {
    if (onStartGuest) {
      onStartGuest();
    } else {
      router.push('/');
    }
  };

  const handleOpenFinanceGuest = () => {
    router.push('/tai-chinh');
  };

  const handleOpenAuth = (tab: 'LOGIN' | 'REGISTER') => {
    setAuthInitialTab(tab);
    setIsAuthModalOpen(true);
  };

  const handleSuccess = (username: string) => {
    if (onAuthSuccess) {
      onAuthSuccess(username);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-x-hidden">
      
      {/* Dynamic Background Glows & Grid */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-amber-500/15 via-orange-500/10 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-[40%] -left-32 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[130px]" />
        <div className="absolute bottom-[10%] -right-32 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]" />
        
        {/* Subtle Perspective Grid Lines */}
        <div 
          className="absolute inset-0 opacity-[0.035]" 
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>

      {/* Top Floating Glass Navigation */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#070A11]/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo & Slogan */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
              <Flame className="w-6 h-6 fill-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white">
                  BETTER THAN YESTERDAY
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  PRO DISCIPLINE
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-400">
                Tốt Hơn 1% Mỗi Ngày • Kỷ Luật Là Tự Do
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleStartGuestMode}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all"
            >
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Khám Phá Thử (Guest)</span>
            </button>

            <button
              onClick={() => handleOpenAuth('LOGIN')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              Đăng Nhập
            </button>

            <button
              onClick={() => handleOpenAuth('REGISTER')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Vào Trải Nghiệm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-12 sm:pt-16 pb-24">
        
        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold tracking-wide animate-fadeIn">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>HỆ THỐNG QUẢN TRỊ KỶ LUẬT & TỰ DO TÀI CHÍNH THẾ HỆ MỚI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Tốt Hơn <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500">1% Mỗi Ngày</span>,
            <br />
            Kỷ Luật Để Chạm Tới Tự Do.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Không gian rèn luyện thói quen kiên định, trực quan hóa chuỗi ngày nỗ lực với biểu đồ nhiệt Heatmap chuẩn GitHub, kho quỹ tiết kiệm quy đổi hữu hình và mô hình 6 hũ tài chính thông minh.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3">
            <button
              onClick={handleStartGuestMode}
              className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 active:scale-95 transition-all flex items-center gap-2.5 group"
            >
              <Compass className="w-5 h-5 text-yellow-200 group-hover:rotate-45 transition-transform" />
              <span>Khám Phá Trải Nghiệm Thử Ngay</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={handleOpenFinanceGuest}
              className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-slate-700/80 shadow-lg active:scale-95 transition-all flex items-center gap-2"
            >
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Mở 6 Hũ Tài Chính</span>
            </button>

            <button
              onClick={() => handleOpenAuth('LOGIN')}
              className="px-5 py-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 hover:text-white font-semibold text-sm border border-slate-800 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Đăng Nhập / Đăng Ký</span>
            </button>
          </div>

          {/* Guest Mode Assurance Note */}
          <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Xem & trải nghiệm toàn bộ dữ liệu mẫu mà không cần tạo tài khoản trước.</span>
          </p>

        </div>

        {/* 3D Interactive Pillars (4 Floating 3D Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-16 sm:mt-20">
          
          {/* Card 1: Heatmap Activity */}
          <div className="group relative p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/80 hover:border-amber-500/50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-amber-400 px-2 py-0.5 rounded-full bg-amber-500/10">
                <Star className="w-3 h-3 fill-amber-400" />
                <span>9.9</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-amber-400 transition-colors">
              GitHub Heatmap 365 Ngày
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Biểu đồ nhiệt 52 tuần ghi nhận từng giọt mồ hôi và nỗ lực. Duy trì ngọn lửa streak không bao giờ tắt.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-amber-400/90 group-hover:text-amber-300">
              <span>Khám phá Heatmap</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Savings Vault */}
          <div className="group relative p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/80 hover:border-emerald-500/50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10">
                <Star className="w-3 h-3 fill-emerald-400" />
                <span>9.8</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
              Kho Quỹ Tích Lũy Kỷ Luật
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Tự nấu cơm, chạy bộ, không uống nước ngọt: mỗi thói quen tốt đều được tích lũy tiền ảo vào két sắt ghi nhận nỗ lực.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-emerald-400/90 group-hover:text-emerald-300">
              <span>Xem Savings Vault</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: 6 Financial Jars */}
          <div className="group relative p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/80 hover:border-cyan-500/50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10">
                <Star className="w-3 h-3 fill-cyan-400" />
                <span>9.9</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-cyan-400 transition-colors">
              Quy Tắc 6 Hũ Tài Chính
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Quản trị dòng tiền lương & thưởng, phân bổ vào Tiết kiệm, Cổ phiếu, Kinh doanh, Du lịch và Chi tiêu theo tỷ lệ vàng.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400/90 group-hover:text-cyan-300">
              <span>Trải nghiệm 6 Hũ</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Proof Gallery & Rich Notes */}
          <div className="group relative p-6 rounded-3xl bg-[#0D121F]/90 border border-slate-800/80 hover:border-indigo-500/50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Camera className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-black text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10">
                <Star className="w-3 h-3 fill-indigo-400" />
                <span>9.7</span>
              </div>
            </div>
            <h3 className="text-lg font-black text-white mb-2 group-hover:text-indigo-400 transition-colors">
              Kho Ảnh Bằng Chứng & Notes
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Lưu trữ hình ảnh xác thực mỗi ngày, Mood Tracker cảm xúc, Todo List ưu tiên và sổ tay Markdown phân cấp.
            </p>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-indigo-400/90 group-hover:text-indigo-300">
              <span>Mở Kho Bằng Chứng</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* Impact Numbers Section */}
        <div className="mt-16 sm:mt-24 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/5 via-slate-900 to-emerald-500/5 border border-slate-800/90 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                37.78x
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-300">
                Hiệu ứng lãi kép
              </div>
              <p className="text-[11px] text-slate-500">
                Tốt hơn 1% sau 365 ngày
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                365 Ngày
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-300">
                Lưới nhiệt Activity
              </div>
              <p className="text-[11px] text-slate-500">
                Chuẩn phong cách GitHub
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                6 Hũ
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-300">
                Tài chính thông minh
              </div>
              <p className="text-[11px] text-slate-500">
                Phân bổ thu nhập tự động
              </p>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                100%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-300">
                Khám phá tự do
              </div>
              <p className="text-[11px] text-slate-500">
                Dữ liệu mock phong phú
              </p>
            </div>

          </div>
        </div>

        {/* Bottom Call to Action Banner */}
        <div className="mt-16 sm:mt-20 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Sẵn sàng để trở thành phiên bản tốt nhất của chính mình?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Hãy bắt đầu ngay hôm nay bằng cách trải nghiệm thử hoặc đăng ký một tài khoản để xây dựng chuỗi thói quen đầu tiên!
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartGuestMode}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/25 active:scale-95 transition-all"
            >
              <span>Vào Khám Phá Toàn Diện Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 Better Than Yesterday • Phát triển bởi xu4ns0n • Kỷ luật là tự do</p>
      </footer>

      {/* Interactive Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleSuccess}
        initialTab={authInitialTab}
      />

    </div>
  );
};

