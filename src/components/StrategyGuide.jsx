import React from 'react';

export default function StrategyGuide() {
  return (
    <div className="w-full bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800 font-sans h-full flex flex-col">
      <div className="bg-slate-800 p-4 border-b border-slate-700">
        <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
           AI Strategy Agent 
        </h2>
        <p className="text-slate-400 text-xs mt-1">XAUUSD Mechanical Edge Parameters</p>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 text-sm text-slate-300">
        
        <div className="bg-slate-950 p-3 rounded border border-slate-800">
          <h3 className="text-yellow-500 font-bold mb-2">Core Constraints</h3>
          <ul className="list-disc pl-4 space-y-1 text-slate-400">
            <li><span className="text-white">Max Risk:</span> 1% per trade. No exceptions.</li>
            <li><span className="text-white">Minimum R:R:</span> 1:2 on every setup.</li>
            <li><span className="text-white">Framework:</span> Smart Money Concepts (SMC) & Price Action.</li>
          </ul>
        </div>

        <div className="bg-slate-950 p-3 rounded border border-slate-800">
          <h3 className="text-blue-400 font-bold mb-2">The AI Master Prompt</h3>
          <p className="italic text-slate-500 text-xs mb-2">Copy this into ChatGPT/Claude to refine the system:</p>
          <div className="bg-slate-900 p-3 rounded text-xs font-mono text-slate-400 border border-slate-700 select-all">
            "You are an elite Quantitative Forex Analyst specializing in XAUUSD. Help me build a >70% win rate mechanical strategy.
            Rules: 1% max risk, min 1:2 RR, using SMC/Price action.
            Task 1: Define strict entry criteria and structural SL placement.
            Task 2: Define partial take-profit rules.
            Task 3: Provide a backtesting protocol to validate 100 historical trades."
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded border border-slate-800">
          <h3 className="text-red-400 font-bold mb-2">Psychological Checklist</h3>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
              <span>Is the SL placed behind structure, not a random pip count?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
              <span>Am I feeling FOMO, or did the price come to my POI?</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
              <span>Did I verify the lot size calculation?</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
