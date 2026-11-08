import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HelpCircle, CheckCircle2, XCircle, ArrowRight, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizPage: React.FC = () => {
  const { user, quizzes, answerQuiz, settings, transactions } = useApp();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [result, setResult] = useState<{
    submitted: boolean;
    isCorrect: boolean;
    reward: number;
    explanation: string;
  } | null>(null);

  // Today's quiz earnings
  const quizTransactions = transactions.filter((t) => t.category === 'quiz');
  const todayEarned = quizTransactions.reduce((acc, t) => acc + t.amount, 0);
  const totalQuestions = quizzes.length;
  const questionsCompleted = quizTransactions.length;
  const remainingQuestions = Math.max(0, totalQuestions - currentIndex);

  const currentQuiz = quizzes[currentIndex];

  const handleSubmit = () => {
    if (selectedOption === null || !currentQuiz || result?.submitted) return;

    const res = answerQuiz(currentQuiz.id, selectedOption);
    setResult({
      submitted: true,
      isCorrect: res.isCorrect,
      reward: res.reward,
      explanation: res.explanation,
    });

    if (res.isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 55,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setResult(null);
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Loop back or complete
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-5">
      {/* 1. Header (matching reference layout) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Answer quiz questions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              New questions every day. Correct answers get paid, wrong answers don't.
            </p>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${
              user?.membershipStatus === 'premium'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user?.membershipStatus === 'premium' ? 'Premium member' : 'Unactivated user'}
          </span>
        </div>

        {/* Today's earnings card */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Today's earnings
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-900">₦{todayEarned.toLocaleString()}</span>
                <span className="text-xs text-slate-400 font-semibold">
                  / ₦{(totalQuestions * settings.quizReward).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Questions remaining
              </span>
              <p className="text-sm font-bold text-slate-700">{remainingQuestions}</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-slate-200/80 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0056FD] h-full rounded-full transition-all duration-500"
              style={{
                width: `${totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0}%`,
              }}
            />
          </div>

          {/* Pills breakdown */}
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-xl border border-slate-200/60">
              <p className="text-[9px] text-slate-400">Click & Earn</p>
              <p className="font-bold text-slate-700 text-xs">₦4,000</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-200/60">
              <p className="text-[9px] text-slate-400">Watch & Earn</p>
              <p className="font-bold text-slate-700 text-xs">₦10,000</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-orange-200 text-orange-600">
              <p className="text-[9px] text-orange-500">Questions</p>
              <p className="font-bold text-xs">₦{(totalQuestions * settings.quizReward).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Navy Banner: "QUIZ & EARN - Answer right, get paid" */}
      <div className="bg-[#0B192C] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
          QUIZ & EARN
        </span>
        <h2 className="text-2xl font-extrabold text-white mt-1">Answer right, get paid</h2>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
          <span>Today's progress</span>
          <span className="font-bold text-white">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>
        <div className="mt-2 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-[#0056FD] h-full rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* 3. Question Card */}
      {currentQuiz ? (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQuiz.question}
            </h3>
            <span className="text-xs font-black bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full shrink-0">
              ₦{currentQuiz.reward.toLocaleString()}
            </span>
          </div>

          {/* Options A, B, C, D */}
          <div className="space-y-2.5">
            {currentQuiz.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedOption === idx;

              let optionStyle = 'border-slate-200 hover:border-slate-300 bg-white text-slate-800';
              if (isSelected && !result?.submitted) {
                optionStyle = 'border-[#0056FD] bg-blue-50/50 text-[#0056FD] font-semibold';
              } else if (result?.submitted) {
                if (idx === currentQuiz.correctIndex) {
                  optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold';
                } else if (isSelected && !result.isCorrect) {
                  optionStyle = 'border-rose-400 bg-rose-50 text-rose-700 font-medium';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={result?.submitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isSelected
                          ? 'bg-[#0056FD] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="text-sm font-medium">{opt}</span>
                  </div>

                  {result?.submitted && idx === currentQuiz.correctIndex && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {result?.submitted && isSelected && !result.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Result Alert / Feedback */}
          {result && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-200 ${
                result.isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-1 text-sm">
                {result.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Correct! ₦{result.reward.toLocaleString()} Credited</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Incorrect Answer (₦0 Credited)</span>
                  </>
                )}
              </div>
              <p className="text-slate-600 mt-1">{result.explanation}</p>
            </div>
          )}

          {/* Action Button: Submit or Next Question */}
          <div className="pt-2">
            {!result ? (
              <button
                onClick={handleSubmit}
                disabled={selectedOption === null}
                className={`w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-xs transition-transform active:scale-98 ${
                  selectedOption !== null
                    ? 'bg-[#0056FD] hover:bg-[#0047D4]'
                    : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                Submit answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <span>{currentIndex < quizzes.length - 1 ? 'Next Question' : 'Restart Quiz Rotation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-8 text-center border border-slate-100">
          <p className="text-sm text-slate-500">No questions available currently.</p>
        </div>
      )}

      {/* Sub-note matching reference screenshot */}
      <p className="text-center text-xs text-slate-400">
        Activate your MOVA account to unlock all daily questions and verified bank withdrawals.
      </p>
    </div>
  );
};
