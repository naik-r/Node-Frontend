import React, { useState } from 'react';
import { Copy, Send, CheckCircle, XCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import toast from 'react-hot-toast';

interface ChatbotIntegrationProps {
  organizationId: string;
}

export function ChatbotIntegration({ organizationId }: ChatbotIntegrationProps) {
  const [integrationMethod, setIntegrationMethod] = useState<'code' | 'email' | null>(null);
  const [isTestSuccessful, setIsTestSuccessful] = useState<boolean | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const scriptCode = `<script src="https://chatbot.example.com/widget/${organizationId}"></script>`;

  const copyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    toast.success('Code copied to clipboard!');
  };

  const sendEmail = () => {
    // Simulate sending email
    toast.success('Installation instructions sent to developer!');
  };

  const testIntegration = () => {
    // Simulate testing integration
    const success = Math.random() > 0.5;
    setIsTestSuccessful(success);
    if (success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  return (
    <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg">
      {showConfetti && <Confetti />}

      <h2 className="text-2xl font-bold text-center mb-8">Chatbot Integration</h2>

      {!integrationMethod ? (
        <div className="space-y-4">
          <button
            onClick={() => setIntegrationMethod('code')}
            className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">Copy-Paste Code</h3>
            <p className="text-sm text-gray-600">Add a simple script tag to your website</p>
          </button>

          <button
            onClick={() => setIntegrationMethod('email')}
            className="w-full p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <h3 className="font-semibold">Email Developer</h3>
            <p className="text-sm text-gray-600">Send installation instructions to your developer</p>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {integrationMethod === 'code' && (
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg relative">
                <pre className="text-sm overflow-x-auto">{scriptCode}</pre>
                <button
                  onClick={copyCode}
                  className="absolute top-2 right-2 p-2 hover:bg-gray-200 rounded"
                >
                  <Copy className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {integrationMethod === 'email' && (
            <button
              onClick={sendEmail}
              className="w-full flex items-center justify-center space-x-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-5 w-5" />
              <span>Send Instructions</span>
            </button>
          )}

          <div className="border-t pt-6">
            <button
              onClick={testIntegration}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              Test Integration
            </button>
          </div>

          {isTestSuccessful !== null && (
            <div className={`p-4 rounded-lg ${isTestSuccessful ? 'bg-green-50' : 'bg-red-50'}`}>
              {isTestSuccessful ? (
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>Integration successful! Your chatbot is ready to use.</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-700">
                  <XCircle className="h-5 w-5" />
                  <span>Integration failed. Please try again or contact support.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}