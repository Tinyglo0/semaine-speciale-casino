// Guide des Mises - Roulette (Version standalone pour MkDocs)
(function() {
  const { useState } = React;

  function RouletteGuide() {
    const [highlightedCells, setHighlightedCells] = useState([]);
    const [visibleMarkers, setVisibleMarkers] = useState([]);

    const highlight = (ids) => {
      setHighlightedCells(Array.isArray(ids) ? ids : [ids]);
    };

    const reset = () => {
      setHighlightedCells([]);
    };

    const showMarker = (ids) => {
      setVisibleMarkers(Array.isArray(ids) ? ids : [ids]);
    };

    const hideMarker = () => {
      setVisibleMarkers([]);
    };

    const isHighlighted = (id) => highlightedCells.includes(id);
    const isMarkerVisible = (id) => visibleMarkers.includes(id);

    // Données des numéros de la roulette
    const row3 = [3,6,9,12,15,18,21,24,27,30,33,36];
    const row2 = [2,5,8,11,14,17,20,23,26,29,32,35];
    const row1 = [1,4,7,10,13,16,19,22,25,28,31,34];

    const getColor = (num) => {
      const reds = [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
      return reds.includes(num) ? 'red' : 'black';
    };

    const renderCell = (num) => {
      const color = getColor(num);
      const cellId = `cell-${num}`;
      return React.createElement('div', {
        key: num,
        id: cellId,
        style: {
          border: '1px solid rgba(202, 138, 4, 0.3)',
          height: '48px',
          backgroundColor: isHighlighted(cellId) ? '#facc15' : (color === 'red' ? '#dc2626' : '#0f172a'),
          color: isHighlighted(cellId) ? 'black' : 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          boxShadow: isHighlighted(cellId) ? '0 0 15px #facc15' : 'none',
          transform: isHighlighted(cellId) ? 'scale(1.05)' : 'scale(1)',
          zIndex: isHighlighted(cellId) ? 10 : 1,
          position: 'relative'
        }
      }, num);
    };

    const betTypes = [
      {
        name: 'Plein (Straight)',
        color: '#facc15',
        bgColor: 'rgba(234, 179, 8, 0.2)',
        textColor: '#fde047',
        borderColor: 'rgba(234, 179, 8, 0.5)',
        payout: '35x',
        description: 'Mise directe sur un seul numéro (ex: 17).',
        marker: 'straight-split',
        markerBg: '#eab308',
        cells: ['cell-17'],
        markerPos: { left: '41%', top: '31%' }
      },
      {
        name: 'Cheval (Split)',
        color: '#60a5fa',
        bgColor: 'rgba(59, 130, 246, 0.2)',
        textColor: '#93c5fd',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        payout: '17x',
        description: 'Sur la ligne séparant deux numéros (ex: 14-17).',
        marker: 'marker-split',
        markerBg: '#3b82f6',
        cells: ['cell-14', 'cell-17'],
        markerPos: { left: '33.33%', top: '33.33%' }
      },
      {
        name: 'Transversale (Street)',
        color: '#fb923c',
        bgColor: 'rgba(249, 115, 22, 0.2)',
        textColor: '#fdba74',
        borderColor: 'rgba(249, 115, 22, 0.5)',
        payout: '11x',
        description: 'Sur le bord d\'une rangée de 3 numéros (ex: 7,8,9).',
        marker: 'marker-street',
        markerBg: '#f97316',
        cells: ['cell-7', 'cell-8', 'cell-9'],
        markerPos: { left: '16.66%', top: '0%' }
      },
      {
        name: 'Carré (Corner)',
        color: '#c084fc',
        bgColor: 'rgba(168, 85, 247, 0.2)',
        textColor: '#d8b4fe',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        payout: '8x',
        description: 'Au croisement de 4 numéros.',
        marker: 'marker-corner',
        markerBg: '#a855f7',
        cells: ['cell-23', 'cell-26', 'cell-22', 'cell-25'],
        markerPos: { left: '66.66%', top: '66.66%' }
      },
      {
        name: 'Sixain (Six Line)',
        color: '#f472b6',
        bgColor: 'rgba(236, 72, 153, 0.2)',
        textColor: '#f9a8d4',
        borderColor: 'rgba(236, 72, 153, 0.5)',
        payout: '5x',
        description: 'Intersection de deux rangées (6 numéros).',
        marker: 'marker-six',
        markerBg: '#ec4899',
        cells: ['cell-3', 'cell-6', 'cell-9', 'cell-12', 'cell-2', 'cell-5', 'cell-8', 'cell-11'],
        markerPos: { left: '16.66%', top: '33.33%' }
      },
      {
        name: 'Douzaines / Colonnes',
        color: '#4ade80',
        bgColor: 'rgba(34, 197, 94, 0.2)',
        textColor: '#86efac',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        payout: '2x',
        description: 'Couvre 12 numéros d\'un coup.',
        cells: ['zone-dozen1', 'zone-dozen2', 'zone-dozen3', 'zone-col1', 'zone-col2', 'zone-col3']
      },
      {
        name: 'Chances Simples',
        color: '#ffffff',
        bgColor: 'rgba(255, 255, 255, 0.2)',
        textColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.5)',
        payout: '1x',
        description: 'Rouge/Noir, Pair/Impair, Manque/Passe.',
        cells: ['zone-red', 'zone-black', 'zone-simple', 'zone-simple2', 'zone-simple3', 'zone-simple4']
      }
    ];

    return React.createElement('div', {
      style: {
        // backgroundColor: '#0f172a',
        backgroundColor: '#ffffffff',
        color: '#f1f5f9',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }
    },
      React.createElement('div', {
        style: {
          maxWidth: '1536px',
          width: '100%',
          display: 'flex',
          flexDirection: window.innerWidth < 1024 ? 'column' : 'row',
          gap: '32px'
        }
      },
        // Colonne gauche - Tapis
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('h2', {
            style: {
              fontSize: '24px',
              // fontFamily: 'serif',
              color: '#757575',
              fontWeight: "bold",
              marginBottom: '36px',
              textAlign: window.innerWidth < 1024 ? 'center' : 'left'
            }
          }, 'Tapis de Jeu & Zones'),
          React.createElement('div', {
            style: {
              backgroundColor: '#0f3d24',
              backgroundImage: 'radial-gradient(#155231 15%, transparent 16%), radial-gradient(#155231 15%, transparent 16%)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
              padding: '24px',
              borderRadius: '12px',
              border: '8px solid #a16207',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              position: 'relative',
              userSelect: 'none',
              overflow: 'hidden'
            }
          },
            React.createElement('div', { style: { display: 'flex', position: 'relative' } },
              // Zéro
              React.createElement('div', {
                id: 'zone-zero',
                style: {
                  width: '48px',
                  backgroundColor: isHighlighted('zone-zero') ? '#facc15' : '#15803d',
                  border: '1px solid rgba(202, 138, 4, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  borderRadius: '8px 0 0 8px',
                  color: isHighlighted('zone-zero') ? 'black' : 'white',
                  transition: 'all 0.3s',
                  boxShadow: isHighlighted('zone-zero') ? '0 0 15px #facc15' : 'none',
                  transform: isHighlighted('zone-zero') ? 'scale(1.05)' : 'scale(1)',
                  zIndex: isHighlighted('zone-zero') ? 10 : 1
                }
              }, '0'),
              React.createElement('div', { style: { flex: 1 } },
                // Grille + markers
                React.createElement('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(12, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    position: 'relative'
                  }
                },
                  // Markers
                  betTypes.filter(bt => bt.marker).map(bt => 
                    React.createElement('div', {
                      key: bt.marker,
                      id: bt.marker,
                      style: {
                        position: 'absolute',
                        left: bt.markerPos.left,
                        top: bt.markerPos.top,
                        width: '32px',
                        height: '32px',
                        marginLeft: '-16px',
                        marginTop: '-16px',
                        backgroundColor: bt.markerBg,
                        borderRadius: '50%',
                        border: '2px solid white',
                        zIndex: 20,
                        display: isMarkerVisible(bt.marker) ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        color: 'white'
                      }
                    }, bt.payout)
                  ),
                  // Cellules
                  row3.map(n => renderCell(n)),
                  row2.map(n => renderCell(n)),
                  row1.map(n => renderCell(n))
                ),
                // Douzaines
                React.createElement('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    height: '40px',
                    marginTop: '4px',
                    gap: '4px'
                  }
                },
                  ['zone-dozen1', 'zone-dozen2', 'zone-dozen3'].map((id, i) =>
                    React.createElement('div', {
                      key: id,
                      id: id,
                      style: {
                        border: '1px solid rgba(202, 138, 4, 0.3)',
                        backgroundColor: isHighlighted(id) ? '#facc15' : 'rgba(20, 83, 45, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: isHighlighted(id) ? 'black' : '#fef3c7',
                        transition: 'all 0.3s',
                        boxShadow: isHighlighted(id) ? '0 0 15px #facc15' : 'none',
                        transform: isHighlighted(id) ? 'scale(1.05)' : 'scale(1)',
                        zIndex: isHighlighted(id) ? 10 : 1
                      }
                    }, `${i+1}ère 12`)
                  )
                ),
                // Chances simples
                React.createElement('div', {
                  style: {
                    display: 'grid',
                    gridTemplateColumns: 'repeat(6, 1fr)',
                    height: '40px',
                    marginTop: '4px',
                    gap: '4px'
                  }
                },
                  [
                    { id: 'zone-simple', label: '1-18', bg: 'rgba(20, 83, 45, 0.4)' },
                    { id: 'zone-simple2', label: 'PAIR', bg: 'rgba(20, 83, 45, 0.4)' },
                    { id: 'zone-red', label: 'ROUGE', bg: '#7f1d1d' },
                    { id: 'zone-black', label: 'NOIR', bg: '#0f172a' },
                    { id: 'zone-simple3', label: 'IMPAIR', bg: 'rgba(20, 83, 45, 0.4)' },
                    { id: 'zone-simple4', label: '19-36', bg: 'rgba(20, 83, 45, 0.4)' }
                  ].map(zone =>
                    React.createElement('div', {
                      key: zone.id,
                      id: zone.id,
                      style: {
                        border: '1px solid rgba(202, 138, 4, 0.3)',
                        backgroundColor: isHighlighted(zone.id) ? '#facc15' : zone.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        color: isHighlighted(zone.id) ? 'black' : 'white',
                        transition: 'all 0.3s',
                        boxShadow: isHighlighted(zone.id) ? '0 0 15px #facc15' : 'none',
                        transform: isHighlighted(zone.id) ? 'scale(1.05)' : 'scale(1)',
                        zIndex: isHighlighted(zone.id) ? 10 : 1
                      }
                    }, zone.label)
                  )
                )
              ),
              // Colonnes
              React.createElement('div', {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  marginLeft: '4px',
                  width: '32px',
                  gap: '4px',
                  height: '144px'
                }
              },
                ['zone-col3', 'zone-col2', 'zone-col1'].map(id =>
                  React.createElement('div', {
                    key: id,
                    id: id,
                    style: {
                      flex: 1,
                      border: '1px solid rgba(202, 138, 4, 0.3)',
                      backgroundColor: isHighlighted(id) ? '#facc15' : 'rgba(20, 83, 45, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      color: isHighlighted(id) ? 'black' : '#fef3c7',
                      transition: 'all 0.3s',
                      boxShadow: isHighlighted(id) ? '0 0 15px #facc15' : 'none',
                      transform: isHighlighted(id) ? 'scale(1.05)' : 'scale(1)',
                      zIndex: isHighlighted(id) ? 10 : 1
                    }
                  }, '2:1')
                )
              )
            )
          ),
          React.createElement('p', {
            style: {
              textAlign: 'center',
              color: '#94a3b8',
              marginTop: '16px',
              fontStyle: 'italic',
              fontSize: '14px'
            }
          }, 'Passez votre souris sur la liste à droite pour voir où poser le jeton.')
        ),
        // Colonne droite - Légende
        React.createElement('div', {
          style: {
            width: window.innerWidth < 1024 ? '100%' : '384px',
            backgroundColor: '#1e293b',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }
        },
          React.createElement('h3', {
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }
          },
            React.createElement('span', {
              style: {
                width: '8px',
                height: '24px',
                backgroundColor: '#eab308',
                borderRadius: '2px'
              }
            }),
            'Légende des Gains'
          ),
          React.createElement('div', {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }
          },
            betTypes.map((bet, idx) =>
              React.createElement('div', {
                key: idx,
                style: {
                  padding: '12px',
                  backgroundColor: 'rgba(51, 65, 85, 0.5)',
                  borderRadius: '8px',
                  border: `1px solid transparent`,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                },
                onMouseEnter: () => {
                  highlight(bet.cells);
                  if (bet.marker) showMarker(bet.marker);
                },
                onMouseLeave: () => {
                  reset();
                  hideMarker();
                }
              },
                React.createElement('div', {
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }
                },
                  React.createElement('span', {
                    style: {
                      fontWeight: 'bold',
                      color: bet.color
                    }
                  }, bet.name),
                  React.createElement('span', {
                    style: {
                      backgroundColor: bet.bgColor,
                      color: bet.textColor,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }
                  }, bet.payout)
                ),
                React.createElement('p', {
                  style: {
                    fontSize: '12px',
                    color: '#94a3b8',
                    marginTop: '4px'
                  }
                }, bet.description)
              )
            )
          )
        )
      )
    );
  }

  // Monter le composant
  function mountRouletteGuide() {
    const container = document.getElementById('roulette-guide');
    if (container && typeof ReactDOM !== 'undefined') {
      ReactDOM.render(React.createElement(RouletteGuide), container);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountRouletteGuide);
  } else {
    mountRouletteGuide();
  }
})();