import React, { useState, useEffect } from 'react';

export default function RiskManager() {
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('aegis_balance')) || 5000);
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [tradeType, setTradeType] = useState('LONG');

  useEffect(() => {
    localStorage.setItem('aegis_balance', balance);
  }, [balance]);
  
  const riskPercent = 1; 
  const riskAmount = balance * (riskPercent / 100);
  
  let lotSize = 0;
  let rrRatio = 0;
  let potentialProfit = 0;
  let pointDistance = 0;

  if (entry && stopLoss && Number(entry) !== Number(stopLoss)) {
    // Gold Math: $1 move = 100 pips. 1 Standard Lot = $10 per pip ($100 per $1 move)
    pointDistance = Math.abs(Number(entry) - Number(stopLoss));
    const riskPerStandardLot = pointDistance * 100; 
    
    if (riskPerStandardLot > 0) {
      lotSize = riskAmount / riskPerStandardLot;
    }
  }

  if (entry && stopLoss && takeProfit) {
    const profitDiff = Math.abs(Number(takeProfit) - Number(entry));
    if (pointDistance > 0) rrRatio = profitDiff / pointDistance;
    potentialProfit = lotSize * profitDiff * 100;
  }

  return (
    <div className="w-full bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800 font-sans">
      <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-yellow-500 tracking-tight flex items-center gap-2">
            XAUUSD Execution Desk
          </h2>
          <p className="text-slate-400 text-xs mt-1">1% Risk Locked | 1 Lot = 100 oz</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Balance & Type */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-slate-400 mb-1">Account Balance ($)</label>
            <input 
              type="number" value={balance} onChange={(e) => setBalance(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div className="w-1/3">
            <label className="block text-xs text-slate-400 mb-1">Direction</label>
            <select 
              value={tradeType} onChange={(e) => setTradeType(e.target.value)}
              className={`w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none font-bold ${tradeType === 'LONG' ? 'text-green-500' : 'text-red-500'}`}
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>
        </div>

        {/* Price Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Entry Price</label>
            <input type="number" value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="2400.00" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white outline-none" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Stop Loss</label>
            <input type="number" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="2398.50" className="w-full bg-slate-950 border border-red-900/50 rounded p-2 text-white outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Take Profit Target</label>
          <input type="number" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="2405.00" className="w-full bg-slate-950 border border-green-900/50 rounded p-2 text-white outline-none" />
        </div>
        
        {/* Output Console */}
        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 mt-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Max Risk (1%)</span>
            <span className="text-red-400 font-mono">-${riskAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">SL Distance</span>
            <span className="text-slate-300 font-mono">{pointDistance.toFixed(2)} points</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-y border-slate-800 my-2">
            <span className="text-yellow-500 font-bold">Lot Size</span>
            <span className="text-white font-mono text-2xl font-bold bg-yellow-900/30 px-2 rounded border border-yellow-700/50">
              {lotSize > 0 ? lotSize.toFixed(2) : '0.00'}
            </span>
          </div>

          {takeProfit && stopLoss && entry && (
            <div className="flex justify-between items-center text-sm pt-1">
               <span className="text-slate-400">Reward: <span className="text-blue-400 font-mono">1:{rrRatio.toFixed(2)}</span></span>
               <span className="text-slate-400">Profit: <span className="text-green-400 font-mono">+${potentialProfit.toFixed(2)}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
