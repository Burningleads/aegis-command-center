import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  // Persistent state for account equity and trade journal history
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('aegis_balance')) || 53.08);
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('aegis_missions');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'SHORT', entry: 4077.731, sl: 4070.819, tp: 4051.727, lot: 0.01, pnl: 53.08, status: 'CLOSED', grade: 'A', note: 'Clean liquidity sweep.' }
    ];
  });

  // Form input states for logging a new mission
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [tradeType, setTradeType] = useState('SHORT');
  const [note, setNote] = useState('');
  const [grade, setGrade] = useState('A');

  useEffect(() => {
    localStorage.setItem('aegis_balance', balance.toString());
    localStorage.setItem('aegis_missions', JSON.stringify(missions));
  }, [balance, missions]);

  // Risk Math Calculations (Strict 1% rule for XAUUSDm 3-decimal)
  const riskAmount = balance * 0.01;
  let pointDistance = 0;
  let lotSize = 0;
  let rrRatio = 0;

  if (entry && stopLoss && Number(entry) !== Number(stopLoss)) {
    pointDistance = Math.abs(Number(entry) - Number(stopLoss));
    const riskPerStandardLot = pointDistance * 100;
    if (riskPerStandardLot > 0) {
      lotSize = Math.max(0.01, Number((riskAmount / riskPerStandardLot).toFixed(2)));
    }
  }

  if (entry && stopLoss && takeProfit) {
    const profitDiff = Math.abs(Number(takeProfit) - Number(entry));
    if (pointDistance > 0) rrRatio = Number((profitDiff / pointDistance).toFixed(2));
  }

  // Handle logging the mission into the journal ledger
  const handleLogMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !stopLoss) return;

    const newMission = {
      id: Date.now(),
      type: tradeType,
      entry: Number(entry),
      sl: Number(stopLoss),
      tp: Number(takeProfit || 0),
      lot: lotSize,
      pnl: 0, // Active or pending PnL
      status: 'OPEN',
      grade: grade,
      note: note || 'Rule-compliant setup'
    };

    setMissions([newMission, ...missions]);
    // Reset form fields
    setEntry('');
    setStopLoss('');
    setTakeProfit('');
    setNote('');
  };

  // Calculate Win Rate & Metrics dynamically
  const closedTrades = missions.filter((m: any) => m.status === 'CLOSED');
  const winCount = closedTrades.filter((m: any) => m.pnl > 0).length;
  const winRate = closedTrades.length > 0 ? Math.round((winCount / closedTrades.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 px-4 pt-4 max-w-xl mx-auto font-sans">
      
      {/* Top Branding Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Aegis OS</h1>
          <p className="text-xs text-slate-400">XAUUSD Decision & Journal Engine</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Equity Balance</div>
          <input 
            type="number" 
            value={balance} 
            onChange={(e) => setBalance(Number(e.target.value))}
            className="bg-slate-900 text-yellow-400 font-mono text-sm font-bold w-24 text-right border border-slate-800 rounded px-1 outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Active Missions</div>
          <div className="text-lg font-bold text-white">{missions.filter((m: any) => m.status === 'OPEN').length}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Win Rate</div>
          <div className="text-lg font-bold text-green-400">{winRate}%</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Max Risk (1%)</div>
          <div className="text-lg font-bold text-red-400">-${riskAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Mission Execution & Logging Form */}
      <form onSubmit={handleLogMission} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 mb-6">
        <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-wider">Log New Trading Mission</h2>
        
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-[11px] text-slate-400 mb-1">Direction</label>
            <select 
              value={tradeType} 
              onChange={(e) => setTradeType(e.target.value)}
              className={`w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-bold outline-none ${tradeType === 'LONG' ? 'text-green-500' : 'text-red-500'}`}
            >
              <option value="LONG">LONG (BUY)</option>
              <option value="SHORT">SHORT (SELL)</option>
            </select>
          </div>
          <div className="w-1/3">
            <label className="block text-[11px] text-slate-400 mb-1">Execution Grade</label>
            <select 
              value={grade} 
              onChange={(e) => setGrade(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white font-bold outline-none"
            >
              <option value="A">Grade A</option>
              <option value="B">Grade B</option>
              <option value="C">Grade C</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Entry Price</label>
            <input 
              type="number" step="0.001" placeholder="4077.731" value={entry} onChange={(e) => setEntry(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-white outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Stop Loss</label>
            <input 
              type="number" step="0.001" placeholder="4070.819" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)}
              className="w-full bg-slate-950 border border-red-900/50 rounded p-2 text-xs font-mono text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Take Profit</label>
            <input 
              type="number" step="0.001" placeholder="4051.727" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)}
              className="w-full bg-slate-950 border border-green-900/50 rounded p-2 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Trading Notes & Psychology</label>
          <input 
            type="text" placeholder="Reasoning, structural setup, liquidity sweep..." value={note} onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none"
          />
        </div>

        {/* Dynamic Calculator Output inside Form */}
        <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
          <div>Lot Size: <span className="text-yellow-400 font-mono font-bold text-sm">{lotSize > 0 ? lotSize : '0.00'}</span></div>
          <div>Est R:R: <span className="text-blue-400 font-mono font-bold">1:{rrRatio > 0 ? rrRatio : '0.0'}</span></div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2 rounded text-xs tracking-wider uppercase transition-all"
        >
          Execute & Log Mission
        </button>
      </form>

      {/* Mission History / Journal Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mission Ledger</h3>
        {missions.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-6 bg-slate-900/50 rounded-xl border border-slate-800">
            No missions recorded yet. Log your first setup above.
          </div>
        ) : (
          missions.map((m: any) => (
            <div key={m.id} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${m.type === 'LONG' ? 'bg-green-900/40 text-green-400' : 'bg-red-900/40 text-red-400'}`}>
                    {m.type}
                  </span>
                  <span className="font-mono text-slate-300">Entry: {m.entry}</span>
                  <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-400">Grade {m.grade}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 italic">{m.note}</div>
              </div>
              <div className="text-right font-mono">
                <div className="text-yellow-500 font-bold">{m.lot} lots</div>
                <div className={`text-[11px] ${m.status === 'OPEN' ? 'text-blue-400' : 'text-slate-400'}`}>{m.status}</div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}