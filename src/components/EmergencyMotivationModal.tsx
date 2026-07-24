'use client';

import React, { useState } from 'react';
import { X, Flame, Zap, Sparkles, CheckCircle2, ArrowRight, HeartHandshake } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencyMotivationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOTIVATION_QUOTES = [
  {
    quote: "Không cần phải làm hoàn hảo. Chỉ cần bạn bước vào nhà vệ sinh và cầm bàn chải lên 20 giây thôi cũng là thắng rồi!",
    tip: "Thử thách 2 phút: Chỉ cần làm 2 phút. Nếu sau 2 phút vẫn thấy mệt, bạn có quyền nghỉ!",
  },
  {
    quote: "Kỷ luật không phải là hành hạ bản thân. Kỷ luật là thương bản thân của ngày mai!",
    tip: "Hãy tưởng tượng bạn sáng mai thức dậy với hơi thở thơm tho, da mặt sạch bóng và năng lượng dồi dào.",
  },
  {
    quote: "Một ngày không tập thể dục không làm bạn yếu đi, nhưng thói quen bỏ cuộc sẽ làm bạn mất đi sự tự tin.",
    tip: "Hãy thực hiện 5 cái chống đẩy hoặc hít thở sâu 1 phút ngay bây giờ!",
  },
  {
    quote: "Cơm tự nấu có thể không phải cao lương mỹ vị, nhưng đó là sự yêu thương bạn dành cho chính mình.",
    tip: "Nấu một món cực đơn giản trong 10 phút. Bắt đầu từ bước mở tủ lạnh ra xem!",
  },
];

export const EmergencyMotivationModal: React.FC<EmergencyMotivationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [index, setIndex] = useState(0);

  if (!isOpen) return null;

  const current = MOTIVATION_QUOTES[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length);
  };

  const handleAcceptChallenge = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <div className="clay-card w-full max-w-lg p-6 sm:p-8 relative bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-slate-900 border-amber-500/40 rounded-3xl shadow-2xl text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-clay-pill">
            <Flame className="w-7 h-7 animate-bounce-subtle fill-white" />
          </div>
          <div>
            <span className="text-xs font-extrabold tracking-wider text-amber-400 uppercase">
              Cứu Vãn Năng Lượng 🔥
            </span>
            <h2 className="text-2xl font-black font-heading text-white">
              Lười Quá? Không Sao Cả!
            </h2>
          </div>
        </div>

        {/* Quote Box */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-amber-500/30 mb-5 relative overflow-hidden">
          <p className="text-lg font-handwriting text-amber-200 leading-relaxed mb-3">
            &ldquo;{current.quote}&rdquo;
          </p>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>{current.tip}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleNext}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Đổi Câu Nói Khác</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleAcceptChallenge}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold text-sm shadow-clay-btn hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <HeartHandshake className="w-5 h-5 text-yellow-200" />
            <span>Tôi Sẽ Làm Ngay 2 Phút! 🚀</span>
          </button>
        </div>

      </div>
    </div>
  );
};
