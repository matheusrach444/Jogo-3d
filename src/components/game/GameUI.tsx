import React from 'react';
import { GameState } from '../../types/game';

interface GameUIProps {
  gameState: GameState;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState }) => {
  const { player, collectedFragments, totalFragments, gamePhase, timeScale } = gameState;

  const healthPercent = (player.health / player.maxHealth) * 100;
  const energyPercent = (player.timeEnergy / player.maxTimeEnergy) * 100;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Top HUD */}
      <div className="absolute top-6 left-6 space-y-3">
        {/* Health Bar */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-red-500/30">
          <div className="text-red-400 text-xs font-bold mb-1">VIDA</div>
          <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden border border-red-500/50">
            <div 
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${healthPercent}%` }}
            />
          </div>
          <div className="text-white text-xs mt-1">{player.health} / {player.maxHealth}</div>
        </div>

        {/* Time Energy Bar */}
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3 border border-cyan-500/30">
          <div className="text-cyan-400 text-xs font-bold mb-1">ENERGIA TEMPORAL</div>
          <div className="w-48 h-3 bg-gray-800 rounded-full overflow-hidden border border-cyan-500/50">
            <div 
              className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 transition-all duration-300"
              style={{ width: `${energyPercent}%` }}
            />
          </div>
          <div className="text-white text-xs mt-1">{Math.floor(player.timeEnergy)} / {player.maxTimeEnergy}</div>
        </div>
      </div>

      {/* Fragments Counter */}
      <div className="absolute top-6 right-6">
        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30">
          <div className="text-yellow-400 text-xs font-bold mb-2">FRAGMENTOS DO SOL</div>
          <div className="text-4xl font-bold text-yellow-300">
            {collectedFragments} / {totalFragments}
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({ length: totalFragments }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < collectedFragments 
                    ? 'bg-yellow-400 shadow-lg shadow-yellow-500/50' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Time Scale Indicator */}
      {timeScale !== 1.0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className={`text-6xl font-bold ${
            timeScale < 1 ? 'text-cyan-400' : 'text-orange-400'
          } animate-pulse`}>
            {timeScale < 1 ? 'TEMPO LENTO' : 'TEMPO RÁPIDO'}
          </div>
        </div>
      )}

      {/* Controls Guide */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-white/20">
        <div className="text-white text-xs space-y-1">
          <div><span className="text-cyan-400 font-bold">WASD</span> - Mover</div>
          <div><span className="text-cyan-400 font-bold">ESPAÇO</span> - Pular</div>
          <div><span className="text-cyan-400 font-bold">SHIFT</span> - Dash</div>
          <div><span className="text-cyan-400 font-bold">MOUSE</span> - Olhar</div>
          <div><span className="text-cyan-400 font-bold">CLICK</span> - Ataque de Luz</div>
          <div><span className="text-cyan-400 font-bold">Q</span> - Desacelerar Tempo</div>
          <div><span className="text-cyan-400 font-bold">E</span> - Acelerar Tempo</div>
        </div>
      </div>

      {/* Victory Screen */}
      {gamePhase === 'victory' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <div className="text-center space-y-6">
            <div className="text-8xl font-bold text-yellow-400 animate-pulse">
              VITÓRIA!
            </div>
            <div className="text-2xl text-white">
              Você restaurou o equilíbrio do mundo!
            </div>
            <div className="text-xl text-gray-300">
              Todos os {totalFragments} fragmentos do sol foram recuperados
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg text-xl transition-colors"
            >
              Jogar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Defeat Screen */}
      {gamePhase === 'defeat' && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <div className="text-center space-y-6">
            <div className="text-8xl font-bold text-red-400 animate-pulse">
              DERROTA
            </div>
            <div className="text-2xl text-white">
              A escuridão consumiu tudo...
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-8 px-8 py-4 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg text-xl transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      )}

      {/* Intro Screen */}
      {gamePhase === 'intro' && (
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center pointer-events-auto">
          <div className="text-center space-y-6 max-w-2xl px-8">
            <div className="text-6xl font-bold text-yellow-400 mb-8">
              ECLIPSE FRAGMENT
            </div>
            <div className="text-xl text-gray-300 leading-relaxed">
              O sol foi fragmentado. A escuridão avança.
            </div>
            <div className="text-lg text-gray-400 leading-relaxed">
              Você possui o poder de manipular tempo e luz.
              Explore as ruínas flutuantes, derrote as sombras
              e recupere os fragmentos do sol antes que seja tarde demais.
            </div>
            <button
              onClick={() => {
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  canvas.requestPointerLock();
                }
              }}
              className="mt-8 px-12 py-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg text-2xl transition-colors"
            >
              COMEÇAR JORNADA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
