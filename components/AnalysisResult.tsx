import React from 'react';
import { EvaluationResult } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

interface AnalysisResultProps {
  result: EvaluationResult;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  // Prepare data for charts
  const radarData = result.dimensions.map(d => ({
    subject: d.name,
    A: d.score,
    fullMark: d.fullMark
  }));

  const isPass = result.totalScore >= 45;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Result Banner - Conditional */}
      <div className={`rounded-3xl shadow-xl overflow-hidden text-center p-8 transform transition-all hover:scale-[1.01] ${isPass ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-orange-400 to-red-500'}`}>
        <div className="text-6xl mb-4 animate-bounce">
          {isPass ? '🎉' : '💪'}
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md">
          {isPass ? '太棒了，你已经达标！' : '差一点点，再接再厉！'}
        </h2>
        <p className="text-white/90 text-lg font-medium">
          {isPass ? '继续保持，高项证书在向你招手！' : '根据建议优化，下次一定行！'}
        </p>
      </div>

      {/* Score and Summary Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 overflow-hidden border border-white">
        <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
          
          {/* Left: Score Circle */}
          <div className="flex-shrink-0 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-48 h-48 bg-white rounded-full border-8 border-blue-50 flex flex-col items-center justify-center shadow-inner">
              <span className="text-slate-400 text-sm font-bold uppercase tracking-wide">总得分</span>
              <span className={`text-6xl font-black ${isPass ? 'text-green-500' : 'text-orange-500'}`}>
                {result.totalScore}
              </span>
              <span className="text-slate-400 font-medium">/ 75</span>
            </div>
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 px-4 py-1 rounded-full text-sm font-bold shadow-lg ${isPass ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
              {isPass ? 'PASSED' : 'FAILED'}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="flex-grow space-y-4">
             <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">综合点评</h3>
             </div>
             <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100 text-justify">
               {result.summary}
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dimension Radar Chart */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-6 border border-white flex flex-col">
          <div className="flex items-center gap-2 mb-6">
             <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
             <h3 className="text-lg font-bold text-slate-800">五维能力雷达</h3>
          </div>
          <div className="h-[300px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                <Radar
                  name="得分"
                  dataKey="A"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="#60a5fa"
                  fillOpacity={0.3}
                />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [`${value} / ${props.payload.fullMark}`, '得分']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dimension Details List */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-6 border border-white">
          <div className="flex items-center gap-2 mb-6">
             <span className="w-1 h-6 bg-indigo-500 rounded-full"></span>
             <h3 className="text-lg font-bold text-slate-800">维度得分详情</h3>
          </div>
          <div className="space-y-4">
            {result.dimensions.map((dim, idx) => (
              <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-indigo-100 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">{dim.name}</span>
                  <span className="text-sm font-extrabold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{dim.score} / {dim.fullMark}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2.5 mb-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(dim.score / dim.fullMark) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">{dim.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggestions with Quotes */}
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-100/50 p-8 border border-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
               <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
               <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
             </svg>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-800">精准优化建议</h3>
            <p className="text-slate-400 text-sm">定位具体句子，提供针对性修改意见</p>
          </div>
        </div>

        <div className="space-y-6">
          {result.suggestions.map((item, i) => (
            <div key={i} className="group bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* If there is a quote, show it */}
              {item.quote && (
                 <div className="bg-yellow-50/80 p-4 border-b border-yellow-100/50 flex gap-3 relative">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <div className="text-slate-700 italic text-sm font-medium relative z-10">
                      “{item.quote}”
                    </div>
                    {/* Decorative quote mark */}
                    <div className="absolute right-4 top-2 text-6xl text-yellow-200 opacity-30 font-serif leading-none select-none">”</div>
                 </div>
              )}
              
              <div className="p-5 flex gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200">
                    {i + 1}
                  </div>
                </div>
                <div>
                   <h4 className="font-bold text-slate-800 mb-1 text-lg">优化建议</h4>
                   <p className="text-slate-600 text-base leading-relaxed">{item.point}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Other sections (Strengths/Weaknesses) could go here, but Suggestions is the highlight */}

      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="group relative px-8 py-4 bg-slate-800 text-white rounded-full font-bold shadow-xl hover:shadow-2xl hover:bg-slate-900 transition-all transform hover:-translate-y-1 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            批改另一篇论文
          </span>
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;