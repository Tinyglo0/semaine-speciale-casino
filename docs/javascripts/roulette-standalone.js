// Roulette Royale - Version standalone en pur JS pour MkDocs
// Ne nécessite AUCUNE compilation. Utilise React et ReactDOM depuis le CDN global.
(function() {
  const { useState, useEffect, createElement: e } = React;

  // --- INJECTION DU CSS GLOBAL (Scrollbar et animations) ---
  const injectStyles = () => {
    if (document.getElementById('roulette-styles')) return;
    const style = document.createElement('style');
    style.id = 'roulette-styles';
    style.innerHTML = `
      .roulette-cell { transition: background-color 0.2s, filter 0.2s; box-shadow: inset 0 2px 4px 0 rgba(0,0,0,0.1); }
      .roulette-cell:hover { filter: brightness(1.2); }
      .roulette-cell:active { filter: brightness(1.4); }
      .roulette-btn { transition: all 0.2s; transform: translateY(0); }
      .roulette-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3); }
      .roulette-btn:active:not(:disabled) { transform: translateY(0); }
      .roulette-scrollbar::-webkit-scrollbar { height: 8px; }
      .roulette-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 4px; }
      .roulette-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
      .roulette-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .animate-spin-slow { animation: spin-anim 2s linear infinite; }
      
      /* OVERRIDE MKDOCS TABLE STYLES */
      .roulette-board-table { background: transparent !important; border: none !important; margin: 0 !important; display: table !important; }
      .roulette-board-table tbody { background: transparent !important; border: none !important; }
      .roulette-board-table tr { background: transparent !important; border: none !important; }
    `;
    document.head.appendChild(style);
  };

  // --- ICÔNES SVG ---
  const IconRotate = ({ isSpinning }) => e('svg', { 
    xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 
    strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", 
    style: { width: '24px', height: '24px' },
    className: isSpinning ? 'animate-spin-slow' : ''
  }, 
    e('path', { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" }),
    e('path', { d: "M21 3v5h-5" })
  );

  const IconTrash = () => e('svg', { 
    xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", 
    strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round",
    style: { width: '20px', height: '20px' }
  }, 
    e('path', { d: "M3 6h18" }), e('path', { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }), 
    e('path', { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }), e('line', { x1: "10", y1: "11", x2: "10", y2: "17" }), 
    e('line', { x1: "14", y1: "11", x2: "14", y2: "17" })
  );

  // --- CONSTANTES ---
  const WHEEL_NUMBERS = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const CHIPS = [1, 5, 10, 25, 100, 500];

  const CHIP_COLORS = {
    1: { bg: 'white', border: '#d1d5db', text: 'black' },
    5: { bg: '#ef4444', border: '#b91c1c', text: 'white' },
    10: { bg: '#3b82f6', border: '#1e40af', text: 'white' },
    25: { bg: '#22c55e', border: '#15803d', text: 'white' },
    100: { bg: 'black', border: '#374151', text: 'white' },
    500: { bg: '#9333ea', border: '#6b21a8', text: 'white' }
  };

  // --- COMPOSANT PRINCIPAL ---
  function RouletteWidget() {
    useEffect(() => { injectStyles(); }, []);

    const [balance, setBalance] = useState(1000);
    const [bets, setBets] = useState([]);
    const [selectedChip, setSelectedChip] = useState(10);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [history, setHistory] = useState([]);
    const [message, setMessage] = useState("Faites vos jeux !");
    const [lastWin, setLastWin] = useState(0);

    const totalBet = bets.reduce((sum, bet) => sum + bet.amount, 0);

    const handleBet = (type, value) => {
      if (isSpinning) return;
      if (balance < selectedChip) {
        setMessage("Solde insuffisant !");
        return;
      }
      setBalance(prev => prev - selectedChip);
      setBets(prev => {
        const existingBetIndex = prev.findIndex(b => b.type === type && b.value === value);
        if (existingBetIndex >= 0) {
          const newBets = [...prev];
          newBets[existingBetIndex].amount += selectedChip;
          return newBets;
        }
        return [...prev, { type, value, amount: selectedChip }];
      });
      setMessage("Mise acceptée.");
    };

    const clearBets = () => {
      if (isSpinning) return;
      setBalance(prev => prev + totalBet);
      setBets([]);
      setMessage("Mises effacées. Faites vos jeux !");
      setLastWin(0);
    };

    const spin = () => {
      if (isSpinning) return;
      if (bets.length === 0) { setMessage("Veuillez placer une mise."); return; }
      
      setIsSpinning(true);
      setMessage("Rien ne va plus !");
      setLastWin(0);

      const winningIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
      const winningNum = WHEEL_NUMBERS[winningIndex];
      const targetAngle = 360 - (winningIndex * (360 / 37));
      const newRotation = wheelRotation + (1800 - (wheelRotation % 360)) + targetAngle;
      
      setWheelRotation(newRotation);

      setTimeout(() => {
        resolveBets(winningNum);
        setIsSpinning(false);
      }, 4000);
    };

    const resolveBets = (winningNum) => {
      let totalWinnings = 0;
      bets.forEach(bet => {
        const { type, value, amount } = bet;
        if (type === 'number' && value === winningNum) totalWinnings += amount * 36;
        else if (winningNum !== 0) {
          if (type === 'color') {
            const isRed = RED_NUMBERS.includes(winningNum);
            if ((value === 'red' && isRed) || (value === 'black' && !isRed)) totalWinnings += amount * 2;
          } else if (type === 'evenOdd') {
            const isEven = winningNum % 2 === 0;
            if ((value === 'even' && isEven) || (value === 'odd' && !isEven)) totalWinnings += amount * 2;
          } else if (type === 'half') {
            if ((value === '1-18' && winningNum <= 18) || (value === '19-36' && winningNum >= 19)) totalWinnings += amount * 2;
          } else if (type === 'dozen') {
            if (value === '1st12' && winningNum >= 1 && winningNum <= 12) totalWinnings += amount * 3;
            if (value === '2nd12' && winningNum >= 13 && winningNum <= 24) totalWinnings += amount * 3;
            if (value === '3rd12' && winningNum >= 25 && winningNum <= 36) totalWinnings += amount * 3;
          } else if (type === 'column') {
            if (value === 'col1' && winningNum % 3 === 1) totalWinnings += amount * 3;
            if (value === 'col2' && winningNum % 3 === 2) totalWinnings += amount * 3;
            if (value === 'col3' && winningNum % 3 === 0) totalWinnings += amount * 3;
          }
        }
      });

      const isRed = RED_NUMBERS.includes(winningNum);
      const colorStr = winningNum === 0 ? 'Vert' : (isRed ? 'Rouge' : 'Noir');
      const parityStr = winningNum === 0 ? '' : (winningNum % 2 === 0 ? 'Pair' : 'Impair');
      const halfStr = winningNum === 0 ? '' : (winningNum <= 18 ? 'Manque' : 'Passe');

      let resultMsg = `Le ${winningNum} ! (${colorStr}${parityStr ? ', ' + parityStr : ''}${halfStr ? ', ' + halfStr : ''})`;
      if (totalWinnings > 0) {
        resultMsg += ` - Vous gagnez ${totalWinnings} CHF !`;
        setBalance(prev => prev + totalWinnings);
        setLastWin(totalWinnings);
      } else { resultMsg += ` - Perdu.`; }

      setMessage(resultMsg);
      setHistory(prev => [winningNum, ...prev].slice(0, 10));
      setBets([]);
    };

    // --- SOUS-COMPOSANTS DE L'INTERFACE ---
    
    // Cellule du tapis
    const Cell = ({ label, type, value, rowSpan, colSpan, bgColor, borderRadius, fontSize = '16px', fontWeight = 'bold' }) => {
      const cellBets = bets.filter(b => b.type === type && b.value === value);
      const cellTotal = cellBets.reduce((sum, b) => sum + b.amount, 0);
      
      // Déterminer la couleur du jeton en fonction de la valeur totale sur la case
      let displayChip = 1;
      [1, 5, 10, 25, 100, 500].forEach(c => { if (cellTotal >= c) displayChip = c; });
      const chipC = CHIP_COLORS[displayChip];

      return e('td', {
        rowSpan, colSpan, onClick: () => handleBet(type, value),
        className: 'roulette-cell',
        style: {
          position: 'relative', cursor: 'pointer', userSelect: 'none',
          textAlign: 'center', verticalAlign: 'middle',
          backgroundColor: bgColor, borderRadius: borderRadius,
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px', color: 'white'
        }
      },
        e('span', { style: { display: 'block', width: '100%', fontSize, fontWeight, letterSpacing: '0.05em' } }, label),
        cellTotal > 0 && e('div', {
          style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 }
        }, e('div', {
          style: {
            width: '32px', height: '32px', borderRadius: '50%',
            border: `3px dashed ${chipC.border}`, backgroundColor: chipC.bg, color: chipC.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '12px', fontWeight: 'bold', textShadow: chipC.bg === 'white' ? 'none' : '0px 1px 2px rgba(0,0,0,0.8)',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', transform: 'scale(1.1)'
          }
        }, cellTotal))
      );
    };

    // Rendu de la roue animée
    const renderWheel = () => {
      const cx = 200, cy = 200, r = 180, anglePerWedge = 360 / 37;
      const halfAngleRad = (anglePerWedge / 2) * (Math.PI / 180);
      const d = `M ${cx} ${cy} L ${cx + r * Math.sin(-halfAngleRad)} ${cy - r * Math.cos(-halfAngleRad)} A ${r} ${r} 0 0 1 ${cx + r * Math.sin(halfAngleRad)} ${cy - r * Math.cos(halfAngleRad)} Z`;

      return e('div', { style: { position: 'relative', width: '320px', height: '320px', margin: '0 auto', filter: 'drop-shadow(0 25px 25px rgba(0,0,0,0.5))', flexShrink: 0 } },
        e('div', { style: { position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', zIndex: 10, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '20px solid #facc15', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' } }),
        e('svg', { 
          width: '100%', height: '100%', viewBox: '0 0 400 400', 
          style: { transform: `rotate(${wheelRotation}deg)`, transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)' : 'none', borderRadius: '50%', border: '8px solid #111827', backgroundColor: '#111827', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)' } 
        },
          WHEEL_NUMBERS.map((num, i) => e('g', { key: num, transform: `rotate(${i * anglePerWedge}, 200, 200)` },
            e('path', { d, fill: num === 0 ? '#16a34a' : (RED_NUMBERS.includes(num) ? '#dc2626' : '#1f2937'), stroke: 'rgba(255,255,255,0.1)', strokeWidth: '1' }),
            e('text', { x: '200', y: '40', textAnchor: 'middle', fill: 'white', fontSize: '16', fontWeight: 'bold', transform: 'rotate(0, 200, 40)' }, num)
          )),
          e('circle', { cx: '200', cy: '200', r: '130', fill: '#374151' }),
          e('circle', { cx: '200', cy: '200', r: '120', fill: '#111827', stroke: '#4b5563', strokeWidth: '4' }),
          e('circle', { cx: '200', cy: '200', r: '20', fill: '#d1d5db' })
        )
      );
    };

    // --- STRUCTURE GLOBALE ---
    return e('div', {
      style: {
        width: '100%', maxWidth: '1280px', margin: '32px auto',
        backgroundColor: '#030712', color: '#f3f4f6', display: 'flex', flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif', borderRadius: '16px', overflow: 'hidden',
        border: '1px solid #1f2937', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }
    },
      // Header
      e('header', { style: { backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
        e('h1', { style: { fontSize: '24px', fontWeight: '900', margin: 0, background: 'linear-gradient(to right, #facc15, #ca8a04)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '8px' } }, 
          e(IconRotate, { isSpinning: false }), 'Roulette Royale'
        ),
        e('div', { style: { display: 'flex', gap: '24px', alignItems: 'center' } },
          e('div', { style: { textAlign: 'right' } }, e('div', { style: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Solde'), e('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#4ade80' } }, `${balance} CHF`)),
          e('div', { style: { textAlign: 'right' } }, e('div', { style: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em' } }, 'Mise'), e('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#facc15' } }, `${totalBet} CHF`))
        )
      ),

      // Corps (Radial Gradient + Flex Layout)
      e('main', { style: { flex: 1, display: 'flex', flexDirection: window.innerWidth < 1024 ? 'column' : 'row', padding: '24px', gap: '32px', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at center, #064e3b, #030712, #030712)' } },
        
        // Colonne de gauche (Roue + Historique)
        e('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: window.innerWidth < 1024 ? '100%' : '33%' } },
          renderWheel(),
          e('div', { style: { width: '100%', maxWidth: '384px', backgroundColor: '#111827', borderRadius: '12px', padding: '16px', border: '1px solid #1f2937', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)', textAlign: 'center' } },
            e('h3', { style: { fontSize: '12px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', marginTop: 0 } }, 'Derniers numéros'),
            e('div', { style: { display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' } },
              history.length === 0 ? e('span', { style: { color: '#4b5563', fontSize: '14px' } }, 'Aucun historique') :
              history.map((num, i) => e('div', { key: i, style: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', fontSize: '14px', backgroundColor: num === 0 ? '#16a34a' : (RED_NUMBERS.includes(num) ? '#dc2626' : '#1f2937'), boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)', outline: i === 0 ? '2px solid #facc15' : 'none', transform: i === 0 ? 'scale(1.1)' : 'scale(1)', opacity: i === 0 ? 1 : 0.8 } }, num))
            )
          )
        ),

        // Colonne de droite (Tapis + Boutons)
        e('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: window.innerWidth < 1024 ? '100%' : '66%', maxWidth: '900px' } },
          
          // Bannière
          e('div', { style: { width: '100%', padding: '12px 24px', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', fontSize: '18px', border: '1px solid', backgroundColor: lastWin > 0 ? 'rgba(6,78,59,0.5)' : 'rgba(31,41,55,0.8)', borderColor: lastWin > 0 ? '#22c55e' : '#374151', color: lastWin > 0 ? '#86efac' : '#facc15', transition: 'all 0.3s' } }, message),

          // Conteneur du Tapis Scrollable
          e('div', { className: 'roulette-scrollbar', style: { width: '100%', overflowX: 'auto', paddingBottom: '16px' } },
            e('div', { style: { minWidth: '700px', backgroundColor: '#0A4A2E', padding: '16px', borderRadius: '16px', border: '4px solid #064e3b', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' } },
              e('table', { className: 'roulette-board-table', style: { width: '100%', height: '280px', borderCollapse: 'separate', borderSpacing: '4px', tableLayout: 'fixed' } },
                e('tbody', null,
                  // Ligne 1
                  e('tr', null,
                    e(Cell, { label: '0', type: 'number', value: 0, rowSpan: 5, bgColor: '#16a34a', borderRadius: '40px 6px 6px 40px', fontSize: '24px', fontWeight: '900' }),
                    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].map(num => e(Cell, { key: num, label: num, type: 'number', value: num, bgColor: RED_NUMBERS.includes(num) ? '#dc2626' : '#111827', borderRadius: '6px' })),
                    e(Cell, { label: '2:1', type: 'column', value: 'col3', bgColor: '#0f6c44', borderRadius: '6px 16px 16px 6px', fontSize: '14px' })
                  ),
                  // Ligne 2
                  e('tr', null,
                    [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].map(num => e(Cell, { key: num, label: num, type: 'number', value: num, bgColor: RED_NUMBERS.includes(num) ? '#dc2626' : '#111827', borderRadius: '6px' })),
                    e(Cell, { label: '2:1', type: 'column', value: 'col2', bgColor: '#0f6c44', borderRadius: '6px 16px 16px 6px', fontSize: '14px' })
                  ),
                  // Ligne 3
                  e('tr', null,
                    [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].map(num => e(Cell, { key: num, label: num, type: 'number', value: num, bgColor: RED_NUMBERS.includes(num) ? '#dc2626' : '#111827', borderRadius: '6px' })),
                    e(Cell, { label: '2:1', type: 'column', value: 'col1', bgColor: '#0f6c44', borderRadius: '6px 16px 16px 6px', fontSize: '14px' })
                  ),
                  // Douzaines
                  e('tr', null,
                    e(Cell, { label: '1ère Douzaine (1-12)', type: 'dozen', value: '1st12', colSpan: 4, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e(Cell, { label: '2ème Douzaine (13-24)', type: 'dozen', value: '2nd12', colSpan: 4, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e(Cell, { label: '3ème Douzaine (25-36)', type: 'dozen', value: '3rd12', colSpan: 4, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e('td', { style: { border: 0 } })
                  ),
                  // Chances Simples
                  e('tr', null,
                    e(Cell, { label: '1 à 18', type: 'half', value: '1-18', colSpan: 2, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e(Cell, { label: 'PAIR', type: 'evenOdd', value: 'even', colSpan: 2, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e(Cell, { label: '', type: 'color', value: 'red', colSpan: 2, bgColor: '#dc2626', borderRadius: '6px' }),
                    e(Cell, { label: '', type: 'color', value: 'black', colSpan: 2, bgColor: '#111827', borderRadius: '6px' }),
                    e(Cell, { label: 'IMPAIR', type: 'evenOdd', value: 'odd', colSpan: 2, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e(Cell, { label: '19 à 36', type: 'half', value: '19-36', colSpan: 2, bgColor: '#0f6c44', borderRadius: '6px' }),
                    e('td', { style: { border: 0 } })
                  )
                )
              )
            )
          ),

          // Zone des Jetons & Actions
          e('div', { style: { width: '100%', display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: '24px', backgroundColor: '#111827', padding: '16px', borderRadius: '16px', border: '1px solid #1f2937', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' } },
            // Jetons
            e('div', { style: { display: 'flex', gap: '8px' } },
              CHIPS.map(chip => {
                const colors = CHIP_COLORS[chip];
                return e('button', {
                  key: chip, onClick: () => !isSpinning && setSelectedChip(chip),
                  style: { width: '48px', height: '48px', borderRadius: '50%', border: `4px dashed ${colors.border}`, backgroundColor: colors.bg, color: colors.text, fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isSpinning ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: selectedChip === chip ? 1 : (isSpinning ? 0.5 : 0.8), transform: selectedChip === chip ? 'scale(1.15)' : 'scale(1)', outline: selectedChip === chip ? '4px solid #facc15' : 'none', outlineOffset: '2px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)' }
                }, chip);
              })
            ),
            // Boutons d'action
            e('div', { style: { display: 'flex', gap: '16px', width: window.innerWidth < 768 ? '100%' : 'auto' } },
              e('button', {
                onClick: clearBets, disabled: isSpinning || bets.length === 0, className: 'roulette-btn',
                style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: '#374151', color: 'white', border: 'none', cursor: (isSpinning || bets.length === 0) ? 'not-allowed' : 'pointer', opacity: (isSpinning || bets.length === 0) ? 0.5 : 1 }
              }, e(IconTrash), 'Effacer'),
              e('button', {
                onClick: spin, disabled: isSpinning || bets.length === 0, className: 'roulette-btn',
                style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px 32px', borderRadius: '12px', fontWeight: '900', fontSize: '18px', background: 'linear-gradient(to top, #ca8a04, #facc15)', color: '#111827', border: 'none', cursor: (isSpinning || bets.length === 0) ? 'not-allowed' : 'pointer', opacity: (isSpinning || bets.length === 0) ? 0.5 : 1, boxShadow: '0 10px 15px -3px rgba(202,138,4,0.3)' }
              }, e(IconRotate, { isSpinning }), isSpinning ? 'Tourne...' : 'JOUER !')
            )
          )
        )
      )
    );
  }

  // --- MONTAGE DU COMPOSANT DANS LE DOM ---
  function mountRoulette() {
    const container = document.getElementById('roulette-game');
    if (container && typeof ReactDOM !== 'undefined') {
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(RouletteWidget));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountRoulette);
  } else {
    mountRoulette();
  }
})();