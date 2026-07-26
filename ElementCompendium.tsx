import React from 'react';
import { AnimalDefinition, AnimalId } from '../types';
import { ANIMALS, ELEMENTS } from '../data/rpgData';
import { IconHelper } from './IconHelper';
import { Shield, Sparkles, Sword, Check } from 'lucide-react';

interface AnimalCompendiumProps {
  currentAnimalId: AnimalId;
  onSelectAnimal: (id: AnimalId) => void;
}

export const AnimalCompendium: React.FC<AnimalCompendiumProps> = ({
  currentAnimalId,
  onSelectAnimal,
}) => {
  const animalList = Object.values(ANIMALS);

  return (
    <div className="space-y-6">
      {/* Compendium Header */}
      <div className="p-6 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-zinc-100 mb-2 flex items-center gap-2">
          <Sword className="text-amber-400" />
          Compêndio dos 15 Guardiões (Animais & Armas)
        </h2>
        <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
          Cada Guardião animal domina uma arma distinta e canaliza exatamente 3 Caminhos Elementais.
          Selecione qualquer Guardião abaixo para visualizar e construir sua árvore de habilidades com 45 habilidades totais.
        </p>
      </div>

      {/* Grid of 15 Animals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animalList.map((animal) => {
          const isSelected = animal.id === currentAnimalId;

          return (
            <div
              key={animal.id}
              className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-zinc-900 border-amber-500/80 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
                  : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/60'
              }`}
            >
              <div>
                {/* Header: Icon + Name + Weapon */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl border flex items-center justify-center text-white"
                      style={{
                        backgroundColor: `${animal.color}20`,
                        borderColor: `${animal.color}50`,
                        color: animal.color,
                      }}
                    >
                      <IconHelper name={animal.iconName} size={24} />
                    </div>

                    <div>
                      <h3 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
                        {animal.name}
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Ativo
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-amber-400 font-semibold">
                        Arma: {animal.weapon} ({animal.weaponCategory})
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                  {animal.description}
                </p>

                {/* Stat Bonus & Style */}
                <div className="mb-4 p-3 bg-zinc-900/80 rounded-xl border border-zinc-800/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Bônus de Atributo:</span>
                    <strong className="text-amber-400">{animal.statBonus}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Estilo de Luta:</span>
                    <span className="text-zinc-300 text-right line-clamp-1">{animal.combatStyle}</span>
                  </div>
                </div>

                {/* 3 Elements Badges */}
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">
                    Três Elementos do {animal.name}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {animal.elements.map((elemId) => {
                      const elemDef = ELEMENTS[elemId];
                      return (
                        <div
                          key={elemId}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border"
                          style={{
                            backgroundColor: `${elemDef.colorHex}15`,
                            color: elemDef.colorHex,
                            borderColor: `${elemDef.colorHex}35`,
                          }}
                        >
                          <IconHelper name={elemDef.iconName} size={13} />
                          <span>{elemDef.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Select Button */}
              <button
                onClick={() => onSelectAnimal(animal.id)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-zinc-950 shadow-md cursor-default'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check size={16} />
                    <span>Guardião Selecionado</span>
                  </>
                ) : (
                  <span>Escolher Guardião {animal.name}</span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
