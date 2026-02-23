import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, CheckCircle, RefreshCw, Zap, Settings, Lightbulb, Eye, EyeOff, Shuffle, Trophy, Sparkles, Loader, X } from 'lucide-react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// --- Types et Données ---

type FunctionType = 'info' | 'energy';
type BlockId = 'acquerir' | 'traiter' | 'communiquer' | 'alimenter' | 'distribuer' | 'convertir' | 'transmettre';

interface BlockDefinition {
  id: BlockId;
  label: string;
  type: FunctionType;
  description: string;
}

interface ComponentItem {
  id: string;
  name: string;
  targetBlock: BlockId;
  icon?: any;
}

interface Scenario {
  id: string;
  title: string;
  instruction: string;
  showLabelsByDefault: boolean;
  items: ComponentItem[];
  isGenerated?: boolean;
}

const BLOCKS: BlockDefinition[] = [
  // Chaîne d'information
  { id: 'acquerir', label: 'Acquérir', type: 'info', description: 'Récupérer les informations (grandeurs physiques) de l\'extérieur.' },
  { id: 'traiter', label: 'Traiter', type: 'info', description: 'Analyser les informations et décider des ordres à donner.' },
  { id: 'communiquer', label: 'Communiquer', type: 'info', description: 'Transmettre les ordres à la chaîne d\'énergie ou à l\'utilisateur.' },
  // Chaîne d'énergie
  { id: 'alimenter', label: 'Alimenter', type: 'energy', description: 'Apporter l\'énergie nécessaire au système.' },
  { id: 'distribuer', label: 'Distribuer', type: 'energy', description: 'Diriger l\'énergie vers les convertisseurs sur ordre de la partie commande.' },
  { id: 'convertir', label: 'Convertir', type: 'energy', description: 'Transformer l\'énergie (souvent électrique en mécanique).' },
  { id: 'transmettre', label: 'Transmettre', type: 'energy', description: 'Transporter l\'action mécanique jusqu\'à l\'effecteur.' },
];

const INITIAL_SCENARIOS: Scenario[] = [
  {
    id: 'abstract',
    title: 'Mode Théorique',
    instruction: 'Placez les fonctions au bon endroit pour reconstituer la chaîne standard.',
    showLabelsByDefault: true,
    items: BLOCKS.map(b => ({ id: b.id, name: b.label, targetBlock: b.id }))
  },
  {
    id: 'store_banne',
    title: 'Store Banne Auto',
    instruction: 'Associez les composants du store aux fonctions correspondantes.',
    showLabelsByDefault: false,
    items: [
      { id: 'c1', name: 'Anémomètre (Capteur)', targetBlock: 'acquerir' },
      { id: 'c2', name: 'Carte électronique', targetBlock: 'traiter' },
      { id: 'c3', name: 'Fils élec. / Bluetooth', targetBlock: 'communiquer' },
      { id: 'c4', name: 'Réseau EDF 230V', targetBlock: 'alimenter' },
      { id: 'c5', name: 'Relais / Contacteur', targetBlock: 'distribuer' },
      { id: 'c6', name: 'Moteur Électrique', targetBlock: 'convertir' },
      { id: 'c7', name: 'Bras articulés', targetBlock: 'transmettre' },
    ]
  },
  {
    id: 'ventilateur',
    title: 'Ventilateur Intelligent',
    instruction: 'Où vont les composants de ce ventilateur qui s\'allume s\'il fait chaud ?',
    showLabelsByDefault: false,
    items: [
      { id: 'v1', name: 'Sonde de température', targetBlock: 'acquerir' },
      { id: 'v2', name: 'Microcontrôleur', targetBlock: 'traiter' },
      { id: 'v3', name: 'Liaison filaire', targetBlock: 'communiquer' },
      { id: 'v4', name: 'Prise secteur / Pile', targetBlock: 'alimenter' },
      { id: 'v5', name: 'Transistor / Interrupteur', targetBlock: 'distribuer' },
      { id: 'v6', name: 'Moteur CC', targetBlock: 'convertir' },
      { id: 'v7', name: 'Hélice (axe)', targetBlock: 'transmettre' },
    ]
  }
];

