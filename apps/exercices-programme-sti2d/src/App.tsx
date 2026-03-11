import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Zap, 
  Cpu, 
  Settings, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw,
  GraduationCap,
  Activity
} from 'lucide-react';
import { generateExercise } from './services/gemini';
import { Exercise, Subject } from './types';

const SUBJECTS: { id: Subject; label: string; icon: any; color: string }[] = [
  { id: '2I2D', label: '2I2D (Tronc Commun)', icon: GraduationCap, color: 'border-slate-500' },
  { id: 'AC', label: 'Arch. & Construction', icon: BookOpen, color: 'border-emerald-500' },
  { id: 'EE', label: 'Énergie & Envir.', icon: Zap, color: 'border-amber-500' },
  { id: 'ITEC', label: 'Innov. Tech. & Eco-conception', icon: Settings, color: 'border-blue-500' },
  { id: 'SIN', label: 'Syst. Info. & Numérique', icon: Cpu, color: 'border-purple-500' },
];

export default function App() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Moyen');
  const [questionCount, setQuestionCount] = useState(5);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleGenerate = async () => {
    if (!selectedSubject || !topic) return;
    setLoading(true);
    setErrorMessage('');
    setExercise(null);
    setUserAnswers({});
    setShowResults(false);
    try {
      const data = await generateExercise(selectedSubject, topic, difficulty, questionCount);
      setExercise(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erreur lors de la generation";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, index: number) => {
    if (showResults) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: index }));
  };

  const calculateScore = () => {
    if (!exercise) return 0;
    let score = 0;
    exercise.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fffdf8_0%,_#f3eee4_42%,_#e6eced_100%)] text-[#1e2930] font-sans selection:bg-[#1f4d57] selection:text-[#f8f4ec]">
      {/* Header Grid */}
      <header className="border-b border-[#1f4d57]/15 bg-white/60 backdrop-blur-sm p-6 grid grid-cols-1 md:grid-cols-2 items-center shadow-[0_10px_40px_rgba(31,77,87,0.06)]">
        <div>
          <span className="inline-flex items-center rounded-full border border-[#1f4d57]/15 bg-[#f8f4ec] px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-[#1f4d57]">Plateforme d'entrainement</span>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#12343b] font-serif">Entrainement STI2D</h1>
          <p className="text-xs uppercase tracking-widest text-[#52636a] mt-2 font-mono">Generation rapide d'exercices techniques</p>
        </div>
        <div className="flex justify-end gap-4 mt-4 md:mt-0">
          <div className="flex flex-col items-end rounded-2xl border border-[#1f4d57]/12 bg-white/70 px-4 py-3 shadow-sm">
            <span className="text-[10px] uppercase font-mono text-[#52636a]">Statut Systeme</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#28b07a] rounded-full animate-pulse" />
              <span className="text-xs font-mono text-[#12343b]">OPERATIONNEL</span>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-100px)] gap-6 p-4 md:p-6">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 rounded-[28px] border border-white/70 bg-white/72 p-6 space-y-8 shadow-[0_18px_60px_rgba(18,52,59,0.08)] backdrop-blur-sm">
          <section>
            <h2 className="text-[11px] font-serif italic uppercase text-[#6b7b81] mb-4 tracking-wider">01. Selection de la specialite</h2>
            <div className="space-y-2">
              {SUBJECTS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSubject(s.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${
                    selectedSubject === s.id 
                      ? 'bg-[#12343b] text-[#f8f4ec] border-[#12343b] shadow-[0_12px_30px_rgba(18,52,59,0.18)]' 
                      : 'bg-[#fcfaf5] border-[#d8dfdf] hover:border-[#6f9594] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <s.icon size={18} />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  <ChevronRight size={14} className={selectedSubject === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'} />
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-[11px] font-serif italic uppercase text-[#6b7b81] mb-4 tracking-wider">02. Parametres de l'exercice</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-mono block mb-1">Thème / Chapitre</label>
                <input 
                  type="text" 
                  placeholder="ex: Loi d'Ohm, Diagramme SysML..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-2xl bg-[#fffdfa] border border-[#cfd8d7] px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#7aa6a2]"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono block mb-1">Niveau de Difficulté</label>
                <div className="grid grid-cols-3 rounded-2xl border border-[#cfd8d7] overflow-hidden bg-[#fffdfa]">
                  {['Facile', 'Moyen', 'Difficile'].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`p-2 text-[10px] uppercase font-mono transition-colors ${
                        difficulty === d ? 'bg-[#1f4d57] text-[#f8f4ec]' : 'text-[#33454b] hover:bg-[#eef4f3]'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] uppercase font-mono block mb-1">Nombre de Questions</label>
                <div className="grid grid-cols-2 rounded-2xl border border-[#cfd8d7] overflow-hidden bg-[#fffdfa]">
                  {[5, 10].map(n => (
                    <button
                      key={n}
                      onClick={() => setQuestionCount(n)}
                      className={`p-2 text-[10px] uppercase font-mono transition-colors ${
                        questionCount === n ? 'bg-[#1f4d57] text-[#f8f4ec]' : 'text-[#33454b] hover:bg-[#eef4f3]'
                      }`}
                    >
                      {n} Questions
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading || !selectedSubject || !topic}
                className="w-full rounded-2xl bg-[#c96f4a] text-[#fffaf5] py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#b75f3b] disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_16px_35px_rgba(201,111,74,0.28)]"
              >
                {loading ? <RefreshCcw className="animate-spin" size={18} /> : 'Générer Exercice'}
              </button>
            </div>
          </section>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-9 rounded-[32px] border border-white/70 bg-white/62 p-6 overflow-y-auto shadow-[0_18px_60px_rgba(18,52,59,0.08)] backdrop-blur-sm">
          <AnimatePresence mode="wait">
            {!exercise && !loading && !!errorMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-xl mx-auto rounded-2xl border border-red-600/20 bg-red-50 text-red-800 p-4 shadow-sm"
              >
                <p className="text-[10px] uppercase font-mono tracking-wider mb-1">Erreur de generation</p>
                <p className="text-sm">{errorMessage}</p>
              </motion.div>
            )}

            {!exercise && !loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center space-y-4 text-[#567078]"
              >
                <div className="rounded-full bg-[#eef4f3] p-6 shadow-inner">
                  <Activity size={64} strokeWidth={1.25} />
                </div>
                <p className="font-serif italic text-xl text-[#2e4850]">Choisis une specialite et un theme pour commencer.</p>
              </motion.div>
            )}

            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center space-y-6"
              >
                <div className="w-48 h-1 rounded-full bg-[#1f4d57]/10 overflow-hidden">
                  <motion.div 
                    className="h-full bg-[#c96f4a]"
                    animate={{ x: [-200, 200] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  />
                </div>
                <p className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#52636a]">Calcul des parametres pedagogiques...</p>
              </motion.div>
            )}

            {exercise && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto space-y-12 pb-20"
              >
                <div className="border-b-2 border-[#1f4d57]/25 pb-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#6b7b81]">{exercise.subject} / {exercise.difficulty}</span>
                      <h2 className="text-4xl font-bold tracking-tight text-[#12343b]">{exercise.title}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono uppercase text-[#6b7b81]">Theme</span>
                      <p className="font-serif italic">{exercise.topic}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  {exercise.questions.map((q, qIdx) => (
                    <div key={q.id} className="space-y-4">
                      <div className="flex gap-4">
                        <span className="font-mono text-2xl opacity-20">0{qIdx + 1}</span>
                        <p className="text-lg font-medium leading-tight">{q.text}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-12">
                        {q.options.map((option, oIdx) => {
                          const isSelected = userAnswers[q.id] === oIdx;
                          const isCorrect = q.correctAnswer === oIdx;
                          
                          let cardClass = "p-4 rounded-2xl border border-[#d6dfde] bg-[#fffdfa] text-sm transition-all text-left shadow-sm ";
                          if (showResults) {
                            if (isCorrect) cardClass += "bg-emerald-500/10 border-emerald-500 text-emerald-700 ";
                            else if (isSelected) cardClass += "bg-red-500/10 border-red-500 text-red-700 ";
                            else cardClass += "opacity-40 ";
                          } else {
                            cardClass += isSelected ? "bg-[#12343b] text-[#f8f4ec] border-[#12343b] shadow-[0_12px_28px_rgba(18,52,59,0.16)] " : "hover:border-[#7aa6a2] hover:bg-white ";
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleAnswer(q.id, oIdx)}
                              className={cardClass}
                            >
                              <div className="flex items-center justify-between">
                                <span>{option}</span>
                                {showResults && isCorrect && <CheckCircle2 size={16} />}
                                {showResults && isSelected && !isCorrect && <XCircle size={16} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                      {showResults && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="pl-12"
                        >
                          <div className="rounded-r-2xl bg-[#eef4f3] p-4 border-l-2 border-[#1f4d57] text-xs text-[#274148]">
                            <span className="font-bold uppercase block mb-1">Explication technique :</span>
                            {q.explanation}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>

                {!showResults ? (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(userAnswers).length < exercise.questions.length}
                    className="w-full rounded-2xl border-2 border-[#1f4d57] py-4 text-sm font-bold uppercase tracking-widest text-[#1f4d57] hover:bg-[#1f4d57] hover:text-[#f8f4ec] transition-all disabled:opacity-20"
                  >
                    Valider mes réponses
                  </button>
                ) : (
                  <div className="rounded-[28px] bg-[#12343b] text-[#f8f4ec] p-8 text-center space-y-4 shadow-[0_20px_50px_rgba(18,52,59,0.22)]">
                    <h3 className="text-[10px] uppercase font-mono tracking-[0.4em]">Résultats de la Session</h3>
                    <div className="text-6xl font-bold font-serif italic">
                      {calculateScore()} / {exercise.questions.length}
                    </div>
                    <p className="text-sm opacity-60">
                      {calculateScore() === exercise.questions.length 
                        ? "Maîtrise parfaite des concepts techniques." 
                        : "Certains points nécessitent une révision approfondie."}
                    </p>
                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 rounded-full text-[10px] uppercase font-mono border border-[#f8f4ec]/30 px-4 py-2 hover:bg-[#f8f4ec] hover:text-[#12343b] transition-all"
                    >
                      <RefreshCcw size={12} /> Nouvel Exercice
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
