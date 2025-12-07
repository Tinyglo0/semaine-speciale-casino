// Version standalone pour MkDocs - Roulette Royale
(function() {
  const { useState, useEffect } = React;

  // --- Constantes & Données ---
  const WHEEL_NUMBERS = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const COLORS = {
    0: 'green',
    1: 'red', 2: 'black', 3: 'red', 4: 'black', 5: 'red', 6: 'black',
    7: 'red', 8: 'black', 9: 'red', 10: 'black', 11: 'black', 12: 'red',
    13: 'black', 14: 'red', 15: 'black', 16: 'red', 17: 'black', 18: 'red',
    19: 'red', 20: 'black', 21: 'red', 22: 'black', 23: 'red', 24: 'black',
    25: 'red', 26: 'black', 27: 'red', 28: 'black', 29: 'black', 30: 'red',
    31: 'black', 32: 'red', 33: 'black', 34: 'red', 35: 'black', 36: 'red',
  };

  const PAYOUTS = {
    straight: 35,
    split: 17,
    color: 1,
    parity: 1,
    dozen: 2,
    half: 1,
  };

  const CHIP_VALUES = [1, 5, 10, 25, 100];

  // --- Composant Principal ---
  function Roulette() {
    const [balance, setBalance] = useState(1000);
    const [currentBets, setCurrentBets] = useState({});
    const [lastWin, setLastWin] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [wheelRotation, setWheelRotation] = useState(0);
    const [lastNumber, setLastNumber] = useState(null);
    const [history, setHistory] = useState([]);
    const [selectedChip, setSelectedChip] = useState(10);
    const [message, setMessage] = useState("Faites vos jeux !");

    const placeBet = (betId, type, value = null) => {
      if (spinning) return;
      if (balance < selectedChip) {
        setMessage("Solde insuffisant !");
        return;
      }

      setBalance(prev => prev - selectedChip);
      setCurrentBets(prev => {
        const newBets = { ...prev };
        const existingAmount = newBets[betId]?.amount || 0;
        newBets[betId] = {
          amount: existingAmount + selectedChip,
          type: type,
          value: value
        };
        return newBets;
      });
      setMessage("Mise placée.");
    };

    const clearBets = () => {
      if (spinning) return;
      let refund = 0;
      Object.values(currentBets).forEach(bet => refund += bet.amount);
      setBalance(prev => prev + refund);
      setCurrentBets({});
      setMessage("Mises effacées.");
    };

    const spinWheel = () => {
      if (spinning) return;
      if (Object.keys(currentBets).length === 0) {
        setMessage("Veuillez placer une mise d'abord.");
        return;
      }

      setSpinning(true);
      setMessage("Rien ne va plus !");
      setLastWin(0);

      const randomIndex = Math.floor(Math.random() * WHEEL_NUMBERS.length);
      const winningNum = WHEEL_NUMBERS[randomIndex];

      const segmentAngle = 360 / 37;
      const targetAngle = randomIndex * segmentAngle;
      const currentAngle = wheelRotation % 360;
      const distanceToTarget = (targetAngle - currentAngle + 360) % 360;
      const spinAdjust = (360 * 5) + distanceToTarget;
      const newRotation = wheelRotation + spinAdjust;

      setWheelRotation(newRotation);

      setTimeout(() => {
        resolveGame(winningNum);
        setSpinning(false);
      }, 3500);
    };

    const resolveGame = (winningNum) => {
      setLastNumber(winningNum);
      setHistory(prev => [winningNum, ...prev].slice(0, 10));

      let totalWinnings = 0;
      const winningColor = COLORS[winningNum];
      const isEven = winningNum !== 0 && winningNum % 2 === 0;
      const isOdd = winningNum !== 0 && winningNum % 2 !== 0;

      Object.entries(currentBets).forEach(([key, bet]) => {
        let win = false;

        switch (bet.type) {
          case 'straight':
            if (bet.value === winningNum) win = true;
            break;
          case 'color':
            if (bet.value === winningColor) win = true;
            break;
          case 'parity':
            if (bet.value === 'even' && isEven) win = true;
            if (bet.value === 'odd' && isOdd) win = true;
            break;
          case 'dozen':
            if (bet.value === 1 && winningNum >= 1 && winningNum <= 12) win = true;
            if (bet.value === 2 && winningNum >= 13 && winningNum <= 24) win = true;
            if (bet.value === 3 && winningNum >= 25 && winningNum <= 36) win = true;
            break;
          case 'half':
            if (bet.value === 'low' && winningNum >= 1 && winningNum <= 18) win = true;
            if (bet.value === 'high' && winningNum >= 19 && winningNum <= 36) win = true;
            break;
          default:
            break;
        }

        if (win) {
          const payoutMultiplier = PAYOUTS[bet.type];
          totalWinnings += bet.amount * (payoutMultiplier + 1);
        }
      });

      if (totalWinnings > 0) {
        setBalance(prev => prev + totalWinnings);
        setLastWin(totalWinnings);
        setMessage(`Gagné ! Numéro ${winningNum} (${winningColor === 'red' ? 'Rouge' : winningColor === 'black' ? 'Noir' : 'Vert'})`);
      } else {
        setMessage(`Perdu. Le numéro était ${winningNum}.`);
      }

      setCurrentBets({});
    };

    const renderNumberCell = (num) => {
      const isRed = COLORS[num] === 'red';
      const betId = `n-${num}`;
      const betAmount = currentBets[betId]?.amount;

      return React.createElement('button', {
        key: num,
        onClick: () => placeBet(betId, 'straight', num),
        style: {
          position: 'relative',
          height: '64px',
          width: '100%',
          backgroundColor: isRed ? '#dc2626' : '#0f172a',
          border: '1px solid rgba(202, 138, 4, 0.3)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s',
          cursor: 'pointer'
        },
        onMouseEnter: (e) => e.currentTarget.style.backgroundColor = isRed ? '#ef4444' : '#1e293b',
        onMouseLeave: (e) => e.currentTarget.style.backgroundColor = isRed ? '#dc2626' : '#0f172a'
      },
        num,
        betAmount && React.createElement('div', {
          style: {
            position: 'absolute',
            zIndex: 10,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#facc15',
            border: '2px dashed white',
            color: 'black',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-8px)'
          }
        }, betAmount)
      );
    };

    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        backgroundColor: '#14532d',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 16px',
        userSelect: 'none'
      }
    },
      // En-tête
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          backgroundColor: 'rgba(5, 46, 22, 0.5)',
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(202, 138, 4, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(4px)'
        }
      },
        React.createElement('div', {
          style: { display: 'flex', alignItems: 'center', gap: '16px' }
        },
          React.createElement('div', {
            style: {
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid rgba(234, 179, 8, 0.2)'
            }
          },
            React.createElement('p', {
              style: {
                color: '#eab308',
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 'bold',
                marginBottom: '4px'
              }
            }, 'Solde'),
            React.createElement('div', {
              style: {
                fontSize: '24px',
                fontFamily: 'monospace',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }
            }, '$', balance)
          ),
          lastWin > 0 && React.createElement('div', {
            style: {
              backgroundColor: 'rgba(234, 179, 8, 0.2)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #eab308',
              color: '#fde047',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            React.createElement('span', { style: { fontWeight: 'bold' } }, `Gain: +${lastWin}`)
          )
        ),
        React.createElement('h1', {
          style: {
            fontSize: '36px',
            fontFamily: 'serif',
            color: '#eab308',
            letterSpacing: '0.1em',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            display: window.innerWidth < 768 ? 'none' : 'block'
          }
        }, 'ROULETTE ROYALE'),
        React.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflow: 'hidden',
            maxWidth: '200px',
            justifyContent: 'flex-end'
          }
        },
          history.map((num, i) => {
            const color = COLORS[num];
            return React.createElement('div', {
              key: i,
              style: {
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                flexShrink: 0,
                backgroundColor: color === 'red' ? '#dc2626' : color === 'black' ? '#0f172a' : '#16a34a'
              }
            }, num);
          })
        )
      ),
      // Contenu principal
      React.createElement('div', {
        style: {
          width: '100%',
          maxWidth: '1280px',
          display: 'flex',
          flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
          gap: '32px',
          alignItems: window.innerWidth < 1024 ? 'center' : 'flex-start'
        }
      },
        // Roue
        React.createElement('div', {
          style: {
            position: 'relative',
            width: window.innerWidth < 640 ? '320px' : '384px',
            height: window.innerWidth < 640 ? '320px' : '384px',
            flexShrink: 0
          }
        },
          // Indicateur
          React.createElement('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 20,
              width: 0,
              height: 0,
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '20px solid #facc15',
              filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04))'
            }
          }),
          // Cercle tournant
          React.createElement('div', {
            style: {
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              border: '8px solid #a16207',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              backgroundColor: 'black',
              position: 'relative',
              transform: `rotate(-${wheelRotation}deg)`,
              transition: 'transform 3500ms cubic-bezier(0.25,0.1,0.25,1)'
            }
          },
            WHEEL_NUMBERS.map((num, i) => {
              const angle = (360 / WHEEL_NUMBERS.length) * i;
              const color = COLORS[num];
              return React.createElement('div', {
                key: i,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  height: '50%',
                  transformOrigin: 'bottom',
                  display: 'flex',
                  justifyContent: 'center',
                  paddingTop: '8px',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                  width: `${360/37}%`
                }
              },
                React.createElement('span', {
                  style: {
                    display: 'block',
                    width: '24px',
                    height: '80px',
                    textAlign: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    paddingTop: '4px',
                    color: color === 'red' ? '#ef4444' : color === 'black' ? '#cbd5e1' : '#22c55e'
                  }
                }, num),
                React.createElement('div', {
                  style: {
                    position: 'absolute',
                    top: '32px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: color === 'red' ? '#dc2626' : color === 'black' ? '#1e293b' : '#16a34a'
                  }
                })
              );
            }),
            // Centre
            React.createElement('div', {
              style: {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '33%',
                height: '33%',
                borderRadius: '50%',
                background: 'linear-gradient(to bottom right, #ca8a04, #a16207)',
                border: '4px solid #eab308',
                boxShadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
              }
            },
              React.createElement('div', {
                style: {
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#fef08a',
                  borderRadius: '50%'
                }
              })
            )
          )
        ),
        // Zone de jeu
        React.createElement('div', {
          style: {
            flex: 1,
            width: '100%',
            backgroundColor: 'rgba(22, 101, 52, 0.9)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(202, 138, 4, 0.3)',
            backdropFilter: 'blur(4px)'
          }
        },
          React.createElement('div', {
            style: {
              textAlign: 'center',
              marginBottom: '16px',
              color: '#fef08a',
              fontWeight: '500',
              height: '24px'
            }
          }, message),
          React.createElement('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              userSelect: 'none'
            }
          },
            // Grille principale
            React.createElement('div', { style: { display: 'flex' } },
              // Zéro
              React.createElement('button', {
                onClick: () => placeBet('n-0', 'straight', 0),
                style: {
                  width: '48px',
                  backgroundColor: '#15803d',
                  border: '1px solid rgba(202, 138, 4, 0.3)',
                  borderRadius: '8px 0 0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  position: 'relative',
                  cursor: 'pointer'
                },
                onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#16a34a',
                onMouseLeave: (e) => e.currentTarget.style.backgroundColor = '#15803d'
              },
                React.createElement('span', { style: { transform: 'rotate(-90deg)' } }, '0'),
                currentBets['n-0'] && React.createElement('div', {
                  style: {
                    position: 'absolute',
                    zIndex: 10,
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#facc15',
                    color: 'black',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid white'
                  }
                }, currentBets['n-0'].amount)
              ),
              React.createElement('div', { style: { flex: 1 } },
                // Grille 1-36
                React.createElement('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    gap: '1px',
                    backgroundColor: 'rgba(202, 138, 4, 0.3)',
                    borderTop: '1px solid rgba(202, 138, 4, 0.3)',
                    borderRight: '1px solid rgba(202, 138, 4, 0.3)',
                    borderBottom: '1px solid rgba(202, 138, 4, 0.3)'
                  }
                },
                  [3,6,9,12,15,18,21,24,27,30,33,36].map(n => renderNumberCell(n)),
                  [2,5,8,11,14,17,20,23,26,29,32,35].map(n => renderNumberCell(n)),
                  [1,4,7,10,13,16,19,22,25,28,31,34].map(n => renderNumberCell(n))
                ),
                // Douzaines
                React.createElement('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1px',
                    marginTop: '1px',
                    height: '48px'
                  }
                },
                  [
                    { label: "1ère 12", val: 1 },
                    { label: "2ème 12", val: 2 },
                    { label: "3ème 12", val: 3 }
                  ].map((d) => React.createElement('button', {
                    key: d.val,
                    onClick: () => placeBet(`dozen-${d.val}`, 'dozen', d.val),
                    style: {
                      backgroundColor: 'rgba(20, 83, 45, 0.5)',
                      border: '1px solid rgba(202, 138, 4, 0.3)',
                      color: '#fef3c7',
                      fontSize: '14px',
                      fontWeight: '600',
                      position: 'relative',
                      cursor: 'pointer'
                    },
                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = '#15803d',
                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = 'rgba(20, 83, 45, 0.5)'
                  },
                    d.label,
                    currentBets[`dozen-${d.val}`] && React.createElement('div', {
                      style: {
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#facc15',
                        color: 'black',
                        fontSize: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        border: '1px solid white'
                      }
                    }, currentBets[`dozen-${d.val}`].amount)
                  ))
                ),
                // Mises simples
                React.createElement('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    gap: '1px',
                    marginTop: '1px',
                    height: '48px',
                    borderRadius: '0 0 8px 8px',
                    overflow: 'hidden'
                  }
                },
                  [
                    { id: 'half-low', type: 'half', value: 'low', label: '1 à 18', bg: 'rgba(20, 83, 45, 0.5)', hoverBg: '#15803d' },
                    { id: 'parity-even', type: 'parity', value: 'even', label: 'PAIR', bg: 'rgba(20, 83, 45, 0.5)', hoverBg: '#15803d' },
                    { id: 'color-red', type: 'color', value: 'red', label: 'ROUGE', bg: '#991b1b', hoverBg: '#b91c1c' },
                    { id: 'color-black', type: 'color', value: 'black', label: 'NOIR', bg: '#0f172a', hoverBg: '#1e293b' },
                    { id: 'parity-odd', type: 'parity', value: 'odd', label: 'IMPAIR', bg: 'rgba(20, 83, 45, 0.5)', hoverBg: '#15803d' },
                    { id: 'half-high', type: 'half', value: 'high', label: '19 à 36', bg: 'rgba(20, 83, 45, 0.5)', hoverBg: '#15803d' }
                  ].map(bet => React.createElement('button', {
                    key: bet.id,
                    onClick: () => placeBet(bet.id, bet.type, bet.value),
                    style: {
                      backgroundColor: bet.bg,
                      border: '1px solid rgba(202, 138, 4, 0.3)',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600',
                      position: 'relative',
                      cursor: 'pointer'
                    },
                    onMouseEnter: (e) => e.currentTarget.style.backgroundColor = bet.hoverBg,
                    onMouseLeave: (e) => e.currentTarget.style.backgroundColor = bet.bg
                  },
                    bet.label,
                    currentBets[bet.id] && React.createElement('div', {
                      style: {
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        width: '20px',
                        height: '20px',
                        backgroundColor: '#facc15',
                        borderRadius: '50%'
                      }
                    })
                  ))
                )
              )
            )
          ),
          // Contrôles
          React.createElement('div', {
            style: {
              marginTop: '32px',
              display: 'flex',
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              borderTop: '1px solid rgba(202, 138, 4, 0.2)',
              paddingTop: '24px'
            }
          },
            // Jetons
            React.createElement('div', {
              style: { display: 'flex', gap: '8px' }
            },
              CHIP_VALUES.map(val => {
                const colors = {
                  1: { bg: 'white', border: '#cbd5e1', text: '#1e293b' },
                  5: { bg: '#dc2626', border: '#991b1b', text: 'white' },
                  10: { bg: '#2563eb', border: '#1e40af', text: 'white' },
                  25: { bg: '#16a34a', border: '#15803d', text: 'white' },
                  100: { bg: 'black', border: '#334155', text: '#eab308' }
                };
                const c = colors[val];
                return React.createElement('button', {
                  key: val,
                  onClick: () => setSelectedChip(val),
                  style: {
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: `4px solid ${c.border}`,
                    backgroundColor: c.bg,
                    color: c.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    transform: selectedChip === val ? 'translateY(-8px) scale(1.1)' : 'scale(1)',
                    outline: selectedChip === val ? '2px solid #fef08a' : 'none',
                    outlineOffset: '2px'
                  }
                }, val);
              })
            ),
            // Boutons
            React.createElement('div', {
              style: {
                display: 'flex',
                gap: '16px',
                width: window.innerWidth < 768 ? '100%' : 'auto'
              }
            },
              React.createElement('button', {
                onClick: clearBets,
                disabled: spinning || Object.keys(currentBets).length === 0,
                style: {
                  flex: window.innerWidth < 768 ? 1 : 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(127, 29, 29, 0.5)',
                  color: '#fecaca',
                  border: '1px solid rgba(185, 28, 28, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
opacity: (spinning || Object.keys(currentBets).length === 0) ? 0.5 : 1,
cursor: (spinning || Object.keys(currentBets).length === 0) ? 'not-allowed' : 'pointer',
transition: 'background-color 0.2s'
},
onMouseEnter: (e) => {
if (!spinning && Object.keys(currentBets).length > 0) {
e.currentTarget.style.backgroundColor = '#7f1d1d';
}
},
onMouseLeave: (e) => {
e.currentTarget.style.backgroundColor = 'rgba(127, 29, 29, 0.5)';
}
}, 'Effacer'),
React.createElement('button', {
onClick: spinWheel,
disabled: spinning || Object.keys(currentBets).length === 0,
style: {
flex: window.innerWidth < 768 ? 1 : 'none',
padding: '12px 32px',
borderRadius: '8px',
background: 'linear-gradient(to bottom, #eab308, #a16207)',
color: 'black',
border: '1px solid #facc15',
fontWeight: 'bold',
boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
display: 'flex',
alignItems: 'center',
justifyContent: 'center',
gap: '8px',
opacity: (spinning || Object.keys(currentBets).length === 0) ? 0.5 : 1,
cursor: (spinning || Object.keys(currentBets).length === 0) ? 'not-allowed' : 'pointer',
transition: 'all 0.2s',
filter: (spinning || Object.keys(currentBets).length === 0) ? 'grayscale(1)' : 'grayscale(0)'
},
onMouseDown: (e) => {
if (!spinning && Object.keys(currentBets).length > 0) {
e.currentTarget.style.transform = 'scale(0.95)';
}
},
onMouseUp: (e) => {
e.currentTarget.style.transform = 'scale(1)';
},
onMouseEnter: (e) => {
if (!spinning && Object.keys(currentBets).length > 0) {
e.currentTarget.style.background = 'linear-gradient(to bottom, #facc15, #ca8a04)';
}
},
onMouseLeave: (e) => {
e.currentTarget.style.background = 'linear-gradient(to bottom, #eab308, #a16207)';
}
}, spinning ? '...' : 'TOURNER')
)
)
)
),
React.createElement('div', {
style: {
marginTop: '32px',
color: 'rgba(134, 239, 172, 0.4)',
fontSize: '12px'
}
}, 'Jeu de Roulette Européenne')
);
}
// Monter le composant
function mountRoulette() {
const container = document.getElementById('roulette-game');
if (container && typeof ReactDOM !== 'undefined') {
ReactDOM.render(React.createElement(Roulette), container);
}
}
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', mountRoulette);
} else {
mountRoulette();
}
})();