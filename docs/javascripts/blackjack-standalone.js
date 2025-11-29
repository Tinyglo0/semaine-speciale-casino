// Version standalone pour MkDocs avec styles inline
(function() {
  const { useState, useEffect } = React;

  // --- Utilitaires de jeu de cartes ---
  const SUITS = ['♠', '♥', '♦', '♣'];
  const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

  const createDeck = () => {
    const deck = [];
    for (const suit of SUITS) {
      for (const value of VALUES) {
        deck.push({ suit, value });
      }
    }
    return deck;
  };

  const shuffleDeck = (deck) => {
    const newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
    }
    return newDeck;
  };

  const getCardValue = (card) => {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
  };

  const calculateHandValue = (hand) => {
    let value = 0;
    let aces = 0;

    for (const card of hand) {
      value += getCardValue(card);
      if (card.value === 'A') aces += 1;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces -= 1;
    }

    return value;
  };

  // --- Composants UI ---
  const Card = ({ card, hidden }) => {
    if (hidden) {
      return React.createElement('div', {
        style: {
          width: '110px',
          height: '154px',
          backgroundColor: '#991b1b',
          borderRadius: '8px',
          border: '2px solid white',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          margin: '0 4px',
          transition: 'transform 0.2s',
          cursor: 'pointer'
        },
        onMouseEnter: (e) => e.currentTarget.style.transform = 'scale(1.05)',
        onMouseLeave: (e) => e.currentTarget.style.transform = 'scale(1)'
      },
        React.createElement('div', {
          style: {
            fontSize: '48px',
            color: 'white',
            opacity: 0.5
          }
        }, '?')
      );
    }

    const isRed = card.suit === '♥' || card.suit === '♦';
    
    return React.createElement('div', {
      style: {
        width: '110px',
        height: '154px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        color: isRed ? '#dc2626' : '#111827',
        margin: '0 4px',
        transition: 'transform 0.2s',
        cursor: 'pointer',
        userSelect: 'none'
      },
      onMouseEnter: (e) => e.currentTarget.style.transform = 'translateY(-8px)',
      onMouseLeave: (e) => e.currentTarget.style.transform = 'translateY(0)'
    },
      React.createElement('div', {
        style: {
          alignSelf: 'flex-start',
          fontSize: '24px',
          fontWeight: 'bold',
          lineHeight: 1
        }
      }, card.value),
      React.createElement('div', {
        style: {
          fontSize: '60px'
        }
      }, card.suit),
      React.createElement('div', {
        style: {
          alignSelf: 'flex-end',
          fontSize: '24px',
          fontWeight: 'bold',
          lineHeight: 1,
          transform: 'rotate(180deg)'
        }
      }, card.value)
    );
  };

  const Hand = ({ title, cards, score, hiddenCard = false }) => 
    React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px',
        width: '100%'
      }
    },
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          marginBottom: '8px'
        }
      },
        React.createElement('h2', {
          style: {
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginRight: '12px',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
          }
        }, title),
        !hiddenCard && React.createElement('span', {
          style: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontFamily: 'monospace',
            border: '1px solid rgba(255,255,255,0.2)'
          }
        }, `Total: ${score}`)
      ),
      React.createElement('div', {
        style: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          minHeight: '120px'
        }
      },
        cards.map((card, index) => 
          React.createElement(Card, {
            key: index,
            card: card,
            hidden: hiddenCard && index === 0
          })
        )
      )
    );

  const Button = ({ onClick, disabled, children, primary = false, danger = false }) => {
    let bgColor = '#2563eb';
    let hoverColor = '#3b82f6';
    let borderColor = '#1e40af';
    let textColor = 'white';

    if (disabled) {
      bgColor = '#4b5563';
      hoverColor = '#4b5563';
      textColor = '#9ca3af';
    } else if (primary) {
      bgColor = '#eab308';
      hoverColor = '#facc15';
      borderColor = '#a16207';
      textColor = '#713f12';
    } else if (danger) {
      bgColor = '#dc2626';
      hoverColor = '#ef4444';
      borderColor = '#991b1b';
    }

    return React.createElement('button', {
      onClick: onClick,
      disabled: disabled,
      style: {
        padding: '12px 24px',
        borderRadius: '9999px',
        fontWeight: 'bold',
        fontSize: '14px',
        backgroundColor: bgColor,
        color: textColor,
        border: 'none',
        borderBottom: `4px solid ${borderColor}`,
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        transition: 'all 0.2s',
        opacity: disabled ? 0.5 : 1
      },
      onMouseEnter: (e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = hoverColor;
      },
      onMouseLeave: (e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = bgColor;
      },
      onMouseDown: (e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(0.95)';
      },
      onMouseUp: (e) => {
        if (!disabled) e.currentTarget.style.transform = 'scale(1)';
      }
    }, children);
  };

  const MessageOverlay = ({ result, onReset, playerScore, dealerScore }) => {
    if (!result) return null;

    let title = "";
    let subtext = "";
    let titleColor = "";

    switch (result) {
      case 'win':
        title = "Victoire !";
        subtext = "Vous avez battu la banque.";
        titleColor = "#facc15";
        break;
      case 'lose':
        title = "Perdu...";
        subtext = "La banque l'emporte.";
        titleColor = "#f87171";
        break;
      case 'push':
        title = "Égalité";
        subtext = "Personne ne gagne.";
        titleColor = "#d1d5db";
        break;
      case 'blackjack':
        title = "Blackjack !";
        subtext = "Incroyable !";
        titleColor = "#c084fc";
        break;
      default:
        return null;
    }

    return React.createElement('div', {
      style: {
        position: 'absolute',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        padding: '16px'
      }
    },
      React.createElement('div', {
        style: {
          backgroundColor: '#111827',
          padding: '32px',
          borderRadius: '16px',
          border: '2px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }
      },
        React.createElement('h2', {
          style: {
            fontSize: '36px',
            fontWeight: '900',
            marginBottom: '8px',
            textTransform: 'uppercase',
            color: titleColor,
            textShadow: '0 0 10px rgba(255,255,255,0.3)'
          }
        }, title),
        React.createElement('p', {
          style: {
            color: '#9ca3af',
            marginBottom: '32px',
            fontWeight: '500'
          }
        }, subtext),
        React.createElement('div', {
          style: {
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'space-around',
              gap: '20px'
            }
          },
            React.createElement('div', {
              style: {
                textAlign: 'center'
              }
            },
              React.createElement('div', {
                style: {
                  color: '#9ca3af',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontWeight: '600'
                }
              }, 'Vous'),
              React.createElement('div', {
                style: {
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }
              }, playerScore)
            ),
            React.createElement('div', {
              style: {
                alignSelf: 'center',
                color: '#4b5563',
                fontSize: '24px',
                fontWeight: 'bold'
              }
            }, 'vs'),
            React.createElement('div', {
              style: {
                textAlign: 'center'
              }
            },
              React.createElement('div', {
                style: {
                  color: '#9ca3af',
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                  fontWeight: '600'
                }
              }, 'Croupier'),
              React.createElement('div', {
                style: {
                  color: '#fff',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }
              }, dealerScore)
            )
          )
        ),
        React.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'center'
          }
        },
          React.createElement(Button, {
            onClick: onReset,
            primary: true
          }, 'Nouvelle Partie')
        )
      )
    );
  };

  // --- Composant Principal ---
  function Blackjack() {
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [dealerHand, setDealerHand] = useState([]);
    const [gameState, setGameState] = useState('initial');
    const [result, setResult] = useState(null);

    const startNewGame = () => {
      const newDeck = shuffleDeck(createDeck());
      const pHand = [newDeck.pop(), newDeck.pop()];
      const dHand = [newDeck.pop(), newDeck.pop()];

      setDeck(newDeck);
      setPlayerHand(pHand);
      setDealerHand(dHand);
      setGameState('playing');
      setResult(null);

      const pScore = calculateHandValue(pHand);
      if (pScore === 21) {
        handleGameOver(pHand, dHand, 'blackjack');
      }
    };

    useEffect(() => {
      startNewGame();
    }, []);

    const hit = () => {
      if (gameState !== 'playing') return;

      const newDeck = [...deck];
      const card = newDeck.pop();
      const newHand = [...playerHand, card];

      setDeck(newDeck);
      setPlayerHand(newHand);

      const score = calculateHandValue(newHand);
      if (score > 21) {
        handleGameOver(newHand, dealerHand, 'bust');
      } else if (score === 21) {
        // Victoire automatique à 21 !
        handleGameOver(newHand, dealerHand, 'win21');
      }
    };

    const stand = () => {
      if (gameState !== 'playing') return;
      setGameState('dealerTurn');
    };

    useEffect(() => {
      if (gameState === 'dealerTurn') {
        let currentDealerHand = [...dealerHand];
        let currentDeck = [...deck];
        let dealerScore = calculateHandValue(currentDealerHand);

        const playDealer = async () => {
          await new Promise(r => setTimeout(r, 600));

          while (dealerScore < 17) {
            const card = currentDeck.pop();
            currentDealerHand = [...currentDealerHand, card];
            dealerScore = calculateHandValue(currentDealerHand);
            
            setDealerHand([...currentDealerHand]);
            setDeck([...currentDeck]);
            
            await new Promise(r => setTimeout(r, 800));
          }

          handleGameOver(playerHand, currentDealerHand, null);
        };

        playDealer();
      }
    }, [gameState]);

    const handleGameOver = (pHand, dHand, overrideResult) => {
      const pScore = calculateHandValue(pHand);
      const dScore = calculateHandValue(dHand);
      let gameResult = '';

      if (overrideResult === 'blackjack') {
        gameResult = dScore === 21 ? 'push' : 'blackjack';
      } else if (overrideResult === 'bust') {
        gameResult = 'lose';
      } else if (overrideResult === 'win21') {
        // Victoire directe à 21 (pas blackjack initial)
        gameResult = 'win';
      } else {
        if (dScore > 21) {
          gameResult = 'win';
        } else if (dScore > pScore) {
          gameResult = 'lose';
        } else if (dScore < pScore) {
          gameResult = 'win';
        } else {
          gameResult = 'push';
        }
      }

      setResult(gameResult);
      setGameState('gameOver');
    };

    const playerScore = calculateHandValue(playerHand);
    const dealerScore = calculateHandValue(dealerHand);

    return React.createElement('div', {
      style: {
        minHeight: '100vh',
        backgroundColor: '#0f380f',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        userSelect: 'none',
        backgroundImage: 'radial-gradient(circle, transparent 20%, #000000 100%)',
        padding: '20px'
      }
    },
      React.createElement('div', {
        style: {
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '1024px',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between'
        }
      },
        React.createElement('div', {
          style: {
            textAlign: 'center',
            marginBottom: '32px'
          }
        },
          React.createElement('h1', {
            style: {
              fontSize: '48px',
              fontWeight: '900',
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              borderBottom: '2px solid rgba(255,255,255,0.1)',
              paddingBottom: '16px',
              display: 'inline-block'
            }
          },
            'Black',
            React.createElement('span', {
              style: { color: '#ef4444' }
            }, 'jack')
          )
        ),
        React.createElement('div', {
          style: {
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '48px'
          }
        },
          React.createElement(Hand, {
            title: "Le Croupier",
            cards: dealerHand,
            score: dealerScore,
            hiddenCard: gameState === 'playing'
          }),
          React.createElement(Hand, {
            title: "Votre Main",
            cards: playerHand,
            score: playerScore
          })
        ),
        React.createElement('div', {
          style: {
            marginTop: '32px',
            marginBottom: '16px'
          }
        },
          React.createElement('div', {
            style: {
              display: 'flex',
              justifyContent: 'center',
              gap: '24px'
            }
          },
            gameState === 'playing' ? [
              React.createElement(Button, {
                key: 'hit',
                onClick: hit,
                disabled: false
              }, 'Tirer'),
              React.createElement(Button, {
                key: 'stand',
                onClick: stand,
                danger: true
              }, 'Rester')
            ] : React.createElement('div', {
              style: { height: '52px' }
            })
          )
        ),
        React.createElement('div', {
          style: {
            textAlign: 'center',
            color: 'rgba(255,255,255,0.3)',
            fontSize: '14px',
            marginTop: '16px',
            fontWeight: '500'
          }
        }, 'Blackjack classique • Le croupier tire jusqu\'à 17')
      ),
      React.createElement(MessageOverlay, {
        result: result,
        onReset: startNewGame,
        playerScore: playerScore,
        dealerScore: dealerScore
      })
    );
  }

  // Monter le composant quand le DOM est prêt
  function mountBlackjack() {
    const container = document.getElementById('blackjack-game');
    if (container && typeof ReactDOM !== 'undefined') {
      ReactDOM.render(React.createElement(Blackjack), container);
    }
  }

  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountBlackjack);
  } else {
    mountBlackjack();
  }
})();