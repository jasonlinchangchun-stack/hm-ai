import React, { useState } from 'react';
import SetupForm from './components/SetupForm';
import ChatInterface from './components/ChatInterface';
import ReportView from './components/ReportView';
import { InterviewConfig } from './types';

function App() {
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [showReport, setShowReport] = useState(false);

  const handleSetupComplete = (setupConfig: InterviewConfig) => {
    setConfig(setupConfig);
  };

  const handleInterviewComplete = () => {
    setShowReport(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">InterviewPro.AI</h1>
          <p className="text-sm text-gray-600">AI驱动的求职面试助教</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!config && <SetupForm onComplete={handleSetupComplete} />}
        {config && !showReport && (
          <ChatInterface config={config} onComplete={handleInterviewComplete} />
        )}
        {showReport && <ReportView />}
      </main>
    </div>
  );
}

export default App;