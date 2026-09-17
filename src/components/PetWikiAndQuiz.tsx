import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Coins,
  Sparkles,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  Lightbulb,
  RotateCcw,
  Dog,
  Fish,
  ShieldAlert,
  Share2,
} from 'lucide-react';
import { WikiArticle, QuizQuestion } from '../types';

interface PetWikiAndQuizProps {
  wikiArticles: WikiArticle[];
  quizQuestions: QuizQuestion[];
  petCoins: number;
  onAddCoins: (amount: number) => void;
  onNavigateToShop: () => void;
}

export const PetWikiAndQuiz: React.FC<PetWikiAndQuizProps> = ({
  wikiArticles,
  quizQuestions,
  petCoins,
  onAddCoins,
  onNavigateToShop,
}) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'wiki'>('quiz');

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [earnedCoinsSession, setEarnedCoinsSession] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [claimedReward, setClaimedReward] = useState(false);

  // Wiki Filter State
  const [wikiCategory, setWikiCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<WikiArticle | null>(wikiArticles[0]);

  const currentQ = quizQuestions[currentQuestionIndex];

  const funFacts = [
    {
      emoji: '👃',
      title: 'Unique Dog Nose Prints',
      desc: 'Just like human fingerprints, every single dog has an entirely unique nose leather pattern with distinct ridges and crevices.',
    },
    {
      emoji: '🐱',
      title: 'Feline Sleep Cycles',
      desc: 'Cats spend an average of 70% of their entire lifetimes asleep (roughly 13-16 hours per day) to recharge predatory alertness.',
    },
    {
      emoji: '🐕',
      title: 'Canine Time Sense',
      desc: 'Dogs have a sense of time based on circadian rhythms, light patterns, and scent degradation (e.g. smelling how faint their human’s morning scent has become).',
    },
    {
      emoji: '🦜',
      title: 'Avian Intelligence',
      desc: 'African Grey parrots have cognitive reasoning equivalent to a 5-year-old human child, understanding concepts of zero and shapes.',
    },
  ];

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIndex(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setIsAnswerSubmitted(true);

    if (selectedAnswerIndex === currentQ.correctIndex) {
      setEarnedCoinsSession((prev) => prev + currentQ.coinsReward);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswerIndex(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleClaimCoins = () => {
    if (earnedCoinsSession > 0 && !claimedReward) {
      onAddCoins(earnedCoinsSession);
      setClaimedReward(true);
    }
  };

  const handleResetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswerIndex(null);
    setIsAnswerSubmitted(false);
    setEarnedCoinsSession(0);
    setQuizCompleted(false);
    setClaimedReward(false);
  };

  const filteredWiki = wikiArticles.filter(
    (w) => wikiCategory === 'All' || w.category === wikiCategory
  );

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-stone-950 rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-black/10 px-3 py-1 rounded-full text-xs font-bold">
              <Coins className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
              <span>Learn & Earn Real Shopping Discounts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Pet Wiki, Fun Facts & Interactive Quiz
            </h1>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
              Deepen your pet care knowledge, discover surprising animal trivia, and complete the daily 5-question trivia quiz to <strong className="text-stone-950">earn PetCoins</strong> that give you instant cash discounts at the Petwrld shop!
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-md border border-amber-200 text-center shrink-0 w-full md:w-auto">
            <div className="text-[10px] uppercase font-bold text-stone-400">Your PetCoins Balance</div>
            <div className="text-3xl font-black text-amber-600 flex items-center justify-center gap-1.5 mt-0.5">
              <Coins className="w-6 h-6 fill-amber-500 text-amber-500" />
              <span>{petCoins}</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              Worth ₹{(petCoins * 5).toLocaleString('en-IN')} OFF at checkout
            </p>
          </div>
        </div>
      </div>

      {/* Daily Fun Facts Carousel */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Did You Know? (Daily Pet Fun Facts)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {funFacts.map((fact, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs space-y-1.5"
            >
              <div className="text-2xl">{fact.emoji}</div>
              <div className="text-xs font-bold text-stone-900">{fact.title}</div>
              <p className="text-[11px] text-stone-600 leading-relaxed">{fact.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Switcher */}
      <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200 shadow-xs">
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'quiz'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Interactive Quiz (Win Coins 🪙)</span>
        </button>

        <button
          onClick={() => setActiveTab('wiki')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'wiki'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Pet Wiki & Care Encyclopedia</span>
        </button>
      </div>

      {/* 1. QUIZ VIEW */}
      {activeTab === 'quiz' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {!quizCompleted ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Progress & Reward Banner */}
              <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {quizQuestions.length}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>+{currentQ.coinsReward} Coins if Correct</span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                {currentQ.question}
              </h2>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, i) => {
                  let style = 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800';
                  if (selectedAnswerIndex === i) {
                    style = 'border-amber-500 bg-amber-50 text-amber-950 font-bold ring-1 ring-amber-500';
                  }
                  if (isAnswerSubmitted) {
                    if (i === currentQ.correctIndex) {
                      style = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-500';
                    } else if (selectedAnswerIndex === i) {
                      style = 'border-rose-500 bg-rose-50 text-rose-950 font-medium';
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectOption(i)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && i === currentQ.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedAnswerIndex === i && i !== currentQ.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon answer submission */}
              {isAnswerSubmitted && (
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1 animate-in fade-in">
                  <div className="font-bold text-stone-900">Veterinary Explanation:</div>
                  <p className="text-stone-600 leading-relaxed">{currentQ.explanation}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex justify-between items-center">
                <span className="text-xs text-stone-500">
                  Earned this round:{' '}
                  <strong className="text-amber-800 font-bold">+{earnedCoinsSession} 🪙</strong>
                </span>

                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedAnswerIndex === null}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="inline-flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-xs"
                  >
                    <span>
                      {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Quiz Completed View */
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-5 shadow-sm">
              <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-stone-900">Quiz Completed!</h3>
                <p className="text-xs text-stone-500 mt-1">
                  You tested your pet knowledge and scored great rewards!
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 max-w-sm mx-auto space-y-2">
                <div className="text-[10px] uppercase font-bold text-amber-800">
                  Total PetCoins Won
                </div>
                <div className="text-4xl font-black text-amber-600 flex items-center justify-center gap-2">
                  <Coins className="w-8 h-8 fill-amber-500 text-amber-500" />
                  <span>+{earnedCoinsSession}</span>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Equivalent to ₹{(earnedCoinsSession * 5).toLocaleString('en-IN')} instant discount at checkout!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {!claimedReward ? (
                  <button
                    onClick={handleClaimCoins}
                    className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-6 py-3 rounded-xl transition-colors shadow-md shadow-amber-600/20"
                  >
                    Claim & Add to My Wallet
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-xl">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Coins successfully credited to your PetCoins balance!</span>
                  </div>
                )}

                <button
                  onClick={onNavigateToShop}
                  className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-colors"
                >
                  Spend Coins in Shop →
                </button>

                <button
                  onClick={handleResetQuiz}
                  className="w-full sm:w-auto text-xs text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1 px-3 py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. WIKI ENCYCLOPEDIA VIEW */}
      {activeTab === 'wiki' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Article List / Categories */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Breeds', 'Emergency', 'Nutrition'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setWikiCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    wikiCategory === cat
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredWiki.map((art) => (
                <button
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    activeArticle?.id === art.id
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-amber-700">
                    {art.category}
                  </span>
                  <h3 className="font-bold text-xs text-stone-900 mt-0.5">{art.title}</h3>
                  <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">{art.summary}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Article Reader */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
            {activeArticle ? (
              <>
                <div className="space-y-2">
                  <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                    {activeArticle.category} Article
                  </span>
                  <h2 className="text-xl font-black text-stone-900">{activeArticle.title}</h2>
                  <p className="text-xs text-stone-500 leading-relaxed">{activeArticle.summary}</p>
                </div>

                <div className="space-y-3 text-xs text-stone-700 leading-relaxed">
                  {activeArticle.content.map((p, i) => (
                    <p key={i} className="bg-stone-50 p-3 rounded-xl border border-stone-100">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Fun fact highlight box */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Fun Fact from the Petwrld Encyclopedia:</span>
                  </div>
                  <p className="text-amber-800 leading-relaxed font-medium">
                    {activeArticle.funFact}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-xs text-stone-400">Select an article from the left to read.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
