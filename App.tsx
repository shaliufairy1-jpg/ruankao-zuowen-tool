import React, { useState } from 'react';
import InputForm from './components/InputForm';
import AnalysisResult from './components/AnalysisResult';
import { analyzeEssay } from './services/geminiService';
import { EvaluationResult, AnalysisStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setStatus(AnalysisStatus.ANALYZING);
    setErrorMsg(null);
    try {
      const evaluation = await analyzeEssay(text);
      setResult(evaluation);
      setStatus(AnalysisStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AnalysisStatus.ERROR);
      setErrorMsg(err.message || "发生未知错误，请重试");
    }
  };

  const handleReset = () => {
    setResult(null);
    setStatus(AnalysisStatus.IDLE);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-100 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl p-2 shadow-lg shadow-blue-500/20">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
               </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">软考高项论文<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">AI批改助手</span></h1>
          </div>
          <div className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100 hidden sm:block">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        {/* Background decorative blobs */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10">
          {status === AnalysisStatus.ERROR && (
            <div className="max-w-4xl mx-auto mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-xl shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-700">{errorMsg}</p>
                </div>
              </div>
            </div>
          )}

          {status === AnalysisStatus.SUCCESS && result ? (
            <AnalysisResult result={result} onReset={handleReset} />
          ) : (
            <>
               {status === AnalysisStatus.IDLE || status === AnalysisStatus.ANALYZING || status === AnalysisStatus.ERROR ? (
                 <div className="flex flex-col items-center">
                   <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
                     <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-6 leading-tight">
                       智能分析，<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">助力一次通过</span>
                     </h2>
                     <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                       利用先进的AI大模型，模拟软考阅卷标准，为您提供全方位的论文诊断、评分与精准优化建议。
                     </p>
                   </div>
                   <InputForm onAnalyze={handleAnalyze} status={status} />
                 </div>
               ) : null}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
          <p className="text-center text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} 软考高项论文AI批改助手
          </p>
          <p className="text-slate-300 text-xs mt-2">
            本工具评分仅供参考，不代表官方阅卷结果
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;