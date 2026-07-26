import React from 'react';
import { ELEMENTS, ANIMALS } from '../data/rpgData';
import { IconHelper } from './IconHelper';
import { Sparkles, Zap, Flame, ShieldAlert } from 'lucide-react';

export const ElementCompendium: React.FC = () => {
  const elementList = Object.values(ELEMENTS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 bg-zinc-950/90 border border-zinc-800 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold text-zinc-100 mb-2 flex items-center gap-2">
          <Sparkles className="text-amber-400" />
          Biblioteca de Elementos (15 Elementos Místicos)
        </h2>
        <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
          Cada elemento governa uma força da natureza e do espírito, definindo tipos de dano, atributos principais e árvores de habilidades de 15 níveis.
        </p>
      </div>

      {/* Grid of 15 Elements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elementList.map((elem) => {
          // Find which animals use this element
          const animalsWithElem = Object.values(ANIMALS).filter((a) =>
            a.elements.includes(elem.id)
          );

          return (
            <div
              key={elem.id}
              className="p-5 bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-lg flex flex-col justify-between"
              style={{
                background: `linear-gradient(135deg, ${elem.colorHex}10 0%, rgba(9, 9, 11, 0.95) 100%)`,
              }}
            >
              <div>
                {/* Title & Icon */}
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="p-3 rounded-xl border flex items-center justify-center text-white"
                    style={{
                      backgroundColor: `${elem.colorHex}20`,
                      borderColor: `${elem.colorHex}50`,
                      color: elem.colorHex,
                    }}
                  >
                    <IconHelper name={elem.iconName} size={24} />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-zinc-100">{elem.name}</h3>
                    <span className="text-xs text-zinc-400">{elem.damageType}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 mb-4 leading-relaxed">
                  {elem.description}
                </p>

                {/* Atributo Principal */}
                <div className="mb-4 p-2.5 bg-zinc-900/80 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">Atributo Requisitado:</span>
                  <strong style={{ color: elem.colorHex }}>{elem.primaryStat}</strong>
                </div>
              </div>

              {/* Guardiões Relacionados */}
              <div className="pt-3 border-t border-zinc-900">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block mb-2">
                  Guardiões que usam {elem.name}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {animalsWithElem.map((animal) => (
                    <span
                      key={animal.id}
                      className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md text-[11px] text-zinc-300 font-medium"
                    >
                      {animal.name} ({animal.weapon})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
