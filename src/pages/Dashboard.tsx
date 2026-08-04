import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [balance, setBalance] = useState(() => Number(localStorage.getItem('aegis_balance')) || 53.08);
  const [missions, setMissions] = useState(() => {
    const saved = localStorage.getItem('aegis_missions');
    return saved ? JSON.parse(saved) : [];
  });

  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [tradeType, setTradeType] = useState('SHORT');
  const [note, setNote] = useState('');
  const [grade, setGrade] = useState('B');

  useEffect(() => {
    localStorage.setItem('aegis_balance', balance.toString());
    localStorage.setItem('aegis_missions', JSON.stringify(missions));
  }, [balance, missions]);

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

  const handleLogMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!entry || !stopLoss) return;

    const newMission = {
      id: Date.now(),
      type: tradeType,
      entry: Number(entry),
      sl: Number(stopLoss),
      tp: Number(takeProfit || 0),
      lot: lotSize > 0 ? lotSize : 0.01,
      status: 'OPEN',
      grade: grade,
      note: note || 'PDH Sweep Execution'
    };

    setMissions([newMission, ...missions]);
    setEntry('');
    setStopLoss('');
    setTakeProfit('');
    setNote('');
  };

  const closedTrades = missions.filter((m: any) => m.status === 'CLOSED');
  const winCount = closedTrades.filter((m: any) => m.pnl > 0).length;
  const winRate = closedTrades.length > 0 ? Math.round((winCount / closedTrades.length) * 100) : 100;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32 px-4 pt-4 max-w-xl mx-auto font-sans">
      
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Aegis OS</h1>
          <p className="text-xs text-slate-400">XAUUSD Active Terminal</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Equity Balance ($)</div>
          <input 
            type="number" 
            value={balance} 
            onChange={(e) => setBalance(Number(e.target.value))}
            className="bg-slate-900 text-yellow-400 font-mono text-sm font-bold w-24 text-right border border-slate-800 rounded px-1 outline-none focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Missions</div>
          <div className="text-lg font-bold text-white">{missions.length}</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Win Rate</div>
          <div className="text-lg font-bold text-green-400">{winRate}%</div>
        </div>
        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">1% Risk</div>
          <div className="text-lg font-bold text-red-400">-${riskAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Log Form */}
      <form onSubmit={handleLogMission} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-3 mb-6">
        <h2 className="text-sm font-bold text-yellow-500 uppercase tracking-wider">Log Current Position</h2>
        
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
            <label className="block text-[11px] text-slate-400 mb-1">Grade</label>
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
              type="number" step="0.001" value={entry} onChange={(e) => setEntry(e.target.value)} placeholder="4079.56"
              className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs font-mono text-white outline-none focus:border-yellow-500"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Stop Loss</label>
            <input 
              type="number" step="0.001" value={stopLoss} onChange={(e) => setStopLoss(e.target.value)} placeholder="4086.05"
              className="w-full bg-slate-950 border border-red-900/50 rounded p-2 text-xs font-mono text-white outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">Take Profit</label>
            <input 
              type="number" step="0.001" value={takeProfit} onChange={(e) => setTakeProfit(e.target.value)} placeholder="4043.59"
              className="w-full bg-slate-950 border border-green-900/50 rounded p-2 text-xs font-mono text-white outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] text-slate-400 mb-1">Psychology & Setup Notes</label>
          <input 
            type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="PDH sweep executed..."
            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-xs text-white outline-none"
          />
        </div>

        <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded border border-slate-800 text-xs">
          <div>Lot Size: <span className="text-yellow-400 font-mono font-bold text-sm">{lotSize > 0 ? lotSize : '0.01'}</span></div>
          <div>Est R:R: <span className="text-blue-400 font-mono font-bold">1:{rrRatio > 0 ? rrRatio : '0.0'}</span></div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold py-2 rounded text-xs tracking-wider uppercase transition-all"
        >
          Save Mission to Ledger
        </button>
      </form>

      {/* Ledger Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recorded Missions</h3>
        {missions.length === 0 ? (
          <div className="text-center text-xs text-slate-500 py-6 bg-slate-900/50 rounded-xl border border-slate-800">
            No missions recorded yet. Log your active trade above.
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
                <div className="text-[11px] text-blue-400">SL: {m.sl}</div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}