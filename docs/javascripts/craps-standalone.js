// Simulateur de Craps - Version standalone pour MkDocs
(function() {
  const { useState, useRef, useEffect } = React;

  function Craps() {
    const [capital, setCapital] = useState(2000);
    const [etatJeu, setEtatJeu] = useState("COME_OUT");
    const [point, setPoint] = useState(null);
    const [historique, setHistorique] = useState([
      { msg: "Bienvenue ! Saisissez vos mises dans les cases et lancez les dés. Les mises perdues sont effacées automatiquement.", type: "log-info" }
    ]);
    
    // Mises
    const [betPass, setBetPass] = useState(0);
    const [betDontPass, setBetDontPass] = useState(0);
    const [betPassOdds, setBetPassOdds] = useState(0);
    const [betDontPassOdds, setBetDontPassOdds] = useState(0);
    const [betPlace4, setBetPlace4] = useState(0);
    const [betPlace5, setBetPlace5] = useState(0);
    const [betPlace6, setBetPlace6] = useState(0);
    const [betPlace8, setBetPlace8] = useState(0);
    const [betPlace9, setBetPlace9] = useState(0);
    const [betPlace10, setBetPlace10] = useState(0);
    const [betField, setBetField] = useState(0);
    const [betAny7, setBetAny7] = useState(0);
    const [betAny11, setBetAny11] = useState(0);
    const [betAnyCraps, setBetAnyCraps] = useState(0);

    const historiqueRef = useRef(null);

    useEffect(() => {
      if (historiqueRef.current) {
        historiqueRef.current.scrollTop = historiqueRef.current.scrollHeight;
      }
    }, [historique]);

    const lancerDe = () => Math.floor(Math.random() * 6) + 1;

    const log = (msg, type = "log-info") => {
      setHistorique(prev => [...prev, { msg, type }]);
    };

    const jouerTour = () => {
      const bets = {
        pass: betPass,
        dontpass: betDontPass,
        passOdds: betPassOdds,
        dontpassOdds: betDontPassOdds,
        place4: betPlace4,
        place5: betPlace5,
        place6: betPlace6,
        place8: betPlace8,
        place9: betPlace9,
        place10: betPlace10,
        field: betField,
        any7: betAny7,
        any11: betAny11,
        anycraps: betAnyCraps
      };

      const totalMises = Object.values(bets).reduce((sum, bet) => sum + bet, 0);
      let tempCapital = capital - totalMises;

      // Lancer les dés
      const d1 = lancerDe();
      const d2 = lancerDe();
      const total = d1 + d2;
      log(`🎲 Résultat : ${d1} et ${d2} = ${total}`, "log-dice");

      let newBets = { ...bets };

      // --- FIELD ---
      if (newBets.field > 0) {
        if ([3,4,9,10,11].includes(total)) {
          tempCapital += newBets.field * 2;
          log(`GAIN : Field (1:1) (+${newBets.field} CHF)`, "log-win");
        } else if (total === 2) {
          tempCapital += newBets.field * 3;
          log(`GAIN : Field 2 (2:1) (+${newBets.field * 2} CHF)`, "log-win");
        } else if (total === 12) {
          tempCapital += newBets.field * 4;
          log(`GAIN : Field 12 (3:1) (+${newBets.field * 3} CHF)`, "log-win");
        } else {
          log(`PERTE : Field (-${newBets.field} CHF)`, "log-loss");
        }
        newBets.field = 0;
      }

      // --- ANY 7 ---
      if (newBets.any7 > 0) {
        if (total === 7) {
          const gain = newBets.any7 * 4;
          tempCapital += newBets.any7 + gain;
          log(`GAIN : Any 7 (4:1) (+${gain} CHF)`, "log-win");
        } else {
          log(`PERTE : Any 7 (-${newBets.any7} CHF)`, "log-loss");
        }
        newBets.any7 = 0;
      }

      // --- ANY 11 ---
      if (newBets.any11 > 0) {
        if (total === 11) {
          const gain = newBets.any11 * 15;
          tempCapital += newBets.any11 + gain;
          log(`GAIN : Any 11 (15:1) (+${gain} CHF)`, "log-win");
        } else {
          log(`PERTE : Any 11 (-${newBets.any11} CHF)`, "log-loss");
        }
        newBets.any11 = 0;
      }

      // --- ANY CRAPS ---
      if (newBets.anycraps > 0) {
        if ([2,3,12].includes(total)) {
          const gain = newBets.anycraps * 7;
          tempCapital += newBets.anycraps + gain;
          log(`GAIN : Any Craps (7:1) (+${gain} CHF)`, "log-win");
        } else {
          log(`PERTE : Any Craps (-${newBets.anycraps} CHF)`, "log-loss");
        }
        newBets.anycraps = 0;
      }

      // --- PLACE BETS ---
      if (total === 7) {
        [4,5,6,8,9,10].forEach(num => {
          const key = `place${num}`;
          if (newBets[key] > 0) {
            log(`PERTE : Place ${num} (7 sorti) (-${newBets[key]} CHF)`, "log-loss");
            newBets[key] = 0;
          }
        });
      } else if ([4,5,6,8,9,10].includes(total)) {
        const key = `place${total}`;
        if (newBets[key] > 0) {
          let gain = 0;
          if (total === 6 || total === 8) gain = Math.floor(newBets[key] * (7/6));
          if (total === 5 || total === 9) gain = Math.floor(newBets[key] * (7/5));
          if (total === 4 || total === 10) gain = Math.floor(newBets[key] * (9/5));
          tempCapital += newBets[key] + gain;
          log(`GAIN : Place ${total} (+${gain} CHF)`, "log-win");
        }
      }

      // --- MACHINE A ETATS ---
      let newEtat = etatJeu;
      let newPoint = point;

      if (etatJeu === "COME_OUT") {
        if (total === 7 || total === 11) {
          if (newBets.pass > 0) {
            tempCapital += newBets.pass * 2;
            log(`GAIN : Pass Line (Naturel) (+${newBets.pass} CHF)`, "log-win");
          }
          if (newBets.dontpass > 0) {
            log(`PERTE : Don't Pass (7 ou 11) (-${newBets.dontpass} CHF)`, "log-loss");
            newBets.dontpass = 0;
          }
        } else if (total === 2 || total === 3) {
          if (newBets.pass > 0) {
            log(`PERTE : Pass Line (Craps) (-${newBets.pass} CHF)`, "log-loss");
            newBets.pass = 0;
          }
          if (newBets.dontpass > 0) {
            tempCapital += newBets.dontpass * 2;
            log(`GAIN : Don't Pass (Craps) (+${newBets.dontpass} CHF)`, "log-win");
          }
        } else if (total === 12) {
          if (newBets.pass > 0) {
            log(`PERTE : Pass Line (Craps) (-${newBets.pass} CHF)`, "log-loss");
            newBets.pass = 0;
          }
          if (newBets.dontpass > 0) {
            tempCapital += newBets.dontpass;
            log(`PUSH : Don't Pass (12 sorti, égalité)`, "log-info");
          }
        } else {
          newPoint = total;
          newEtat = "POINT";
          log(`Le Point est établi à ${total}.`, "log-info");
        }
      } else if (etatJeu === "POINT") {
        if (total === point) {
          if (newBets.pass > 0) {
            tempCapital += newBets.pass * 2;
            log(`GAIN : Pass Line (Point refait) (+${newBets.pass} CHF)`, "log-win");
          }
          if (newBets.dontpass > 0) {
            log(`PERTE : Don't Pass (Point refait) (-${newBets.dontpass} CHF)`, "log-loss");
            newBets.dontpass = 0;
          }

          // Pass Odds
          if (newBets.passOdds > 0) {
            let gain = 0;
            if (point === 4 || point === 10) gain = newBets.passOdds * 2;
            if (point === 5 || point === 9) gain = Math.floor(newBets.passOdds * 1.5);
            if (point === 6 || point === 8) gain = Math.floor(newBets.passOdds * (6/5));
            tempCapital += newBets.passOdds + gain;
            log(`GAIN : Pass Odds (+${gain} CHF)`, "log-win");
          }
          if (newBets.dontpassOdds > 0) {
            log(`PERTE : Don't Pass Odds (-${newBets.dontpassOdds} CHF)`, "log-loss");
            newBets.dontpassOdds = 0;
          }

          newEtat = "COME_OUT";
          newPoint = null;
          log(`Fin du tour. Retour au Come Out Roll.`, "log-info");
        } else if (total === 7) {
          if (newBets.pass > 0) {
            log(`PERTE : Pass Line (Seven-Out) (-${newBets.pass} CHF)`, "log-loss");
            newBets.pass = 0;
          }
          if (newBets.dontpass > 0) {
            tempCapital += newBets.dontpass * 2;
            log(`GAIN : Don't Pass (Seven-Out) (+${newBets.dontpass} CHF)`, "log-win");
          }

          // Don't Pass Odds
          if (newBets.dontpassOdds > 0) {
            let gain = 0;
            if (point === 4 || point === 10) gain = Math.floor(newBets.dontpassOdds * 0.5);
            if (point === 5 || point === 9) gain = Math.floor(newBets.dontpassOdds * (2/3));
            if (point === 6 || point === 8) gain = Math.floor(newBets.dontpassOdds * (5/6));
            tempCapital += newBets.dontpassOdds + gain;
            log(`GAIN : Don't Pass Odds (+${gain} CHF)`, "log-win");
          }
          if (newBets.passOdds > 0) {
            log(`PERTE : Pass Odds (-${newBets.passOdds} CHF)`, "log-loss");
            newBets.passOdds = 0;
          }

          newEtat = "COME_OUT";
          newPoint = null;
          log(`Fin du tour. Retour au Come Out Roll.`, "log-info");
        }
      }

      // Remettre les mises restantes
      const misesRestantes = Object.values(newBets).reduce((sum, bet) => sum + bet, 0);
      tempCapital += misesRestantes;

      log("-------------------------", "log-info");

      // Mettre à jour les states
      setCapital(tempCapital);
      setEtatJeu(newEtat);
      setPoint(newPoint);
      setBetPass(newBets.pass);
      setBetDontPass(newBets.dontpass);
      setBetPassOdds(newEtat === "COME_OUT" ? 0 : newBets.passOdds);
      setBetDontPassOdds(newEtat === "COME_OUT" ? 0 : newBets.dontpassOdds);
      setBetPlace4(newBets.place4);
      setBetPlace5(newBets.place5);
      setBetPlace6(newBets.place6);
      setBetPlace8(newBets.place8);
      setBetPlace9(newBets.place9);
      setBetPlace10(newBets.place10);
      setBetField(newBets.field);
      setBetAny7(newBets.any7);
      setBetAny11(newBets.any11);
      setBetAnyCraps(newBets.anycraps);
    };

    const inPoint = etatJeu === "POINT";

    return React.createElement('div', {
      style: {
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#1e272e', // 1e272e
        color: '#d2dae2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        minHeight: '100vh'
      }
    },
      React.createElement('h1', {
        style: {
          color: '#ffffff', // 0fbcf9
          marginBottom: '5px'
        }
      }, 'Table de Craps (Avancée)'),
      
      // Info board
      React.createElement('div', {
        style: {
          backgroundColor: '#05c46b',
          color: '#1e272e',
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '1.2em',
          fontWeight: 'bold',
          marginBottom: '20px',
          width: '100%',
          maxWidth: '900px'
        }
      }, `Capital: ${capital} CHF | Phase: ${etatJeu === "COME_OUT" ? "Come Out Roll" : "Phase de Point"} | Point: ${point !== null ? point : "Aucun"}`),

      // Dashboard
      React.createElement('div', {
        style: {
          display: 'flex',
          gap: '20px',
          width: '100%',
          maxWidth: '900px',
          flexWrap: 'wrap'
        }
      },
        // Panel 1
        React.createElement('div', {
          style: {
            backgroundColor: '#2c3e50',
            padding: '15px',
            borderRadius: '8px',
            flex: 1,
            minWidth: '250px',
            border: '2px solid #3c40c6'
          }
        },
          React.createElement('div', {
            style: {
              marginBottom: '15px',
              paddingBottom: '10px',
              borderBottom: '1px solid #485460'
            }
          },
            React.createElement('h3', {
              style: {
                marginTop: 0,
                color: '#ffd32a',
                fontSize: '1.1em'
              }
            }, 'Paris de Ligne'),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }
            },
              React.createElement('label', null, 'Pass Line'),
              React.createElement('input', {
                type: 'number',
                min: 0,
                value: betPass,
                onChange: (e) => setBetPass(parseInt(e.target.value) || 0),
                disabled: inPoint,
                style: {
                  width: '60px',
                  padding: '5px',
                  backgroundColor: '#1e272e',
                  border: '1px solid #0fbcf9',
                  color: 'white',
                  fontWeight: 'bold'
                }
              })
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }
            },
              React.createElement('label', null, 'Don\'t Pass'),
              React.createElement('input', {
                type: 'number',
                min: 0,
                value: betDontPass,
                onChange: (e) => setBetDontPass(parseInt(e.target.value) || 0),
                disabled: inPoint,
                style: {
                  width: '60px',
                  padding: '5px',
                  backgroundColor: '#1e272e',
                  border: '1px solid #0fbcf9',
                  color: 'white',
                  fontWeight: 'bold'
                }
              })
            )
          ),
          React.createElement('div', null,
            React.createElement('h3', {
              style: {
                marginTop: 0,
                color: '#ffd32a',
                fontSize: '1.1em'
              }
            }, 'Odds'),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }
            },
              React.createElement('label', null, 'Pass Odds'),
              React.createElement('input', {
                type: 'number',
                min: 0,
                value: betPassOdds,
                onChange: (e) => setBetPassOdds(parseInt(e.target.value) || 0),
                disabled: !inPoint,
                style: {
                  width: '60px',
                  padding: '5px',
                  backgroundColor: '#1e272e',
                  border: '1px solid #0fbcf9',
                  color: 'white',
                  fontWeight: 'bold'
                }
              })
            ),
            React.createElement('div', {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }
            },
              React.createElement('label', null, 'Don\'t Pass Odds'),
              React.createElement('input', {
                type: 'number',
                min: 0,
                value: betDontPassOdds,
                onChange: (e) => setBetDontPassOdds(parseInt(e.target.value) || 0),
                disabled: !inPoint,
                style: {
                  width: '60px',
                  padding: '5px',
                  backgroundColor: '#1e272e',
                  border: '1px solid #0fbcf9',
                  color: 'white',
                  fontWeight: 'bold'
                }
              })
            )
          )
        ),
        // Panel 2 - Place bets
        React.createElement('div', {
          style: {
            backgroundColor: '#2c3e50',
            padding: '15px',
            borderRadius: '8px',
            flex: 1,
            minWidth: '250px',
            border: '2px solid #3c40c6'
          }
        },
          React.createElement('h3', {
            style: {
              marginTop: 0,
              color: '#ffd32a',
              fontSize: '1.1em'
            }
          }, 'Paris Place'),
          [
            { num: 4, ratio: '9:5', bet: betPlace4, set: setBetPlace4 },
            { num: 5, ratio: '7:5', bet: betPlace5, set: setBetPlace5 },
            { num: 6, ratio: '7:6', bet: betPlace6, set: setBetPlace6 },
            { num: 8, ratio: '7:6', bet: betPlace8, set: setBetPlace8 },
            { num: 9, ratio: '7:5', bet: betPlace9, set: setBetPlace9 },
            { num: 10, ratio: '9:5', bet: betPlace10, set: setBetPlace10 }
          ].map(p => 
            React.createElement('div', {
              key: p.num,
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }
            },
              React.createElement('label', null, `Place ${p.num} (${p.ratio})`),
              React.createElement('input', {
                type: 'number',
                min: 0,
                value: p.bet,
                onChange: (e) => p.set(parseInt(e.target.value) || 0),
                style: {
                  width: '60px',
                  padding: '5px',
                  backgroundColor: '#1e272e',
                  border: '1px solid #0fbcf9',
                  color: 'white',
                  fontWeight: 'bold'
                }
              })
            )
          )
        ),
        // Panel 3 - One roll bets
        React.createElement('div', {
          style: {
            backgroundColor: '#2c3e50',
            padding: '15px',
            borderRadius: '8px',
            flex: 1,
            minWidth: '250px',
            border: '2px solid #3c40c6'
          }
        },
          React.createElement('h3', {
            style: {
              marginTop: 0,
              color: '#ffd32a',
              fontSize: '1.1em'
            }
          }, 'Paris sur un Lancer'),
          [
            { label: 'Field (2,3,4,9,10,11,12)', bet: betField, set: setBetField },
            { label: 'Any 7 (4:1)', bet: betAny7, set: setBetAny7 },
            { label: 'Any 11 (15:1)', bet: betAny11, set: setBetAny11 },
            { label: 'Any Craps (7:1)', bet: betAnyCraps, set: setBetAnyCraps }
          ].map((p, i) =>
            React.createElement('div', {
              key: i,
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '5px'
              }
            },
              React.createElement('label', null, p.label),
              React.createElement('input', {
                type: 'number',
                min: 0,
                value: p.bet,
                onChange: (e) => p.set(parseInt(e.target.value) || 0),
                style: {
                  width: '60px',
                  padding: '5px',
                  backgroundColor: '#1e272e',
                  border: '1px solid #0fbcf9',
                  color: 'white',
                  fontWeight: 'bold'
                }
              })
            )
          )
        )
      ),

      // Button
      React.createElement('button', {
        onClick: jouerTour,
        style: {
          backgroundColor: '#ff3f34',
          color: 'white',
          border: 'none',
          padding: '15px',
          width: '100%',
          maxWidth: '900px',
          fontSize: '1.5em',
          cursor: 'pointer',
          borderRadius: '8px',
          fontWeight: 'bold',
          marginTop: '20px',
          transition: '0.3s'
        },
        onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#ff5e57',
        onMouseLeave: (e) => e.currentTarget.style.backgroundColor = '#ff3f34'
      }, '🎲 LANCER LES DÉS 🎲'),

      // Historique
      React.createElement('div', {
        ref: historiqueRef,
        style: {
          backgroundColor: '#1e272e',
          height: '250px',
          overflowY: 'auto',
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #485460',
          fontFamily: 'monospace',
          fontSize: '14px',
          marginTop: '20px',
          width: '100%',
          maxWidth: '900px'
        }
      },
        historique.map((entry, i) => 
          React.createElement('div', {
            key: i,
            style: {
              color: entry.type === 'log-win' ? '#05c46b' :
                     entry.type === 'log-loss' ? '#ff3f34' :
                     entry.type === 'log-dice' ? '#ffd32a' : '#0fbcf9',
              fontWeight: entry.type === 'log-dice' ? 'bold' : 'normal'
            }
          }, `> ${entry.msg}`)
        )
      )
    );
  }

  // Monter le composant
  function mountCraps() {
    const container = document.getElementById('craps-game');
    if (container && typeof ReactDOM !== 'undefined') {
      ReactDOM.render(React.createElement(Craps), container);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCraps);
  } else {
    mountCraps();
  }
})();