// Fonction de mélange de Fisher-Yates
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// --- Composants UI ---

const ChainBox = ({ 
  definition, 
  content, 
  isCorrect, 
  isWrong,
  onClick,
  isSelected,
  showHint
}: { 
  definition: BlockDefinition, 
  content: ComponentItem | null, 
  isCorrect: boolean,
  isWrong: boolean,
  onClick: () => void,
  isSelected: boolean,
  showHint: boolean
}) => {
  const bgColors = definition.type === 'info' 
    ? (isCorrect ? 'bg-blue-100 border-blue-500' : 'bg-blue-50 border-blue-300')
    : (isCorrect ? 'bg-orange-100 border-orange-500' : 'bg-orange-50 border-orange-300');

  const statusColor = isCorrect ? 'bg-green-500 text-white' : (isWrong ? 'bg-red-500 text-white' : 'bg-white');

  return (
    <div 
      onClick={onClick}
      className={`
        relative flex flex-col items-center justify-center p-2 rounded-lg border-2 shadow-sm transition-all cursor-pointer h-32 w-full
        ${bgColors}
        ${isSelected ? 'ring-4 ring-indigo-400 scale-105 z-10' : 'hover:shadow-md'}
      `}
    >
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 absolute top-1 left-2">
        {definition.label}
      </span>
      
      {content ? (
        <div className={`
          ${statusColor} px-3 py-2 rounded shadow text-center text-sm font-semibold w-full z-10 animate-fadeIn break-words
        `}>
          {content.name}
        </div>
      ) : (
        <div className={`
          text-center p-2 rounded w-full h-full flex items-center justify-center transition-opacity duration-300
          ${showHint ? 'opacity-100' : 'opacity-20 hover:opacity-50'}
        `}>
           {showHint ? (
             <span className="text-gray-400 text-sm italic font-medium uppercase border-dashed border-b border-gray-300">{definition.label}</span>
           ) : (
             <span className="text-3xl font-bold text-slate-200">?</span>
           )}
        </div>
      )}

      {/* Petit indicateur de validation */}
      {isCorrect && <CheckCircle className="absolute -top-2 -right-2 w-6 h-6 text-green-600 bg-white rounded-full shadow-sm z-20" />}
    </div>
  );
};

