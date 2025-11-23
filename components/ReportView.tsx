import React from 'react';

const ReportView: React.FC = () => {
  // 这里应该从面试记录中生成报告
  // 暂时使用模拟数据
  const mockReport = {
    overallScore: 85,
    strengths: [
      '技术基础扎实，对React生态有深入理解',
      '表达清晰，逻辑性强',
      '项目经验丰富，能够举一反三',
    ],
    improvements: [
      '可以更多地展示具体的项目成果和数据',
      '对于系统设计问题的回答可以更加深入',
      '建议提前准备一些行为面试问题的STAR回答',
    ],
    detailedFeedback: `整体表现良好，展现出了扎实的技术功底和良好的沟通能力。
在技术深度方面表现突出，但在展示项目影响力时可以更加量化。
建议在后续面试中注意以下几点：
1. 准备更多具体的数据和案例
2. 加强对系统设计的理解
3. 练习STAR法则回答行为问题`,
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">面试报告</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-lg font-semibold">总体评分</span>
          <span className="text-3xl font-bold text-blue-600">{mockReport.overallScore}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all duration-500"
            style={{ width: `${mockReport.overallScore}%` }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-green-600">优势</h3>
        <ul className="list-disc list-inside space-y-2">
          {mockReport.strengths.map((strength, idx) => (
            <li key={idx} className="text-gray-700">{strength}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 text-orange-600">需要改进</h3>
        <ul className="list-disc list-inside space-y-2">
          {mockReport.improvements.map((improvement, idx) => (
            <li key={idx} className="text-gray-700">{improvement}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">详细反馈</h3>
        <div className="bg-gray-50 p-4 rounded-md whitespace-pre-line text-gray-700">
          {mockReport.detailedFeedback}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          开始新的面试
        </button>
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          打印报告
        </button>
      </div>
    </div>
  );
};

export default ReportView;