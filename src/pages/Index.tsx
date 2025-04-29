
import React, { useState } from 'react';
import { generateTestCases } from '@/lib/openRouterService';
import { TestCase, UserStoryInput } from '@/lib/types';
import UserStoryForm from '@/components/UserStoryForm';
import TestCaseResults from '@/components/TestCaseResults';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Index = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: UserStoryInput) => {
    setError(null);
    setLoading(true);

    try {
      const generatedTestCases = await generateTestCases(data.userStory, data.additionalContext);
      setTestCases(generatedTestCases);
      toast.success("Test cases generated successfully!");
    } catch (err) {
      console.error("Error generating test cases:", err);
      setError(
        err instanceof Error 
          ? err.message 
          : "Failed to generate test cases. Please check your API key and try again."
      );
      toast.error("Failed to generate test cases");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTestCases([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-center">TestLink AI Scribe</h1>
          <p className="text-center text-gray-600 mt-2">
            Generate TestLink-compatible test cases from user stories using AI
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {testCases.length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="max-w-3xl w-full">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">How it works</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Enter your user story in the form below</li>
                  <li>Add any additional context that might be helpful</li>
                  <li>Enter your OpenRouter API key</li>
                  <li>Generate detailed test cases using AI</li>
                  <li>Download the XML file for import into TestLink</li>
                </ol>
              </div>
              
              <UserStoryForm 
                onSubmit={handleSubmit} 
                isLoading={loading} 
                error={error}
              />
            </div>
          </div>
        ) : (
          <TestCaseResults testCases={testCases} onReset={handleReset} />
        )}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-gray-500 text-sm">
            TestLink AI Scribe &copy; {new Date().getFullYear()} - Using OpenRouter AI models
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
