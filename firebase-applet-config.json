import React, { useState, useMemo } from 'react';
import { AnimalId, ElementId, SkillActionType, SkillNode, SkillRank } from '../types';
import { ANIMALS, ELEMENTS, RANK_NAMES } from '../data/rpgData';
import { IconHelper } from './IconHelper';
import {
  Edit3,
  Search,
  RotateCcw,
  Save,
  Download,
  Upload,
  Sparkles,
  Check,
  AlertCircle,
  Filter,
  Layers,
  BookOpen,
  Zap,
  Shield,
  Dices,
  Trash2,
} from 'lucide-react';

interface SkillEditorViewProps {
  allSkillsMap: Record<string, SkillNode>;
  customSkillsMap: Record<string, SkillNode>;
  onSaveSkill: (updatedSkill: SkillNode) => void;
  onResetSkill: (skillId: string) => void;
  onResetAllCustomSkills: () => void;
  onImportCustomSkills: (importedMap: Record<string, SkillNode>) => void;
}

export const SkillEditorView: React.FC<SkillEditorViewProps> = ({
  allSkillsMap,
  customSkillsMap,
  onSaveSkill,
  onResetSkill,
  onResetAllCustomSkills,
  onImportCustomSkills,
}) => {
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState<AnimalId | 'all'>('all');
  const [selectedElementFilter, setSelectedElementFilter] = useState<ElementId | 'all'>('all');
  const [selectedTierFilter, setSelectedTierFilter] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyCustomized, setOnlyCustomized] = useState<boolean>(false);

  const [selectedSkillId, setSelectedSkillId] = useState<string>('leao_fogo_1');
  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  // Filter skills list
  const filteredSkills = useMemo(() => {
    const skillsList = Object.values(allSkillsMap) as SkillNode[];
    return skillsList.filter((sk) => {
      if (selectedAnimalFilter !== 'all' && sk.animalId !== selectedAnimalFilter) return false;
      if (selectedElementFilter !== 'all' && sk.elementId !== selectedElementFilter) return false;
      if (selectedTierFilter !== 'all' && sk.tier !== selectedTierFilter) return false;
      if (onlyCustomized && !customSkillsMap[sk.id]) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = sk.name.toLowerCase().includes(query);
        const matchesDesc = sk.description.toLowerCase().includes(query);
        const matchesEffect = (sk.effectSummary || '').toLowerCase().includes(query);
        const matchesLore = (sk.lore || '').toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesEffect || matchesLore;
      }

      return true;
    });
  }, [allSkillsMap, customSkillsMap, selectedAnimalFilter, selectedElementFilter, selectedTierFilter, searchQuery, onlyCustomized]);

  // Active skill being edited
  const activeSkill = allSkillsMap[selectedSkillId] || filteredSkills[0] || Object.values(allSkillsMap)[0];
  const isCustomized = Boolean(activeSkill && customSkillsMap[activeSkill.id]);

  // Form State
  const [formData, setFormData] = useState<SkillNode>(activeSkill);

  // Keep form in sync when active skill selection changes
  React.useEffect(() => {
    if (activeSkill) {
      setFormData(activeSkill);
    }
  }, [activeSkill?.id, customSkillsMap[activeSkill?.id]]);

  const handleFieldChange = <K extends keyof SkillNode>(field: K, value: SkillNode[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    onSaveSkill(formData);
    setSaveNotification(`Habilidade "${formData.name}" salva com sucesso!`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  const handleResetCurrent = () => {
    if (!activeSkill) return;
    onResetSkill(activeSkill.id);
    setSaveNotification(`Habilidade restaurada para o padrão original.`);
    setTimeout(() => setSaveNotification(null), 3000);
  };

  // Export JSON file
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customSkillsMap, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `habilidades_customizadas_rpg_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON file
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (typeof parsed === 'object' && parsed !== null) {
            onImportCustomSkills(parsed);
            setSaveNotification('Habilidades importadas com sucesso!');
            setTimeout(() => setSaveNotification(null), 3000);
          }
        } catch (err) {
          alert('Erro ao importar arquivo JSON. Verifique a formatação.');
        }
      };
    }
  };

  const totalCustomCount = Object.keys(customSkillsMap).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="p-6 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 border border-amber-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Edit3 className="text-amber-400" size={24} />
            <h2 className="text-2xl font-black text-zinc-100 tracking-tight">Editor Universal de Habilidades</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Reescreva, rebalanceie e personalize qualquer uma das centenas de habilidades dos 15 Guardiões Animais e Elementos.
            As edições são salvas automaticamente em sua ficha de RPG.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportJSON}
            disabled={totalCustomCount === 0}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed border border-zinc-700/60 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors"
            title="Exportar todas as habilidades editadas em JSON"
          >
            <Download size={14} className="text-amber-400" />
            <span>Exportar ({totalCustomCount})</span>
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 cursor-pointer border border-zinc-700/60 text-xs font-semibold text-zinc-200 flex items-center gap-2 transition-colors">
            <Upload size={14} className="text-cyan-400" />
            <span>Importar JSON</span>
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
          </label>

          {totalCustomCount > 0 && (
            <button
              onClick={() => {
                if (confirm('Tem certeza que deseja restaurar TODAS as habilidades customizadas para o padrão original?')) {
                  onResetAllCustomSkills();
                }
              }}
              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-xs font-bold text-red-400 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Resetar Tudo</span>
            </button>
          )}
        </div>
      </div>

      {/* Save Notification Alert */}
      {saveNotification && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check size={16} className="text-emerald-400" />
          <span>{saveNotification}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Keyword Search */}
          <div className="flex-1 min-w-[240px] relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por nome, efeito, tipo ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          {/* Guardião Filter */}
          <select
            value={selectedAnimalFilter}
            onChange={(e) => setSelectedAnimalFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">Todos os Guardiões ({Object.keys(ANIMALS).length})</option>
            {Object.values(ANIMALS).map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.weapon})
              </option>
            ))}
          </select>

          {/* Element Filter */}
          <select
            value={selectedElementFilter}
            onChange={(e) => setSelectedElementFilter(e.target.value as any)}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">Todos os Elementos ({Object.keys(ELEMENTS).length})</option>
            {Object.values(ELEMENTS).map((elem) => (
              <option key={elem.id} value={elem.id}>
                {elem.name}
              </option>
            ))}
          </select>

          {/* Tier Filter */}
          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500/50"
          >
            <option value="all">Todos os Tiers (1 ao 6)</option>
            {[1, 2, 3, 4, 5, 6].map((t) => (
              <option key={t} value={t}>
                Tier {t} ({t === 6 ? 'Suprema' : `Rank ${RANK_NAMES[t]}`})
              </option>
            ))}
          </select>

          {/* Only Customized Toggle */}
          <button
            onClick={() => setOnlyCustomized((prev) => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              onlyCustomized
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={13} className={onlyCustomized ? 'text-amber-400' : 'text-zinc-500'} />
            <span>Apenas Editadas ({totalCustomCount})</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 pt-1">
          <span>Mostrando {filteredSkills.length} habilidades encontradas</span>
          <span>Selecione uma habilidade na lista à esquerda para editar seus atributos</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List of Skills (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-3 space-y-2 max-h-[750px] overflow-y-auto">
          {filteredSkills.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-500 space-y-2">
              <AlertCircle size={24} className="mx-auto text-zinc-600" />
              <p>Nenhuma habilidade encontrada com os filtros selecionados.</p>
            </div>
          ) : (
            filteredSkills.map((sk) => {
              const isSelected = activeSkill?.id === sk.id;
              const isEdited = Boolean(customSkillsMap[sk.id]);
              const elem = ELEMENTS[sk.elementId];
              const animal = ANIMALS[sk.animalId];

              return (
                <button
                  key={sk.id}
                  onClick={() => setSelectedSkillId(sk.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all relative flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-md shadow-amber-500/5'
                      : 'bg-zinc-950/60 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <IconHelper name={elem.iconName} className="w-4 h-4 shrink-0" style={{ color: elem.colorHex }} />
                      <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-zinc-200'}`}>
                        {sk.name}
                      </span>
                    </div>

                    {isEdited && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                        Editada
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>
                      {animal.name} • {elem.name}
                    </span>
                    <span>T{sk.tier} • {sk.type}</span>
                  </div>

                  {sk.effectSummary && (
                    <span className="text-[10px] text-amber-400/90 font-mono line-clamp-1 bg-amber-950/30 px-2 py-0.5 rounded border border-amber-900/40">
                      {sk.effectSummary}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Right Form Editor (8 cols) */}
        <div className="lg:col-span-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-6">
          {activeSkill ? (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Skill Header Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner shrink-0"
                    style={{
                      backgroundColor: `${ELEMENTS[formData.elementId].colorHex}20`,
                      borderColor: ELEMENTS[formData.elementId].colorHex,
                    }}
                  >
                    <IconHelper
                      name={ELEMENTS[formData.elementId].iconName}
                      className="w-6 h-6"
                      style={{ color: ELEMENTS[formData.elementId].colorHex }}
                    />
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Guardião {ANIMALS[formData.animalId].name} • Elemento {ELEMENTS[formData.elementId].name}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                      {formData.name}
                      {isCustomized && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono font-normal">
                          Personalizada
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCustomized && (
                    <button
                      type="button"
                      onClick={handleResetCurrent}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-zinc-700"
                    >
                      <RotateCcw size={14} />
                      <span>Restaurar Padrão</span>
                    </button>
                  )}

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-amber-500/20"
                  >
                    <Save size={15} />
                    <span>Salvar Habilidade</span>
                  </button>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Nome da Habilidade</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs font-semibold text-zinc-100 focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>

                {/* Action Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Tipo de Ação</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleFieldChange('type', e.target.value as SkillActionType)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Ação Principal">Ação Principal</option>
                    <option value="Ação de Bônus">Ação de Bônus</option>
                    <option value="Ação de Movimento">Ação de Movimento</option>
                    <option value="Reação">Reação</option>
                    <option value="Passiva">Passiva</option>
                    <option value="Suprema">Suprema</option>
                  </select>
                </div>

                {/* Mana Cost */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Custo de Mana (-PMs)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formData.manaCost}
                    onChange={(e) => handleFieldChange('manaCost', Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Effect Summary Badge text */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-amber-400 block">Resumo do Efeito (Símbolos de Regra)</label>
                  <input
                    type="text"
                    placeholder="Ex: Atq+2, Def+1, -2 PMs, PVs +5, Deslocamento x2"
                    value={formData.effectSummary}
                    onChange={(e) => handleFieldChange('effectSummary', e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-amber-500/40 rounded-xl text-xs font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-zinc-500">Exibido nos cartões rápidos e modais de combate.</span>
                </div>

                {/* Dice Roll Formula */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Fórmula de Dado / Rolagem</label>
                  <input
                    type="text"
                    value={formData.diceRoll}
                    onChange={(e) => handleFieldChange('diceRoll', e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Range */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Alcance</label>
                  <input
                    type="text"
                    value={formData.range}
                    onChange={(e) => handleFieldChange('range', e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Cooldown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Tempo de Recarga</label>
                  <input
                    type="text"
                    value={formData.cooldownRec || formData.cooldown}
                    onChange={(e) => {
                      handleFieldChange('cooldownRec', e.target.value);
                      handleFieldChange('cooldown', e.target.value);
                    }}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-300 block">Duração</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => handleFieldChange('duration', e.target.value)}
                    className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">Descrição dos Efeitos Mecânicos</label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs leading-relaxed text-zinc-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Lore */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-300 block">História e Lore (Contexto narrativo)</label>
                <textarea
                  rows={2}
                  value={formData.lore}
                  onChange={(e) => handleFieldChange('lore', e.target.value)}
                  className="w-full px-3.5 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs leading-relaxed text-zinc-400 italic focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Save Footer */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Save size={16} />
                  <span>Salvar Alterações nesta Habilidade</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-12 text-center text-zinc-500 text-sm">
              Selecione uma habilidade na lista para começar a edição.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
