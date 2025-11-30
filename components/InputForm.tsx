import React, { useState } from 'react';
import { AnalysisStatus } from '../types';

interface InputFormProps {
  onAnalyze: (text: string) => void;
  status: AnalysisStatus;
}

const COLORS = [
  '#000000', '#334155', '#475569', // Grays
  '#dc2626', '#ea580c', '#d97706', // Red/Orange/Amber
  '#65a30d', '#16a34a', '#059669', // Greens
  '#0d9488', '#0891b2', '#0284c7', // Teals/Cyans/Blues
  '#2563eb', '#4f46e5', '#7c3aed', // Blue/Indigo/Violet
  '#9333ea', '#c026d3', '#db2777'  // Purple/Fuchsia/Pink
];

const InputForm: React.FC<InputFormProps> = ({ onAnalyze, status }) => {
  const [text, setText] = useState('');
  const [textColor, setTextColor] = useState('#000000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 50) {
      onAnalyze(text);
    }
  };

  const isAnalyzing = status === AnalysisStatus.ANALYZING;

  const placeholderText = `请在此处粘贴您的软考高项论文...

建议格式：
【摘要】
...
【正文】
...

提示：
1. 论文通常要求2000-2500字。
2. 请确保包含项目背景、过渡、主要过程（理论结合实践）、结尾等部分。`;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-blue-100/50 p-6 md:p-8 border border-white">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 text-blue-600 rounded-2xl mb-4 shadow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">开始您的论文诊断</h2>
        <p className="text-slate-500 mt-2 text-lg">
          粘贴论文，选择喜欢的颜色，让AI为您提供专业建议。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Color Picker Toolbar */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex flex-wrap gap-2 justify-center items-center shadow-sm">
          <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider">字体颜色</span>
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setTextColor(color)}
              className={`w-6 h-6 rounded-full border-2 transition-transform hover:scale-110 ${textColor === color ? 'border-slate-800 scale-110 shadow-md' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <div className="relative group">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholderText}
            style={{ color: textColor }}
            className="w-full h-96 p-6 rounded-2xl border-2 border-slate-100 bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all resize-y leading-relaxed font-mono text-base shadow-inner outline-none"
            disabled={isAnalyzing}
          />
          <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400 bg-slate-100/90 px-3 py-1 rounded-full backdrop-blur">
            当前字数: {text.length}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isAnalyzing || text.length < 50}
            className={`
              w-full md:w-2/3 py-4 rounded-full font-bold text-xl shadow-lg transition-all transform
              ${isAnalyzing || text.length < 50
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-300/50 hover:-translate-y-1 active:translate-y-0'}
            `}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在深度分析 (约需10-20秒)...
              </span>
            ) : (
              '提交 AI 批改'
            )}
          </button>
          {text.length > 0 && text.length < 50 && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded-full">内容过短，请至少输入50个字。</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default InputForm;