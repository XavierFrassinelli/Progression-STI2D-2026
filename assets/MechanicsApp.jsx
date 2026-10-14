import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  ArrowRight, CheckCircle, RotateCcw, Sparkles, X, Loader2, 
  Scale, Lightbulb, Trophy, Target, Eye, Move, RotateCw, Dice5
} from 'lucide-react';

// --- UTILITAIRES ---
const toRad = (deg) => deg * (Math.PI / 180);

const evaluateExpression = (expr) => {
  if (!expr) return null;
  try {
    let cleanExpr = expr.toLowerCase()
      .replace(/,/g, '.')
      .replace(/x/g, '*')
      .replace(/cos\(/g, `Math.cos(${Math.PI}/180*`)
      .replace(/sin\(/g, `Math.sin(${Math.PI}/180*`)
      .replace(/tan\(/g, `Math.tan(${Math.PI}/180*`)
      .replace(/sqrt\(/g, 'Math.sqrt(')
      .replace(/racine\(/g, 'Math.sqrt(')
      .replace(/\^2/g, '**2')
      .replace(/pi/g, 'Math.PI');

    // eslint-disable-next-line no-new-func
    const result = new Function(`return ${cleanExpr}`)();
    return Number.isFinite(result) ? result : null;
  } catch (e) {
    return null;
  }
};

// --- COMPOSANT INPUT ---
const SmartInput = ({ value, onChange, placeholder, status, label, disabled, solution }) => {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const val = evaluateExpression(value);
    setPreview(val !== null ? val.toFixed(1) : null);
  }, [value]);

  let borderColor = "border-slate-300 focus:border-indigo-500";
  let bgColor = "bg-white";
  
  if (status === 'correct') {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
  } else if (status === 'wrong') {
    borderColor = "border-red-500";
    bgColor = "bg-red-50";
  }

  return (
    <div className="relative group w-full min-w-[120px]">
      {label && <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wide">{label}</label>}
      <div className="relative flex items-center gap-2">
        <div className="relative w-full">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-2 pr-8 border rounded-md outline-none transition-all font-mono text-sm ${borderColor} ${bgColor} disabled:bg-slate-100 disabled:text-slate-400`}
          />
          {value && preview !== null && status !== 'correct' && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 bg-slate-100 px-1 rounded pointer-events-none">
              = {preview}
            </div>
          )}
          {status === 'correct' && <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 w-4 h-4" />}
        </div>
        {solution !== undefined && (
          <div className="animate-fadeIn bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-mono border border-green-200 whitespace-nowrap shadow-sm">
            {solution}
          </div>
        )}
      </div>
    </div>
  );
};

// --- MODALE IA (VERSION STABLE - GEMINI PRO) ---
const GeneratorModal = ({ onClose, onGenerate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Ta clé API
  const apiKey = "AIzaSyDwDwLI9mt63UuBitMbcmyzI8dJe87QR2Y"; 

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const systemPrompt = `
      Tu es un professeur de mécanique statique.
      Génère un exercice de statique plane (2D) unique sur un système concret.
      
      Règles strictes :
      1. JSON uniquement.
      2. Deux forces (F1, F2).
      3. Coordonnées x,y cohérentes.
      4. Angles en degrés.
      
      Structure JSON attendue :
      {
        "title": "Titre",
        "context": "Contexte.",
        "forces": [
          { "id": "F1", "name": "F1", "magnitude": 1500, "angle": 270, "x": 5, "y": 0 },
          { "id": "F2", "name": "F2", "magnitude": 2500, "angle": 45, "x": 2, "y": 3 }
        ]
      }
    `;

    try {
      // --- CORRECTION : ON UTILISE LE MODÈLE 'gemini-pro' ---
      // C'est le modèle le plus compatible actuellement.
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          })
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Erreur ${response.status}`);
      }

      const data = await response.json();
      
      let rawText = data.candidates[0].content.parts[0].text;
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const json = JSON.parse(rawText);
      onGenerate(json);
      onClose();

    } catch (e) {
      console.error(e);
      setError("Erreur IA : " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg flex items-center gap-2 mx-auto pl-8">
            <Dice5 className="text-purple-600"/> Générateur IA
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
        </div>
        <div className="mb-6 text-slate-600 text-sm">
          Tentative avec le modèle standard Gemini Pro...
        </div>
        {error && <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100 text-left max-h-32 overflow-auto">{error}</div>}
        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-indigo-700 transition-all"
        >
          {loading ? <><Loader2 className="animate-spin"/> Création...</> : <><Sparkles size={18}/> Générer</>}
        </button>
      </div>
    </div>
  );
};

// --- APP PRINCIPALE ---
const MechanicsApp = () => {
  const [level, setLevel] = useState(1);
  const [problem, setProblem] = useState({
    title: "Levier coudé",
    context: "Un levier est soumis à une force de manoeuvre et à une charge. Vérifiez l'équilibre global.",
    forces: [
      { id: "F1", name: "Manoeuvre (F)", magnitude: 150, angle: 90, x: 2, y: 0 },
      { id: "F2", name: "Charge (P)", magnitude: 300, angle: 270, x: 1, y: 0 } 
    ]
  });

  const [inputs, setInputs] = useState({});
  const [validation, setValidation] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleChange = (id, field, value) => {
    setInputs(prev => ({ ...prev, [`${id}_${field}`]: value }));
    setValidation(null);
    setShowSolution(false);
  };

  const validatePFS = () => {
    const results = {};
    let totalX = 0, totalY = 0, totalMoment = 0;
    let allCorrect = true;

    problem.forces.forEach(f => {
      const rad = toRad(f.angle);
      const trueX = f.magnitude * Math.cos(rad);
      const trueY = f.magnitude * Math.sin(rad);
      const trueMoment = (f.x * trueY) - (f.y * trueX);

      totalX += trueX;
      totalY += trueY;
      totalMoment += trueMoment;

      const userX = evaluateExpression(inputs[`${f.id}_x`]);
      const userY = evaluateExpression(inputs[`${f.id}_y`]);
      const xOk = userX !== null && Math.abs(userX - trueX) < 1.0;
      const yOk = userY !== null && Math.abs(userY - trueY) < 1.0;

      results[`${f.id}_x`] = xOk ? 'correct' : 'wrong';
      results[`${f.id}_y`] = yOk ? 'correct' : 'wrong';

      if (level === 3) {
        const userM = evaluateExpression(inputs[`${f.id}_m`]);
        const mOk = userM !== null && Math.abs(userM - trueMoment) < 2.0;
        results[`${f.id}_m`] = mOk ? 'correct' : 'wrong';
        if (!mOk) allCorrect = false;
      }
      if (!xOk || !yOk) allCorrect = false;
    });

    let targetRx = 0, targetRy = 0, targetRMag = 0, targetRMoment = 0;

    if (level >= 2) {
      targetRx = -totalX;
      targetRy = -totalY;
      targetRMag = Math.sqrt(targetRx**2 + targetRy**2);

      const userRx = evaluateExpression(inputs['R_x']);
      const userRy = evaluateExpression(inputs['R_y']);
      const userRMag = evaluateExpression(inputs['R_mag']);

      const rxOk = userRx !== null && Math.abs(userRx - targetRx) < 1.0;
      const ryOk = userRy !== null && Math.abs(userRy - targetRy) < 1.0;
      const rMagOk = userRMag !== null && Math.abs(userRMag - targetRMag) < 1.0;

      results['R_x'] = rxOk ? 'correct' : 'wrong';
      results['R_y'] = ryOk ? 'correct' : 'wrong';
      results['R_mag'] = rMagOk ? 'correct' : 'wrong';

      if (!rxOk || !ryOk || !rMagOk) allCorrect = false;
    }

    if (level === 3) {
      targetRMoment = -totalMoment;
      const userRMoment = evaluateExpression(inputs['R_m']);
      const rmOk = userRMoment !== null && Math.abs(userRMoment - targetRMoment) < 2.0;
      results['R_m'] = rmOk ? 'correct' : 'wrong';
      if (!rmOk) allCorrect = false;
    }

    setValidation({ results, allCorrect, targetRx, targetRy, targetRMag, targetRMoment });
  };

  // --- CALCUL DU FACTEUR D'ÉCHELLE (Fit Screen) ---
  const vectorScale = useMemo(() => {
    if (!problem.forces.length) return 1;

    // 1. Trouver la force la plus grande
    const maxMag = Math.max(...problem.forces.map(f => f.magnitude));

    // 2. Définir la taille visuelle cible (dans ton viewBox -5 à 5)
    const targetSize = 3.5; 

    // 3. Sécurité pour les petites forces
    const referenceMax = Math.max(maxMag, 200); 

    // 4. Retourner le ratio
    return targetSize / referenceMax;
  }, [problem.forces]);

  return (
    <div className="bg-slate-50 p-4 font-sans text-slate-800 min-h-[600px] rounded-lg">
      
      {showGenerator && <GeneratorModal onClose={() => setShowGenerator(false)} onGenerate={setProblem} />}

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Scale className="text-indigo-600"/> Atelier Mécanique
            </h1>
            <p className="text-slate-500 text-sm mt-1">{problem.title} — {problem.context}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setInputs({}); setValidation(null); setShowSolution(false); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"><RotateCcw size={20}/></button>
            <button 
              onClick={() => setShowGenerator(true)} 
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-bold flex items-center gap-2 hover:shadow-lg transition transform hover:scale-105"
            >
              <Sparkles size={16}/> Nouvel Exercice
            </button>
          </div>
        </header>

        {/* NIVEAUX */}
        <div className="flex gap-1 bg-slate-200 p-1 rounded-lg w-fit mx-auto md:mx-0">
          {[1, 2, 3].map(lvl => (
            <button 
              key={lvl}
              onClick={() => { setLevel(lvl); setValidation(null); setShowSolution(false); }}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${level === lvl ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {lvl === 1 ? 'Niv 1 : Projections' : lvl === 2 ? 'Niv 2 : PFS Forces' : 'Niv 3 : Moments'}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          
          {/* TABLEAU */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            
            <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-lg text-sm border border-blue-100 flex gap-3">
              <div className="mt-1"><Lightbulb size={18} /></div>
              <div>
                {level === 1 && "Décomposez chaque force sur les axes X et Y (Projections)."}
                {level === 2 && "Après avoir projeté, calculez la Réaction pour que la somme soit nulle."}
                {level === 3 && "Calculez aussi le moment de chaque force par rapport à l'origine."}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                  <tr>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3 text-center">Données</th>
                    <th className="px-4 py-3 w-40">Projection X</th>
                    <th className="px-4 py-3 w-40">Projection Y</th>
                    {level === 3 && <th className="px-4 py-3 w-40 bg-purple-50/50 text-purple-700 border-l border-purple-100">Moment</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {problem.forces.map((force) => (
                    <tr key={force.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium text-slate-700">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>{force.name}
                        </div>
                        {level === 3 && <div className="text-[10px] text-slate-400 font-mono ml-4">Pos: ({force.x}m, {force.y}m)</div>}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-slate-500 font-mono">
                        <div>{force.magnitude} N</div><div>{force.angle}°</div>
                      </td>
                      <td className="px-4 py-2"><SmartInput placeholder="F*cos(a)" value={inputs[`${force.id}_x`] || ''} onChange={(val) => handleChange(force.id, 'x', val)} status={validation?.results[`${force.id}_x`]} /></td>
                      <td className="px-4 py-2"><SmartInput placeholder="F*sin(a)" value={inputs[`${force.id}_y`] || ''} onChange={(val) => handleChange(force.id, 'y', val)} status={validation?.results[`${force.id}_y`]} /></td>
                      {level === 3 && <td className="px-4 py-2 bg-purple-50/20 border-l border-purple-50"><SmartInput placeholder="x*Fy - y*Fx" value={inputs[`${force.id}_m`] || ''} onChange={(val) => handleChange(force.id, 'm', val)} status={validation?.results[`${force.id}_m`]} /></td>}
                    </tr>
                  ))}
                  {level >= 2 && (
                    <tr className="bg-pink-50/30 border-t-2 border-pink-100">
                      <td className="px-4 py-4 font-bold text-pink-700 flex items-center gap-2"><Target size={18}/> Réaction R</td>
                      <td className="px-4 py-4 text-center text-xs text-pink-400 italic">Inconnue</td>
                      <td className="px-4 py-2"><SmartInput placeholder="- ΣX" value={inputs['R_x'] || ''} onChange={(val) => handleChange('R', 'x', val)} status={validation?.results['R_x']} solution={showSolution && validation ? validation.targetRx.toFixed(1) : undefined} /></td>
                      <td className="px-4 py-2"><SmartInput placeholder="- ΣY" value={inputs['R_y'] || ''} onChange={(val) => handleChange('R', 'y', val)} status={validation?.results['R_y']} solution={showSolution && validation ? validation.targetRy.toFixed(1) : undefined} /></td>
                      {level === 3 && <td className="px-4 py-2 bg-purple-50/20 border-l border-purple-100"><SmartInput placeholder="- ΣMoments" value={inputs['R_m'] || ''} onChange={(val) => handleChange('R', 'm', val)} status={validation?.results['R_m']} label="Moment R" solution={showSolution && validation ? validation.targetRMoment.toFixed(1) : undefined} /></td>}
                    </tr>
                  )}
                </tbody>
                {level >= 2 && (
                  <tfoot className="bg-slate-50 font-bold text-slate-700 border-t border-slate-200">
                     <tr>
                       <td colSpan={2} className="px-4 py-3 text-right text-xs uppercase tracking-wide">Norme ||R||</td>
                       <td colSpan={level === 3 ? 3 : 2} className="px-4 py-2">
                          <div className="max-w-[200px]">
                            <SmartInput placeholder="Ex: 223.6" value={inputs['R_mag'] || ''} onChange={(val) => handleChange('R', 'mag', val)} status={validation?.results['R_mag']} solution={showSolution && validation ? validation.targetRMag.toFixed(1) : undefined} />
                          </div>
                       </td>
                     </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="mt-6 flex justify-end gap-4 items-center">
              {validation && !validation.allCorrect && (
                 <button onClick={() => setShowSolution(!showSolution)} className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-2 px-3">
                   <Eye size={16}/> {showSolution ? 'Masquer' : 'Voir'} Solution
                 </button>
              )}
              <button onClick={validatePFS} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                Vérifier <ArrowRight size={18}/>
              </button>
            </div>

            {validation && (
              <div className={`mt-4 p-4 rounded-xl text-center animate-fadeIn ${validation.allCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                {validation.allCorrect ? <><Trophy size={32} className="inline mr-2"/> Bravo !</> : "Vérifiez vos calculs."}
              </div>
            )}
          </div>

          {/* SIDEBAR : VISU */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2"><Move size={14}/> Schéma Vectoriel</h3>
              <div className="aspect-square bg-slate-50 rounded-lg border border-slate-200 relative overflow-hidden flex items-center justify-center">
                {/* Grille */}
                <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                <div className="absolute w-full h-[1px] bg-slate-400 top-1/2 opacity-50"></div>
                <div className="absolute h-full w-[1px] bg-slate-400 left-1/2 opacity-50"></div>
                
                <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="-5 -5 10 10">
                   <g transform="scale(1, -1)">
                     {problem.forces.map((f) => {
                       const rad = toRad(f.angle);
                       // --- APPLIQUER L'ÉCHELLE ---
                       const visualLength = f.magnitude * vectorScale;
                       const dx = visualLength * Math.cos(rad);
                       const dy = visualLength * Math.sin(rad);
                       // ---------------------------
                       const ox = level === 3 ? (f.x || 0) : 0;
                       const oy = level === 3 ? (f.y || 0) : 0;
                       return (
                         <g key={f.id}>
                           <line x1={ox} y1={oy} x2={ox + dx} y2={oy + dy} stroke="#6366f1" strokeWidth="0.1" markerEnd="url(#headBlue)" />
                           {level === 3 && <circle cx={ox} cy={oy} r="0.1" fill="#6366f1" opacity="0.5"/>}
                         </g>
                       );
                     })}
                   </g>
                   <defs>
                     <marker id="headBlue" markerWidth="4" markerHeight="4" refX="2" refY="2" orient="auto"><path d="M0,0 L0,4 L4,2 z" fill="#6366f1" /></marker>
                   </defs>
                </svg>
              </div>
            </div>
            {level === 3 && (
               <div className="bg-purple-900 text-purple-100 p-5 rounded-xl text-sm shadow-lg">
                <h4 className="font-bold text-white mb-2 flex items-center gap-2"><RotateCw size={16} className="text-yellow-400"/> Rappel</h4>
                <code className="block bg-purple-950 p-2 rounded text-center text-yellow-300 font-mono text-xs mb-2">M = x.Fy - y.Fx</code>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MONTAGE ---
const container = document.getElementById('mechanics-root');
if (container) {
  const root = createRoot(container);
  root.render(<MechanicsApp />);
}