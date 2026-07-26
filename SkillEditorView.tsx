import React from 'react';
import { SAMPLE_PRESETS, ANIMALS } from '../data/rpgData';
import { AnimalId } from '../types';
import { IconHelper } from './IconHelper';
import { Sparkles, Bookmark, Check, X, Shield, Plus } from 'lucide-react';

interface PresetBuildsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadBuild: (preset: {
    name: string;
    animalId: AnimalId;
    level: number;
    unlockedSkillIds: string[];
    notes?: string;
  }) => void;
}

export const PresetBuildsModal: React.FC<PresetBuildsModalProps> = ({
  isOpen,
  onClose,
  onLoadBuild,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <Bookmark size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-zinc-100">Exemplos & Builds de Personagens</h3>
              <span className="text-xs text-zinc-400">Carregue arquétipos prontos de RPG de Mesa</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4">
          {SAMPLE_PRESETS.map((preset, idx) => {
            const animal = ANIMALS[preset.animalId];

            return (
              <div
                key={idx}
                className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-xl border flex items-center justify-center text-white"
                    style={{
                      backgroundColor: `${animal.color}20`,
                      borderColor: `${animal.color}40`,
                      color: animal.color,
                    }}
                  >
                    <IconHelper name={animal.iconName} size={22} />
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-zinc-100">{preset.name}</h4>
                    <span className="text-xs text-amber-400">
                      {animal.name} ({animal.weapon}) • Nível {preset.level}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                      {preset.notes}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadBuild(preset);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shrink-0 shadow-md transition-all flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Carregar</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
