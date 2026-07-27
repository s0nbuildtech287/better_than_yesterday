'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wallet, PiggyBank, TrendingUp, Briefcase, Plane, ShoppingBag, 
  PlusCircle, MinusCircle, ArrowRightLeft, DollarSign, PieChart, 
  Sparkles, RefreshCw, CheckCircle2, ChevronLeft, Calendar, Info, Layers,
  Plus, Trash2, Edit3, X, FileText, Clock, Send
} from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';

interface FinanceIncome {
  id: string;
  monthYear: string;
  monthlySalary: number;
  bonusIncome: number;
  totalIncome: number;
}

interface FinanceTransaction {
  id: string;
  jarId: string;
  type: 'IN' | 'OUT';
  amount: number;
  description: string;
  txDate: string;
  createdAt: string;
  jar?: {
    name: string;
    color: string;
    icon: string;
  };
}

interface FinanceNote {
  id: string;
  jarId: string;
  content: string;
  createdAt: string;
}

interface FinanceJar {
  id: string;
  name: string;
  categoryKey: string;
  percentage: number;
  icon: string;
  color: string;
  currentBalance: number;
  transactions?: FinanceTransaction[];
  _count?: {
    notes?: number;
  };
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<string>('FINANCE');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [income, setIncome] = useState<FinanceIncome | null>(null);
  const [jars, setJars] = useState<FinanceJar[]>([]);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Editable Income States
  const [salaryInput, setSalaryInput] = useState<string>('7000000');
  const [bonusInput, setBonusInput] = useState<string>('0');
  const [isEditingSalary, setIsEditingSalary] = useState<boolean>(false);

  // Transaction Modal State
  const [selectedJarForTx, setSelectedJarForTx] = useState<FinanceJar | null>(null);
  const [txType, setTxType] = useState<'IN' | 'OUT'>('IN');
  const [txAmount, setTxAmount] = useState<string>('');
  const [txDescription, setTxDescription] = useState<string>('');
  const [isSubmittingTx, setIsSubmittingTx] = useState<boolean>(false);

  // Create / Edit Jar Modal State
  const [isJarModalOpen, setIsJarModalOpen] = useState<boolean>(false);
  const [editingJar, setEditingJar] = useState<FinanceJar | null>(null);
  const [jarName, setJarName] = useState<string>('');
  const [jarPercentage, setJarPercentage] = useState<string>('10');
  const [jarColor, setJarColor] = useState<string>('#10b981');
  const [jarIcon, setJarIcon] = useState<string>('PiggyBank');

