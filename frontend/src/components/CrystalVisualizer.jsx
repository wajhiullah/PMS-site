import React, { useState, useRef, useEffect } from 'react';
import { Layers } from 'lucide-react';

export default function CrystalVisualizer() {
  const [mode, setMode] = useState('bcc');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 160, y: 140 });
  const [rotation, setRotation] = useState({ x: 10, y: 15 });
  const [isRotating, setIsRotating] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isRotating || mode === 'sem') return;
    const interval = setInterval(() => {
      setRotation((prev) => ({
        x: Math.sin(Date.now() / 2500) * 8,
        y: prev.y + 0.35,
      }));
    }, 30);
    return () => clearInterval(interval);
  }, [isRotating, mode]);

  const structures = {
    bcc: {
      name: 'Body-Centered Cubic (BCC)',
      example: 'α-Iron (Ferrite), Chromium, Tungsten, Mo',
      coordination: 8,
      apf: '0.68 (68% APF)',
      slipSystem: '{110} ⟨111⟩ (48 slip systems)',
      description: 'High shear resistance and strength. Shows distinct ductile-to-brittle transition temperature (DBTT).',
      color: '#F97316',
      accentBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      atoms: [
        { id: 'c1', x: 70, y: 70, type: 'corner', label: 'Corner (0,0,0)', element: 'Fe' },
        { id: 'c2', x: 210, y: 70, type: 'corner', label: 'Corner (1,0,0)', element: 'Fe' },
        { id: 'c3', x: 210, y: 210, type: 'corner', label: 'Corner (1,1,0)', element: 'Fe' },
        { id: 'c4', x: 70, y: 210, type: 'corner', label: 'Corner (0,1,0)', element: 'Fe' },
        { id: 'c5', x: 110, y: 40, type: 'corner', label: 'Corner (0,0,1)', element: 'Fe' },
        { id: 'c6', x: 250, y: 40, type: 'corner', label: 'Corner (1,0,1)', element: 'Fe' },
        { id: 'c7', x: 250, y: 180, type: 'corner', label: 'Corner (1,1,1)', element: 'Fe' },
        { id: 'c8', x: 110, y: 180, type: 'corner', label: 'Corner (0,1,1)', element: 'Fe' },
        { id: 'cen', x: 160, y: 125, type: 'center', label: 'Body Center (½, ½, ½)', element: 'Fe' },
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ]
    },
    fcc: {
      name: 'Face-Centered Cubic (FCC)',
      example: 'γ-Iron (Austenite), Copper, Nickel, Al',
      coordination: 12,
      apf: '0.74 (Close-Packed 74%)',
      slipSystem: '{111} ⟨110⟩ (12 close-packed slip systems)',
      description: 'Superb cryogenic toughness, high ductility, excellent formability, and no DBTT embrittlement.',
      color: '#06B6D4',
      accentBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
      atoms: [
        { id: 'c1', x: 70, y: 70, type: 'corner', label: 'Corner (0,0,0)', element: 'Ni' },
        { id: 'c2', x: 210, y: 70, type: 'corner', label: 'Corner (1,0,0)', element: 'Ni' },
        { id: 'c3', x: 210, y: 210, type: 'corner', label: 'Corner (1,1,0)', element: 'Ni' },
        { id: 'c4', x: 70, y: 210, type: 'corner', label: 'Corner (0,1,0)', element: 'Ni' },
        { id: 'c5', x: 110, y: 40, type: 'corner', label: 'Corner (0,0,1)', element: 'Ni' },
        { id: 'c6', x: 250, y: 40, type: 'corner', label: 'Corner (1,0,1)', element: 'Ni' },
        { id: 'c7', x: 250, y: 180, type: 'corner', label: 'Corner (1,1,1)', element: 'Ni' },
        { id: 'c8', x: 110, y: 180, type: 'corner', label: 'Corner (0,1,1)', element: 'Ni' },
        { id: 'f1', x: 140, y: 140, type: 'face', label: 'Front Face (½, ½, 0)', element: 'Ni' },
        { id: 'f2', x: 180, y: 110, type: 'face', label: 'Back Face (½, ½, 1)', element: 'Ni' },
        { id: 'f3', x: 90, y: 125, type: 'face', label: 'Left Face (0, ½, ½)', element: 'Ni' },
        { id: 'f4', x: 230, y: 125, type: 'face', label: 'Right Face (1, ½, ½)', element: 'Ni' },
        { id: 'f5', x: 160, y: 55, type: 'face', label: 'Top Face (½, 0, ½)', element: 'Ni' },
        { id: 'f6', x: 160, y: 195, type: 'face', label: 'Bottom Face (½, 1, ½)', element: 'Ni' },
      ],
      edges: [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ]
    },
    hcp: {
      name: 'Hexagonal Close-Packed (HCP)',
      example: 'Titanium (α), Zircaloy-4 (Nuclear Clad), Magnesium',
      coordination: 12,
      apf: '0.74 (Ideal c/a = 1.633)',
      slipSystem: '{0001} ⟨11-20⟩ (Basal slip systems)',
      description: 'Anisotropic mechanical properties, high strength-to-weight ratio, ultra-low neutron cross section.',
      color: '#A855F7',
      accentBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      atoms: [
        { id: 'h1', x: 160, y: 40, type: 'basal', label: 'Basal Center Upper', element: 'Zr' },
        { id: 'h2', x: 110, y: 55, type: 'basal', label: 'Hex Corner 1', element: 'Zr' },
        { id: 'h3', x: 210, y: 55, type: 'basal', label: 'Hex Corner 2', element: 'Zr' },
        { id: 'h4', x: 240, y: 90, type: 'basal', label: 'Hex Corner 3', element: 'Zr' },
        { id: 'h5', x: 180, y: 110, type: 'basal', label: 'Hex Corner 4', element: 'Zr' },
        { id: 'h6', x: 80, y: 90, type: 'basal', label: 'Hex Corner 5', element: 'Zr' },
        { id: 'm1', x: 140, y: 135, type: 'mid', label: 'Mid-Layer Atom A', element: 'Zr' },
        { id: 'm2', x: 190, y: 145, type: 'mid', label: 'Mid-Layer Atom B', element: 'Zr' },
        { id: 'm3', x: 145, y: 170, type: 'mid', label: 'Mid-Layer Atom C', element: 'Zr' },
        { id: 'b1', x: 160, y: 200, type: 'basal', label: 'Basal Center Lower', element: 'Zr' },
        { id: 'b2', x: 110, y: 215, type: 'basal', label: 'Hex Corner 6', element: 'Zr' },
        { id: 'b3', x: 210, y: 215, type: 'basal', label: 'Hex Corner 7', element: 'Zr' },
        { id: 'b4', x: 240, y: 250, type: 'basal', label: 'Hex Corner 8', element: 'Zr' },
        { id: 'b5', x: 180, y: 270, type: 'basal', label: 'Hex Corner 9', element: 'Zr' },
        { id: 'b6', x: 80, y: 250, type: 'basal', label: 'Hex Corner 10', element: 'Zr' },
      ],
      edges: [
        [1, 2], [2, 3], [3, 4], [4, 5], [5, 1],
        [10, 11], [11, 12], [12, 13], [13, 14], [14, 10],
        [1, 10], [2, 11], [3, 12], [4, 13], [5, 14],
      ]
    },
    sem: {
      name: 'Simulated SEM Metallography',
      example: 'AISI 1080 Eutectoid Steel (2% Nital Etch)',
      coordination: 'Two-Phase Multi-Domain',
      apf: 'Ferrite (α-BCC) + Cementite (Fe₃C)',
      slipSystem: 'Grain Boundary Strengthening',
      description: 'Fine lamellar pearlite colonies intersecting prior austenite boundaries alongside quenched martensite needles.',
      color: '#38BDF8',
      accentBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    }
  };

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const activeStruct = structures[mode];

  return (
    <div className="rounded-2xl glass-card border border-white/10 p-5 sm:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping" />
            <h3 className="font-heading font-bold text-white text-base tracking-wide flex items-center gap-1.5">
              <span>Interactive Microstructure & Lattice</span>
            </h3>
          </div>
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            Real-time crystallographic simulation & SEM inspection
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950/70 border border-white/10 shrink-0">
          {['bcc', 'fcc', 'hcp', 'sem'].map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setHoveredItem(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all duration-200 ${
                mode === m
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsRotating(false)}
        onMouseLeave={() => setIsRotating(true)}
        className="relative h-72 sm:h-80 w-full rounded-xl bg-slate-950/90 border border-white/10 flex items-center justify-center overflow-hidden cursor-crosshair select-none shadow-inner"
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-slate-300">
          <Layers className="w-3 h-3 text-cyan-400" />
          <span>{mode === 'sem' ? 'SEM Phase Map' : 'Unit Cell Visualizer'}</span>
        </div>

        {mode !== 'sem' ? (
          <svg
            className="w-full h-full max-w-[340px] max-h-[300px] transition-transform duration-300"
            style={{
              transform: `perspective(600px) rotateX(${rotation.x}deg) rotateY(${Math.sin(rotation.y * 0.05) * 12}deg)`,
            }}
            viewBox="0 0 320 290"
          >
            <defs>
              <radialGradient id="atomGlowBCC" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#FED7AA" />
                <stop offset="30%" stopColor="#FB923C" />
                <stop offset="75%" stopColor="#EA580C" />
                <stop offset="100%" stopColor="#7C2D12" />
              </radialGradient>
              <radialGradient id="atomGlowFCC" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="30%" stopColor="#38BDF8" />
                <stop offset="75%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#082F49" />
              </radialGradient>
              <radialGradient id="atomGlowHCP" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#E9D5FF" />
                <stop offset="30%" stopColor="#C084FC" />
                <stop offset="75%" stopColor="#9333EA" />
                <stop offset="100%" stopColor="#3B0764" />
              </radialGradient>
              <filter id="atomShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.5" />
              </filter>
            </defs>

            {activeStruct.edges?.map(([start, end], edgeIdx) => {
              const p1 = activeStruct.atoms[start];
              const p2 = activeStruct.atoms[end];
              if (!p1 || !p2) return null;
              return (
                <line
                  key={`edge-${edgeIdx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="rgba(255, 255, 255, 0.28)"
                  strokeWidth="1.75"
                  strokeDasharray="4 3"
                />
              );
            })}

            {activeStruct.atoms?.map((atom) => {
              const isHovered = hoveredItem?.id === atom.id;
              const gradientId =
                mode === 'bcc' ? 'url(#atomGlowBCC)' : mode === 'fcc' ? 'url(#atomGlowFCC)' : 'url(#atomGlowHCP)';
              const radius = atom.type === 'center' ? 18 : atom.type === 'face' ? 15 : 13;

              return (
                <g
                  key={atom.id}
                  onMouseEnter={() => setHoveredItem(atom)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="cursor-pointer transition-transform duration-200"
                  style={{ transformOrigin: `${atom.x}px ${atom.y}px` }}
                >
                  {isHovered && (
                    <circle
                      cx={atom.x}
                      cy={atom.y}
                      r={radius + 8}
                      fill="none"
                      stroke={activeStruct.color}
                      strokeWidth="2.5"
                      className="animate-pulse"
                    />
                  )}
                  <circle
                    cx={atom.x}
                    cy={atom.y}
                    r={radius}
                    fill={gradientId}
                    filter="url(#atomShadow)"
                  />
                  <circle
                    cx={atom.x - radius * 0.35}
                    cy={atom.y - radius * 0.35}
                    r={radius * 0.25}
                    fill="#FFFFFF"
                    opacity="0.65"
                  />
                  <text
                    x={atom.x}
                    y={atom.y + 4}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize={radius > 15 ? "11" : "9"}
                    fontFamily="monospace"
                    fontWeight="bold"
                    pointerEvents="none"
                  >
                    {atom.element}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center p-3">
            <svg className="w-full h-full" viewBox="0 0 320 280">
              <polygon
                points="10,20 140,10 160,110 50,140"
                fill="#1E293B"
                stroke="#64748B"
                strokeWidth="2"
              />
              <text x="50" y="75" fill="#CBD5E1" fontSize="10" fontFamily="monospace" fontWeight="bold">
                α-Ferrite (BCC)
              </text>

              <polygon
                points="140,10 300,30 280,160 160,110"
                fill="#0F172A"
                stroke="#475569"
                strokeWidth="2"
              />
              {[40, 55, 70, 85, 100, 115, 130, 145].map((yVal, i) => (
                <line
                  key={`lam-${i}`}
                  x1={170 + i * 5}
                  y1={30 + i * 14}
                  x2={270 - i * 3}
                  y2={50 + i * 13}
                  stroke="#FB923C"
                  strokeWidth="1.5"
                  opacity="0.8"
                />
              ))}
              <text x="180" y="90" fill="#F97316" fontSize="11" fontFamily="monospace" fontWeight="bold">
                Pearlite (α + Fe₃C)
              </text>

              <polygon
                points="50,140 160,110 210,250 30,260"
                fill="#131B2E"
                stroke="#475569"
                strokeWidth="2"
              />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <line
                  key={`lath-${i}`}
                  x1={50 + i * 18}
                  y1={160 + i * 8}
                  x2={110 + i * 12}
                  y2={230 - i * 4}
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                  opacity="0.85"
                />
              ))}
              <text x="60" y="200" fill="#38BDF8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Tempered Martensite
              </text>

              <polygon
                points="160,110 280,160 300,260 210,250"
                fill="#1E293B"
                stroke="#64748B"
                strokeWidth="2"
              />
              <text x="210" y="210" fill="#E2E8F0" fontSize="10" fontFamily="monospace" fontWeight="bold">
                Retained γ (Austenite)
              </text>
            </svg>

            <div
              className="absolute pointer-events-none w-28 h-28 rounded-full border-2 border-orange-500 bg-orange-500/15 backdrop-blur-[2px] shadow-2xl shadow-orange-500/40 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-md" />
              <div className="absolute top-2 text-[9px] font-mono text-orange-200 font-bold bg-slate-950/90 border border-orange-500/40 px-1.5 py-0.5 rounded shadow">
                1000× MAG
              </div>
            </div>
          </div>
        )}

        {hoveredItem && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-white/20 p-2.5 rounded-xl shadow-2xl text-xs font-mono z-20 backdrop-blur-md">
            <span className="text-orange-400 font-bold">{hoveredItem.label}</span>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Element: <strong className="text-white">{hoveredItem.element}</strong> • Coordination: {activeStruct.coordination}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-left">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Coordination</span>
          <span className="text-xs sm:text-sm font-bold text-white font-mono">{activeStruct.coordination}</span>
        </div>
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Packing Factor</span>
          <span className="text-xs sm:text-sm font-bold text-orange-400 font-mono">{activeStruct.apf}</span>
        </div>
        <div className="col-span-2 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Alloy Examples</span>
          <span className="text-xs text-slate-300 font-mono block leading-relaxed">{activeStruct.example}</span>
        </div>
      </div>
    </div>
  );
}
