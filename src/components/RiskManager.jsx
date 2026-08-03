import React, { useState, useEffect } from 'react';

export default function RiskManager() {
  const [balance, setBalance] = useState<number>(() => Number(localStorage.getItem('aegis_balance')) || 53.08);
  const [entry, setEntry] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [tradeType, setTradeType] = useState<'LONG' | 'SHORT'>('LONG');

  useEffect(() => {
    localStorage.setItem('aegis_balance', balance.toString());
  }, [balance]);
  
  const riskPercent = 1; // Strict 1% risk rule
  const riskAmount = balance * (riskPercent / 100);
  
  let lotSize = 0;
  let rrRatio = 0;
  let potentialProfit = 0;
  let pointDistance = 0;

  if (entry && stopLoss && Number(entry) !== Number(stopLoss)) {
    pointDistance = Math.abs(Number(entry) - Number(stopLoss));
    // XAUUSD: 1 Standard Lot (100 oz) -> $1 move = $100 profit/loss.
    const riskPerStandardLot = pointDistance * 100;
    
    if (riskPerStandardLot > 0) {
      const rawLot = riskAmount / riskPerStandardLot;
      // Enforce standard broker minimum lot size of 0.01
      lotSize = Math.max(0.01, Number(rawLot.toFixed(2)));
    }
  }

  if (entry && stopLoss && takeProfit) {
    const profitDiff = Math.abs(Number(takeProfit) - Number(entry));
    if (pointDistance > 0) rrRatio = profitDiff / pointDistance;
    potentialProfit = lotSize * profitDiff * 100;
  }

  return (
    <div className="w-full bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800 font-sans p-5 text-white">
      <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-yellow-500 tracking-tight">XAUUSDm Execution Desk</h2>
          <p className="text-slate-400 text-xs">Strict 1% Risk Enforced (Min 0.01 Lot)</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Balance & Direction */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">Account Balance ($)</label>
            <input 
              type="number" 
              value={balance} 
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-yellow-500 font-mono"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs text-slate-400 mb-1">Direction</label>
            <select 
              value={tradeType} 
              onChange={(e) => setTradeType(e.target.value as 'LONG' | 'SHORT')}
              className={`w-full bg-slate-950 border border-slate-700 rounded p-2 outline-none font-bold ${tradeType === 'LONG' ? 'text-green-500' : 'text-red-500'}`}
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>
        </div>

        {/* Entry / Stop Loss with 3-decimal step support */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Entry Price</label>
            <input 
              type="number" 
              step="0.001"
              value={entry} 
              onChange={(e) => setEntry(e.target.value)} 
              placeholder="4077.731" 
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none font-mono" 
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Stop Loss</label>
            <input 
              type="number" 
              step="0.001"
              value={stopLoss} 
              onChange={(e) => setStopLoss(e.target.value)} 
              placeholder="4070.819" 
              className="w-full bg-slate-950 border border-red-900/50 rounded p-2 text-white outline-none font-mono" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Take Profit Target</label>
          <input 
            type="number" 
            step="0.001"
            value={takeProfit} 
            onChange={(e) => setTakeProfit(e.target.value)} 
            placeholder="4051.727" 
            className="w-full bg-slate-950 border border-green-900/50 rounded p-2 text-white outline-none font-mono" 
          />
        </div>

        {/* Results Box */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Max Risk (1%)</span>
            <span className="text-red-400 font-mono">-${riskAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-y border-slate-800 my-2">
            <span className="text-yellow-500 font-bold">Recommended Lot Size</span>
            <span className="text-white font-mono text-2xl font-bold bg-yellow-900/30 px-3 py-1 rounded border border-yellow-700/50">
              {lotSize > 0 ? lotSize.toFixed(2) : '0.00'}
            </span>
          </div>

          {takeProfit && stopLoss && entry && (
            <div className="flex justify-between items-center text-sm pt-1">
              <span className="text-slate-400">R:R Ratio: <span className="text-blue-400 font-mono">1:{rrRatio.toFixed(2)}</span></span>
              <span className="text-slate-400">Est. Profit: <span className="text-green-400 font-mono">+${potentialProfit.toFixed(2)}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}