export default function EnergyChainApp() {
  const [scenarios, setScenarios] = useState<Scenario[]>(INITIAL_SCENARIOS);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [placements, setPlacements] = useState<Record<BlockId, ComponentItem | null>>({
    acquerir: null, traiter: null, communiquer: null,
    alimenter: null, distribuer: null, convertir: null, transmettre: null
  });
  const [selectedItem, setSelectedItem] = useState<ComponentItem | null>(null);
  const [validated, setValidated] = useState(false);
  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState(false);
  
  // États IA
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [generatorPrompt, setGeneratorPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const [currentItems, setCurrentItems] = useState<ComponentItem[]>([]);

  const AI_PROXY_URL = "http://localhost:8787/api/generate-scenario";

  // Scroll to top when scenario changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scenarioIndex]);

  const currentScenario = scenarios[scenarioIndex];
  
  useEffect(() => {
    handleReset();
    setCurrentItems(shuffleArray(scenarios[scenarioIndex].items));
    setShowHints(scenarios[scenarioIndex].showLabelsByDefault);
  }, [scenarioIndex, scenarios]);

  const handleReset = () => {
    setPlacements({
      acquerir: null, traiter: null, communiquer: null,
      alimenter: null, distribuer: null, convertir: null, transmettre: null
    });
    setSelectedItem(null);
    setValidated(false);
    setScore(0);
    setCurrentItems(shuffleArray(scenarios[scenarioIndex].items));
  };

  const handleBoxClick = (blockId: BlockId) => {
    if (validated) return;
    if (selectedItem) {
      setPlacements(prev => ({ ...prev, [blockId]: selectedItem }));
      setSelectedItem(null);
    } else if (placements[blockId]) {
      setPlacements(prev => ({ ...prev, [blockId]: null }));
    }
  };

  const handleValidate = () => {
    let newScore = 0;
    Object.entries(placements).forEach(([blockId, item]) => {
      if (item && item.targetBlock === blockId) {
        newScore++;
      }
    });
    setScore(newScore);
    setValidated(true);
  };

  // --- LOGIQUE IA VIA PROXY LOCAL ---
  const generateScenario = async () => {
    if (!generatorPrompt.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch(AI_PROXY_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatorPrompt,
        }),
      });

      const generatedData = await response.json();
      if (!response.ok || generatedData.error) {
        throw new Error(generatedData.error || `Erreur générateur (${response.status})`);
      }

      // Validation basique et ajout des IDs
      const newItems = generatedData.items.map((item: any, idx: number) => ({
        id: `gen_${Date.now()}_${idx}`,
        name: item.name,
        targetBlock: item.targetBlock
      }));

      const newScenario: Scenario = {
        id: `gen_${Date.now()}`,
        title: generatedData.title,
        instruction: generatedData.instruction,
        showLabelsByDefault: false,
        items: newItems,
        isGenerated: true
      };

      setScenarios(prev => [...prev, newScenario]);
      setScenarioIndex(scenarios.length); // Basculer vers le nouveau scénario
      setIsGeneratorOpen(false);
      setGeneratorPrompt("");

    } catch (err) {
      console.error("Erreur générateur local:", err);
      setGenerationError("Désolé, je n'ai pas pu générer ce scénario. Vérifiez que le générateur Copilot local est démarré.");
    } finally {
      setIsGenerating(false);
    }
  };

  const availableItems = currentItems.filter(item => {
    return !Object.values(placements).some(placed => placed?.id === item.id);
  });

  const isComplete = availableItems.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 p-2 md:p-6 font-sans text-slate-800 flex flex-col relative">
      
      

      <div className="max-w-6xl mx-auto w-full space-y-4 md:space-y-6 flex-grow">
        
        {/* Header */}
        <header className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col xl:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700">
               <Settings className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-800">
                Chaîne d'Information & d'Énergie
              </h1>
              <p className="text-sm text-slate-500 hidden md:block">
                Reconstituez la chaîne fonctionnelle du système technique.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center justify-center bg-slate-50 p-2 rounded-xl border border-slate-100 w-full xl:w-auto">
             {scenarios.map((s, idx) => (
               <button
                 key={s.id}
                 onClick={() => setScenarioIndex(idx)}
                 className={`
                   px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1
                   ${scenarioIndex === idx 
                     ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' 
                     : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'}
                 `}
               >
                 {s.isGenerated && <Sparkles size={12} className="text-purple-500" />}
                 {s.title.includes(':') ? s.title.split(':')[0] : s.title}
               </button>
             ))}
             
             <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block"></div>

             <button 
               onClick={() => setIsGeneratorOpen(true)}
               className="px-3 py-1.5 rounded-md text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 whitespace-nowrap"
             >
               <Sparkles size={14} /> Nouveau Scénario
             </button>
          </div>
        </header>

        {/* Consigne et Contrôles */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-indigo-600 p-4 rounded-xl shadow-md text-white">
          <div className="flex items-start gap-4 mb-4 md:mb-0">
             <div className="bg-white/20 p-2 rounded-full mt-1">
                {currentScenario.isGenerated ? <Sparkles size={20} className="text-purple-200" /> : <Lightbulb size={20} className="text-yellow-300" />}
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-lg">{currentScenario.title}</h3>
                 {currentScenario.isGenerated && <span className="text-[10px] bg-purple-500/50 px-2 py-0.5 rounded-full border border-purple-400/30">Généré par IA</span>}
               </div>
               <p className="text-indigo-100 text-sm max-w-xl">{currentScenario.instruction}</p>
             </div>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
            {!validated && !currentScenario.showLabelsByDefault && (
               <button 
                 onClick={() => setShowHints(!showHints)}
                 className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-indigo-800/50 hover:bg-indigo-800 text-indigo-200 rounded-lg transition-colors mr-2"
               >
                 {showHints ? <EyeOff size={16} /> : <Eye size={16} />}
                 {showHints ? "Masquer Indices" : "Indices"}
               </button>
            )}

            <button 
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg transition-colors text-sm font-medium"
            >
              <RefreshCw size={16} /> Reset
            </button>
            <button 
              onClick={handleValidate}
              disabled={validated || !isComplete}
              className={`
                flex items-center gap-2 px-6 py-2 rounded-lg font-bold shadow-sm transition-all text-sm
                ${validated 
                  ? 'bg-slate-500 cursor-not-allowed opacity-50' 
                  : (isComplete ? 'bg-green-500 hover:bg-green-400 text-white scale-105' : 'bg-indigo-800 text-indigo-300 cursor-not-allowed')}
              `}
            >
              <CheckCircle size={16} /> Vérifier
            </button>
          </div>
        </div>

        {/* Zone de Schéma (Main Game Area) */}
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-lg border border-slate-200 overflow-x-auto">
          <div className="min-w-[850px] flex flex-col gap-10">
            
            {/* CHAINE D'INFORMATION (Bleu) */}
            <div className="relative p-6 pt-8 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/20">
              <div className="absolute -top-3 left-6 bg-blue-50 text-blue-700 px-3 py-1 rounded text-sm font-bold uppercase tracking-widest border border-blue-200 shadow-sm">
                Chaîne d'Information
              </div>
              
              <div className="flex justify-between items-center gap-6">
                 {/* Entrée Info */}
                 <div className="flex flex-col items-center gap-2 w-24 flex-shrink-0">
                    <div className="text-center text-[10px] font-bold text-slate-400 uppercase leading-tight">Grandeurs<br/>Physiques</div>
                    <ArrowRight className="text-blue-300" />
                 </div>

                 {/* Blocs */}
                 <ChainBox 
                   definition={BLOCKS[0]} // Acquérir
                   content={placements['acquerir']}
                   isCorrect={validated && placements['acquerir']?.targetBlock === 'acquerir'}
                   isWrong={validated && placements['acquerir']?.targetBlock !== 'acquerir'}
                   onClick={() => handleBoxClick('acquerir')}
                   isSelected={false}
                   showHint={showHints}
                 />
                 <ArrowRight className="text-blue-200 w-6 h-6 flex-shrink-0" />
                 
                 <ChainBox 
                   definition={BLOCKS[1]} // Traiter
                   content={placements['traiter']}
                   isCorrect={validated && placements['traiter']?.targetBlock === 'traiter'}
                   isWrong={validated && placements['traiter']?.targetBlock !== 'traiter'}
                   onClick={() => handleBoxClick('traiter')}
                   isSelected={false}
                   showHint={showHints}
                 />
                 <ArrowRight className="text-blue-200 w-6 h-6 flex-shrink-0" />

                 <ChainBox 
                   definition={BLOCKS[2]} // Communiquer
                   content={placements['communiquer']}
                   isCorrect={validated && placements['communiquer']?.targetBlock === 'communiquer'}
                   isWrong={validated && placements['communiquer']?.targetBlock !== 'communiquer'}
                   onClick={() => handleBoxClick('communiquer')}
                   isSelected={false}
                   showHint={showHints}
                 />

                 {/* Sortie Info (Ordres) */}
                 <div className="flex flex-col items-center gap-2 w-24 opacity-0 flex-shrink-0"> {/* Spacer */} </div>
              </div>
            </div>

            {/* FLÈCHE D'ORDRE (Liaison verticale) */}
            <div className="relative h-16 -my-6 z-10 pointer-events-none">
               <div className="absolute right-[21.5%] top-0 bottom-0 border-r-2 border-dashed border-slate-300 w-px h-full"></div>
               <div className="absolute right-[20.8%] bottom-4 transform rotate-90">
                  <ArrowRight className="text-slate-300 w-6 h-6" />
               </div>
               <div className="absolute right-[23%] top-1/2 -translate-y-1/2 bg-white px-2 text-[10px] font-bold text-slate-400 border border-slate-100 rounded shadow-sm">
                 ORDRES
               </div>
            </div>

            {/* CHAINE D'ÉNERGIE (Orange) */}
            <div className="relative p-6 pt-8 rounded-xl border-2 border-dashed border-orange-200 bg-orange-50/20">
              <div className="absolute -top-3 left-6 bg-orange-50 text-orange-700 px-3 py-1 rounded text-sm font-bold uppercase tracking-widest border border-orange-200 shadow-sm">
                Chaîne d'Énergie
              </div>

              <div className="flex justify-between items-center gap-4">
                 {/* Entrée Énergie */}
                 <div className="flex flex-col items-center gap-2 w-24 flex-shrink-0">
                    <div className="text-center text-[10px] font-bold text-slate-400 uppercase leading-tight">Énergie<br/>d'entrée</div>
                    <Zap className="text-yellow-400 fill-current w-5 h-5" />
                    <ArrowRight className="text-orange-300" />
                 </div>

                 {/* Blocs */}
                 <ChainBox 
                   definition={BLOCKS[3]} // Alimenter
                   content={placements['alimenter']}
                   isCorrect={validated && placements['alimenter']?.targetBlock === 'alimenter'}
                   isWrong={validated && placements['alimenter']?.targetBlock !== 'alimenter'}
                   onClick={() => handleBoxClick('alimenter')}
                   isSelected={false}
                   showHint={showHints}
                 />
                 <ArrowRight className="text-orange-200 w-6 h-6 flex-shrink-0" />

                 <ChainBox 
                   definition={BLOCKS[4]} // Distribuer
                   content={placements['distribuer']}
                   isCorrect={validated && placements['distribuer']?.targetBlock === 'distribuer'}
                   isWrong={validated && placements['distribuer']?.targetBlock !== 'distribuer'}
                   onClick={() => handleBoxClick('distribuer')}
                   isSelected={false}
                   showHint={showHints}
                 />
                 <ArrowRight className="text-orange-200 w-6 h-6 flex-shrink-0" />

                 <ChainBox 
                   definition={BLOCKS[5]} // Convertir
                   content={placements['convertir']}
                   isCorrect={validated && placements['convertir']?.targetBlock === 'convertir'}
                   isWrong={validated && placements['convertir']?.targetBlock !== 'convertir'}
                   onClick={() => handleBoxClick('convertir')}
                   isSelected={false}
                   showHint={showHints}
                 />
                 <ArrowRight className="text-orange-200 w-6 h-6 flex-shrink-0" />

                 <ChainBox 
                   definition={BLOCKS[6]} // Transmettre
                   content={placements['transmettre']}
                   isCorrect={validated && placements['transmettre']?.targetBlock === 'transmettre'}
                   isWrong={validated && placements['transmettre']?.targetBlock !== 'transmettre'}
                   onClick={() => handleBoxClick('transmettre')}
                   isSelected={false}
                   showHint={showHints}
                 />

                 {/* Sortie Action */}
                 <div className="flex flex-col items-center gap-2 w-24 ml-2 flex-shrink-0">
                    <ArrowRight className="text-slate-800 w-8 h-8" />
                    <div className="bg-slate-800 text-white px-3 py-1 rounded shadow text-xs font-bold uppercase">Action</div>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Banque d'éléments (Footer) */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-200 min-h-[140px] sticky bottom-4 z-50">
           {validated ? (
             <div className="text-center animate-fadeIn">
               {score === 7 ? (
                 <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
                      <Trophy className="w-8 h-8 fill-current text-yellow-400" />
                      Excellent ! C'est parfait !
                    </div>
                    <p className="text-slate-600">
                      {currentScenario.isGenerated 
                        ? "Vous avez maîtrisé ce système généré par IA." 
                        : "Vous maîtrisez la chaîne d'énergie et d'information."}
                    </p>
                    <button 
                      onClick={() => {
                        const next = (scenarioIndex + 1) % scenarios.length;
                        setScenarioIndex(next);
                      }}
                      className="mt-2 px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2"
                    >
                      Exercice Suivant <ArrowRight size={18} />
                    </button>
                 </div>
               ) : (
                 <div className="space-y-3">
                    <h2 className="text-xl font-bold text-orange-500">Presque ! Score : {score} / 7</h2>
                    <p className="text-slate-600 text-sm">Les éléments rouges sont mal placés.</p>
                    <button 
                      onClick={() => {
                        setValidated(false);
                        setPlacements(prev => {
                          const newPlacements = {...prev};
                          Object.keys(newPlacements).forEach(key => {
                             const k = key as BlockId;
                             if (newPlacements[k]?.targetBlock !== k) {
                               newPlacements[k] = null;
                             }
                          });
                          return newPlacements;
                        });
                      }}
                      className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-semibold shadow"
                    >
                      Corriger les erreurs
                    </button>
                 </div>
               )}
             </div>
           ) : (
             <>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                    <Shuffle size={16} />
                    Banque de composants (Mélangés)
                  </h3>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                    {availableItems.length} élément{availableItems.length > 1 ? 's' : ''} restant{availableItems.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  {availableItems.length === 0 && !validated ? (
                    <div className="w-full py-4 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                      <CheckCircle className="w-8 h-8 mb-2 text-slate-300" />
                      <span className="italic">Tous les éléments sont placés. Cliquez sur "Vérifier".</span>
                    </div>
                  ) : (
                    availableItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedItem(selectedItem?.id === item.id ? null : item)}
                        className={`
                          px-4 py-3 rounded-lg shadow-sm font-medium text-sm transition-all transform
                          ${selectedItem?.id === item.id 
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 scale-110 -translate-y-2 z-10' 
                            : 'bg-slate-50 text-slate-700 hover:bg-white hover:shadow-md hover:-translate-y-1 border border-slate-200'}
                        `}
                      >
                        {item.name}
                      </button>
                    ))
                  )}
                </div>
             </>
           )}
        </div>

      </div>
      {/* --- MODALE GÉNÉRATEUR IA --- */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-start">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="fill-yellow-300 text-yellow-300 animate-pulse" />
                  Générateur de Scénario Copilot
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Créez un exercice sur mesure.</p>
              </div>
              <button onClick={() => setIsGeneratorOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Quel système technique voulez-vous étudier ?
                </label>
                <input 
                  type="text" 
                  value={generatorPrompt}
                  onChange={(e) => setGeneratorPrompt(e.target.value)}
                  placeholder="Ex: Une voiture électrique, Un grille-pain, Un drone..."
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && generateScenario()}
                />
              </div>

              {generationError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                  <span className="font-bold">Erreur:</span> {generationError}
                </div>
              )}

              <button 
                onClick={generateScenario}
                disabled={isGenerating || !generatorPrompt.trim()}
                className={`
                  w-full py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-2 transition-all
                  ${isGenerating 
                    ? 'bg-slate-400 cursor-wait' 
                    : 'bg-purple-600 hover:bg-purple-700 hover:scale-[1.02]'}
                `}
              >
                {isGenerating ? (
                  <><Loader className="animate-spin" /> Génération en cours...</>
                ) : (
                  <><Sparkles size={20} /> Générer avec Copilot</>
                )}
              </button>
              
              <p className="text-xs text-slate-400 text-center mt-2">
                Utilise le générateur Copilot local pour créer des scénarios pédagogiques uniques.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Montage de l'application ---

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<EnergyChainApp />);
}