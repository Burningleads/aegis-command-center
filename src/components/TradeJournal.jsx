import React, { useState, useEffect } from 'react';

export default function TradeJournal() {
  const [trades, setTrades] = useState(() => {
    const savedTrades = localStorage.getItem('aegis_trades');
    return savedTrades ? JSON.parse(savedTrades) : [];
  });
  
  const [newTrade, setNewTrade] = useState({
    ticker: '',
    type: 'LONG',
    result: 'WIN',
    pnl: '',
    rMultiple: '',
    notes: ''
  });

  // Save trades to local storage whenever the array changes
  useEffect(() => {
    localStorage.setItem('aegis_trades', JSON.stringify(trades));
  }, [trades]);

  const handleAddTrade = (e) => {
    e.preventDefault();
    if (!newTrade.ticker || !newTrade.pnl) return;

    const tradeRecord = {
      ...newTrade,
      id: Date.now(),
      date: new Date().toLocaleDateString(),
    };

    setTrades([tradeRecord, ...trades]);
    setNewTrade({ ticker: '', type: 'LONG', result: 'WIN', pnl: '', rMultiple: '', notes: '' }); // Reset form
  };

  const deleteTrade = (id) => {
    setTrades(trades.filter(trade => trade.id !== id));
  };

  // Calculate Stats
  const totalTrades = trades.length;
  const wins = trades.filter(t => t.result === 'WIN').length;
  const winRate = totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;
  const netPnl = trades.reduce((acc, curr) => acc + Number(curr.pnl), 0);

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-800 font-sans mt-8 lg:mt-0">
      
      {/* Header & Stats Banner */}
      <div className="bg-slate-800 p-5 border-b border-slate-700">
        <h2 className="text-xl font-bold tracking-tight text-white mb-4">Command Ledger</h2>
        
        <div className="grid grid-cols-3 gap-4 text-center">
           <div className="bg-slate-900 p-3 rounded border border-slate-700">
             <span className="block text-slate-400 text-xs uppercase">Win Rate</span>
             <span className={`font-mono text-lg font-bold ${winRate >= 50 ? 'text-green-400' : 'text-yellow-500'}`}>{winRate}%</span>
           </div>
           <div className="bg-slate-900 p-3 rounded border border-slate-700">
             <span className="block text-slate-400 text-xs uppercase">Total Trades</span>
             <span className="font-mono text-lg font-bold text-white">{totalTrades}</span>
           </div>
           <div className="bg-slate-900 p-3 rounded border border-slate-700">
             <span className="block text-slate-400 text-xs uppercase">Net PnL</span>
             <span className={`font-mono text-lg font-bold ${netPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
               {netPnl >= 0 ? '+' : '-'}${Math.abs(netPnl).toFixed(2)}
             </span>
           </div>
        </div>
      </div>

      <div className="p-5">
        {/* Add Trade Form */}
        <form onSubmit={handleAddTrade} className="bg-slate-950 p-4 rounded-lg border border-slate-800 mb-6 space-y-4">
          <h3 className="text-sm font-medium text-slate-300 border-b border-slate-800 pb-2">Log New Trade</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <input 
                type="text" placeholder="Ticker (e.g. BTC)" required
                value={newTrade.ticker} onChange={e => setNewTrade({...newTrade, ticker: e.target.value.toUpperCase()})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white uppercase focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <select 
                value={newTrade.type} onChange={e => setNewTrade({...newTrade, type: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="LONG">LONG</option>
                <option value="SHORT">SHORT</option>
              </select>
            </div>
            <div>
               <select 
                value={newTrade.result} onChange={e => setNewTrade({...newTrade, result: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              >
                <option value="WIN">WIN</option>
                <option value="LOSS">LOSS</option>
                <option value="BREAK EVEN">B.E.</option>
              </select>
            </div>
            <div>
              <input 
                type="number" placeholder="PnL ($)" required
                value={newTrade.pnl} onChange={e => setNewTrade({...newTrade, pnl: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <input 
              type="text" placeholder="Notes (e.g. 'Stuck to plan')" 
              value={newTrade.notes} onChange={e => setNewTrade({...newTrade, notes: e.target.value})}
              className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none"
            />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors">
              Save
            </button>
          </div>
        </form>

        {/* Trade History List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {trades.length === 0 ? (
            <p className="text-slate-500 text-center text-sm py-4">No trades logged yet. Execute the plan.</p>
          ) : (
            trades.map(trade => (
              <div key={trade.id} className="bg-slate-950 border border-slate-800 rounded p-3 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                   <div className={`w-2 h-8 rounded-full ${trade.result === 'WIN' ? 'bg-green-500' : trade.result === 'LOSS' ? 'bg-red-500' : 'bg-slate-500'}`}></div>
                   <div>
                     <div className="flex items-center gap-2">
                       <span className="font-bold text-white">{trade.ticker}</span>
                       <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">{trade.type}</span>
                     </div>
                     <span className="text-xs text-slate-500">{trade.date} • {trade.notes || 'No notes'}</span>
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`font-mono font-medium ${Number(trade.pnl) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(trade.pnl) >= 0 ? '+' : ''}${trade.pnl}
                  </span>
                  <button onClick={() => deleteTrade(trade.id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