  // Jar Notebook Modal State
  const [selectedJarForNotes, setSelectedJarForNotes] = useState<FinanceJar | null>(null);
  const [jarNotes, setJarNotes] = useState<FinanceNote[]>([]);
  const [newNoteContent, setNewNoteContent] = useState<string>('');
  const [isLoadingNotes, setIsLoadingNotes] = useState<boolean>(false);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
  };

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const [incomeRes, jarsRes, txRes] = await Promise.all([
        fetch('/api/finance/income'),
        fetch('/api/finance/jars'),
        fetch('/api/finance/transactions'),
      ]);

      const incomeData = await incomeRes.json();
      const jarsData = await jarsRes.json();
      const txData = await txRes.json();

      if (incomeData.success && incomeData.data) {
        setIncome(incomeData.data);
        setSalaryInput(incomeData.data.monthlySalary.toString());
        setBonusInput(incomeData.data.bonusIncome.toString());
      }
      if (jarsData.success && jarsData.data) {
        setJars(jarsData.data);
      }
      if (txData.success && txData.data) {
        setTransactions(txData.data);
      }
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const fetchJarNotes = async (jarId: string) => {
    setIsLoadingNotes(true);
    try {
      const res = await fetch(`/api/finance/notes?jarId=${jarId}`);
      const data = await res.json();
      if (data.success) {
        setJarNotes(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingNotes(false);
    }
  };

  const handleOpenNotes = (jar: FinanceJar) => {
    setSelectedJarForNotes(jar);
    fetchJarNotes(jar.id);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJarForNotes || !newNoteContent.trim()) return;

    try {
      const res = await fetch('/api/finance/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jarId: selectedJarForNotes.id,
          content: newNoteContent.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewNoteContent('');
        fetchJarNotes(selectedJarForNotes.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm('Bạn có chắc muốn xóa ghi chú này?')) return;
    try {
      await fetch(`/api/finance/notes?id=${noteId}`, { method: 'DELETE' });
      if (selectedJarForNotes) {
        fetchJarNotes(selectedJarForNotes.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateIncome = async () => {
    try {
      const salary = parseFloat(salaryInput) || 0;
      const bonus = parseFloat(bonusInput) || 0;

      const res = await fetch('/api/finance/income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          monthYear: new Date().toISOString().slice(0, 7),
          monthlySalary: salary,
          bonusIncome: bonus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIncome(data.data);
        setIsEditingSalary(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveJar = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJar) {
        await fetch('/api/finance/jars', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            singleJar: {
              id: editingJar.id,
              name: jarName,
              percentage: parseFloat(jarPercentage),
              color: jarColor,
              icon: jarIcon,
            },
          }),
        });
      } else {
        await fetch('/api/finance/jars', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: jarName,
            percentage: parseFloat(jarPercentage),
            color: jarColor,
            icon: jarIcon,
            currentBalance: 0,
          }),
        });
      }
      setIsJarModalOpen(false);
      fetchFinanceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteJar = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa Hũ tài chính "${name}" không?`)) return;
    try {
      await fetch(`/api/finance/jars?id=${id}`, { method: 'DELETE' });
      fetchFinanceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoAllocate = async () => {
    if (!income || jars.length === 0) return;
    const totalInc = income.totalIncome;

    if (!confirm(`Bạn có chắc muốn tự động phân bổ thu nhập ${formatVND(totalInc)} vào các hũ theo tỷ lệ %?`)) {
      return;
    }

    try {
      for (const jar of jars) {
        const allocatedAmount = Math.round((totalInc * jar.percentage) / 100);
        if (allocatedAmount > 0) {
          await fetch('/api/finance/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jarId: jar.id,
              type: 'IN',
              amount: allocatedAmount,
              description: `Phân bổ lương hàng tháng (${jar.percentage}%)`,
              txDate: new Date().toISOString().slice(0, 10),
            }),
          });
        }
      }
      fetchFinanceData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJarForTx || !txAmount) return;

    setIsSubmittingTx(true);
    try {
      const res = await fetch('/api/finance/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jarId: selectedJarForTx.id,
          type: txType,
          amount: parseFloat(txAmount),
          description: txDescription || (txType === 'IN' ? 'Nạp tiền vào hũ' : 'Chi tiêu từ hũ'),
          txDate: new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedJarForTx(null);
        setTxAmount('');
        setTxDescription('');
        fetchFinanceData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const openCreateJarModal = () => {
    setEditingJar(null);
    setJarName('');
    setJarPercentage('10');
    setJarColor('#10b981');
    setJarIcon('PiggyBank');
    setIsJarModalOpen(true);
  };

  const openEditJarModal = (jar: FinanceJar) => {
    setEditingJar(jar);
    setJarName(jar.name);
    setJarPercentage(jar.percentage.toString());
    setJarColor(jar.color);
    setJarIcon(jar.icon);
    setIsJarModalOpen(true);
  };

  const totalPercentage = jars.reduce((acc, j) => acc + j.percentage, 0);
  const totalBalanceAllJars = jars.reduce((acc, j) => acc + j.currentBalance, 0);
  const totalIncomeValue = income?.totalIncome || 7000000;

  const getJarIcon = (iconName: string) => {
    switch (iconName) {
      case 'PiggyBank': return <PiggyBank className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'Plane': return <Plane className="w-6 h-6" />;
      case 'ShoppingBag': return <ShoppingBag className="w-6 h-6" />;
      default: return <Wallet className="w-6 h-6" />;
    }
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 flex">
        
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab !== 'FINANCE') {
              window.location.href = '/';
            }
          }}
          streakCount={12}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onOpenAddModal={() => { window.location.href = '/'; }}
          onOpenMotivationModal={() => { window.location.href = '/'; }}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          
          {/* Header & Back Link */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-1">
                <Link href="/" className="flex items-center gap-1 hover:underline">
                  <ChevronLeft className="w-4 h-4" /> Bảng điều khiển
                </Link>
                <span>/</span>
                <span>Module Quản lý tài chính</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
                <span>Phân Bổ Thu Nhập & Hũ Tài Chính</span>
                <span className="p-1.5 rounded-2xl bg-amber-500/20 text-amber-400 text-sm font-bold border border-amber-500/30">
                  Tùy biến 100%
                </span>
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Chi phối thu nhập linh hoạt — tự do thêm, sửa, xóa và ghi chú chi tiết cho từng Hũ tài chính
              </p>
            </div>

            {/* Quick Summary Card */}
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#131825] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold shadow-md shadow-emerald-500/20">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase">Tổng Số Dư Tất Cả Hũ</div>
                <div className="text-lg font-black text-emerald-400 tracking-tight">
                  {formatVND(totalBalanceAllJars)}
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 1: Income Salary Banner ── */}
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#111625] to-indigo-500/15 border border-amber-500/30 relative overflow-hidden shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              
              {/* Income Config Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Cấu hình thu nhập tháng {new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</span>
                </div>

                {!isEditingSalary ? (
                  <div className="flex items-baseline gap-4">
                    <div>
                      <div className="text-3xl md:text-4xl font-black text-white tracking-tight">
                        {formatVND(totalIncomeValue)}
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        Lương cố định: <strong className="text-slate-200">{formatVND(income?.monthlySalary || 7000000)}</strong> 
                        {income?.bonusIncome ? ` • Thưởng/Phụ thu: +${formatVND(income.bonusIncome)}` : ''}
                      </div>
                    </div>

                    <button
                      onClick={() => setIsEditingSalary(true)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-all border border-slate-700"
                    >
                      ✏️ Đổi mức lương
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Lương hàng tháng (VNĐ):</label>
                      <input
                        type="number"
                        value={salaryInput}
                        onChange={(e) => setSalaryInput(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">Thu nhập phụ / Thưởng (VNĐ):</label>
                      <input
                        type="number"
                        value={bonusInput}
                        onChange={(e) => setBonusInput(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-amber-500/50 text-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-4">
                      <button
                        onClick={handleUpdateIncome}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all"
                      >
                        Lưu mức lương
                      </button>
                      <button
                        onClick={() => setIsEditingSalary(false)}
                        className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons: Add Jar & Auto-Allocate */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={openCreateJarModal}
                  className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs md:text-sm shadow-lg shadow-emerald-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Thêm Hũ Mới</span>
                </button>

                {jars.length > 0 && (
                  <button
                    onClick={handleAutoAllocate}
                    className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs md:text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Phân Bổ Lương Vào Hũ</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* ── SECTION 2: Finance Jars Grid ── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span>Danh Sách Hũ Tài Chính ({jars.length})</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 font-bold border border-slate-700">
                    Đã phân bổ: {totalPercentage}%
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Bạn có thể tạo thêm hũ, ghi nhật ký/ghi chú công việc, chỉnh sửa tỷ lệ % hoặc xóa hũ
                </p>
              </div>
            </div>

            {jars.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#121724] border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                  <PiggyBank className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-200">Chưa Có Hũ Tài Chính Nào</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Dữ liệu đang để trống. Hãy bấm "Thêm Hũ Mới" để tạo hũ phân bổ tiết kiệm/đầu tư đầu tiên của bạn!
                  </p>
                </div>
                <button
                  onClick={openCreateJarModal}
                  className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo Hũ Đầu Tiên</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jars.map((jar) => {
                  const allocatedAmount = Math.round((totalIncomeValue * jar.percentage) / 100);

                  return (
                    <div
                      key={jar.id}
                      className="p-6 rounded-3xl bg-white dark:bg-[#121724] border border-slate-200 dark:border-slate-800/80 space-y-5 shadow-lg hover:border-amber-500/40 transition-all flex flex-col justify-between"
                    >
                      {/* Top Header & Actions */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
                              style={{ backgroundColor: jar.color }}
                            >
                              {getJarIcon(jar.icon)}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                                {jar.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                  {jar.percentage}% Thu nhập
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Edit / Delete Actions */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => openEditJarModal(jar)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                              title="Sửa hũ"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteJar(jar.id, jar.name)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                              title="Xóa hũ"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Balance Card */}
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#181F30] border border-slate-100 dark:border-slate-800 space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-400">
                            <span>SỐ DƯ HŨ HIỆN TẠI</span>
                            <span>Định mức: {formatVND(allocatedAmount)}/tháng</span>
                          </div>
                          <div className="text-2xl font-black tracking-tight" style={{ color: jar.color }}>
                            {formatVND(jar.currentBalance)}
                          </div>
                        </div>
                      </div>

                      {/* Jar Actions: Deposit, Spend & Notebook */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 space-y-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedJarForTx(jar);
                              setTxType('IN');
                              setTxAmount(allocatedAmount > 0 ? allocatedAmount.toString() : '');
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-emerald-500/20"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>+ Nạp Tiền</span>
                          </button>

                          <button
                            onClick={() => {
                              setSelectedJarForTx(jar);
                              setTxType('OUT');
                              setTxAmount('');
                            }}
                            className="flex-1 py-2.5 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 dark:text-rose-400 font-bold text-xs transition-all flex items-center justify-center gap-1.5 border border-rose-500/20"
                          >
                            <MinusCircle className="w-4 h-4" />
                            <span>- Chi Tiêu</span>
                          </button>
                        </div>

                        {/* Dedicated Notebook / Notes Trigger */}
                        <button
                          onClick={() => handleOpenNotes(jar)}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
                        >
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span>📝 Sổ Tay Ghi Chú & Nhật Ký Quỹ</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── SECTION 3: Transactions History Table ── */}
          <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121724] border border-slate-200 dark:border-slate-800 space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-500" />
                <span>Lịch Sử Giao Dịch Dòng Tiền Các Hũ</span>
              </h3>
              <span className="text-xs text-slate-500">Gần đây nhất</span>
            </div>

            {transactions.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                Chưa có giao dịch nạp/rút tiền nào trong tháng này
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-4">Ngày</th>
                      <th className="py-3 px-4">Hũ Tài Chính</th>
                      <th className="py-3 px-4">Loại Giao Dịch</th>
                      <th className="py-3 px-4">Nội Dung / Ghi Chú</th>
                      <th className="py-3 px-4 text-right">Số Tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-400">{tx.txDate}</td>
                        <td className="py-3 px-4 font-bold text-slate-200">
                          {tx.jar?.name || 'Hũ tài chính'}
                        </td>
                        <td className="py-3 px-4">
                          {tx.type === 'IN' ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                              + Nạp Tiền
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                              - Chi Tiêu
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-300">{tx.description}</td>
                        <td className={`py-3 px-4 text-right font-extrabold text-sm ${tx.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.type === 'IN' ? '+' : '-'}{formatVND(tx.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      {/* ── Transaction Modal (Nạp tiền / Chi tiêu) ── */}
      {selectedJarForTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#121724] border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>{txType === 'IN' ? '➕ Nạp Tiền Vào Hũ' : '➖ Ghi Nhận Chi Tiêu'}</span>
              </h3>
              <button
                onClick={() => setSelectedJarForTx(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: selectedJarForTx.color }}
              >
                {getJarIcon(selectedJarForTx.icon)}
              </div>
              <div>
                <div className="font-bold text-sm text-white">{selectedJarForTx.name}</div>
                <div className="text-xs text-slate-400">Số dư hiện tại: {formatVND(selectedJarForTx.currentBalance)}</div>
              </div>
            </div>

            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Số tiền (VNĐ):</label>
                <input
                  type="number"
                  required
                  placeholder="Ví dụ: 1000000"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-base focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Ghi chú / Lý do:</label>
                <input
                  type="text"
                  placeholder={txType === 'IN' ? 'Ví dụ: Phân bổ lương tháng 7' : 'Ví dụ: Mua cổ phiếu HPG'}
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJarForTx(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTx}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md transition-all ${
                    txType === 'IN' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'
                  }`}
                >
                  {isSubmittingTx ? 'Đang lưu...' : txType === 'IN' ? 'Xác nhận Nạp Tiền' : 'Xác nhận Chi Tiêu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Create / Edit Jar Modal ── */}
      {isJarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#121724] border border-slate-800 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
                <span>{editingJar ? '✏️ Chỉnh Sửa Hũ Tài Chính' : '➕ Thêm Hũ Tài Chính Mới'}</span>
              </h3>
              <button
                onClick={() => setIsJarModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveJar} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Tên Hũ Tài Chính:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Tích kiệm mua xe, Quỹ Học Tập..."
                  value={jarName}
                  onChange={(e) => setJarName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Tỷ Lệ Phần Trăm % (Thu nhập):</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  placeholder="Ví dụ: 15"
                  value={jarPercentage}
                  onChange={(e) => setJarPercentage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Màu Chủ Đạo:</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={jarColor}
                    onChange={(e) => setJarColor(e.target.value)}
                    className="w-12 h-10 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-400">{jarColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1">Biểu Tượng (Icon):</label>
                <select
                  value={jarIcon}
                  onChange={(e) => setJarIcon(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:outline-none focus:border-amber-500"
                >
                  <option value="PiggyBank">🐷 Heo Tiết Kiệm (PiggyBank)</option>
                  <option value="TrendingUp">📈 Đầu Tư Cổ Phiếu (TrendingUp)</option>
                  <option value="Briefcase">💼 Kinh Doanh / Khởi Nghiệp (Briefcase)</option>
                  <option value="Plane">✈️ Du Lịch & Trải Nghiệm (Plane)</option>
                  <option value="ShoppingBag">🛍️ Chi Tiêu Tự Do (ShoppingBag)</option>
                  <option value="Wallet">👛 Ví Tiền Chung (Wallet)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsJarModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-xs font-bold hover:bg-slate-700"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-all"
                >
                  {editingJar ? 'Lưu Thay Đổi' : 'Tạo Hũ Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Jar Notebook / Notes Modal ── */}
      {selectedJarForNotes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#121724] border border-slate-800 space-y-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: selectedJarForNotes.color }}
                >
                  {getJarIcon(selectedJarForNotes.icon)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Sổ Tay Ghi Chú & Nhật Ký: {selectedJarForNotes.name}
                  </h3>
                  <div className="text-xs text-slate-400">Lưu nhật ký đầu tư, mục tiêu, kế hoạch chi tiêu riêng</div>
                </div>
              </div>
              <button
                onClick={() => setSelectedJarForNotes(null)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input New Note Box */}
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                rows={3}
                required
                placeholder="Nhập ghi chú mới (Ví dụ: Đã chốt mua 500 cổ phiếu HPG giá 25k, Đã chốt phòng ks Đà Nẵng...)"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteContent.trim()}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Thêm Ghi Chú</span>
                </button>
              </div>
            </form>

            {/* Notes Timeline List */}
            <div className="flex-1 overflow-y-auto space-y-3 pt-2 pr-1">
              {isLoadingNotes ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">Đang tải ghi chú...</div>
              ) : jarNotes.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic">
                  Chưa có ghi chú nào cho hũ này. Hãy viết ghi chú đầu tiên ở trên!
                </div>
              ) : (
                jarNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 relative group hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(note.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-slate-500 hover:text-rose-400 p-1 opacity-80 group-hover:opacity-100 transition-opacity"
                        title="Xóa ghi chú"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
