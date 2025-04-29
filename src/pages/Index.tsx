
import React, { useState } from 'react';
import { generateTestCases } from '@/lib/openRouterService';
import { Language, TestCase, UserStoryInput } from '@/lib/types';
import UserStoryForm from '@/components/UserStoryForm';
import TestCaseResults from '@/components/TestCaseResults';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Index = () => {
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("en");

  const handleSubmit = async (data: UserStoryInput) => {
    setError(null);
    setLoading(true);
    setCurrentLanguage(data.language);

    try {
      const generatedTestCases = await generateTestCases(data.userStory, data.additionalContext, data.language);
      setTestCases(generatedTestCases);
      
      const successMessage = data.language === "fr" 
        ? "Cas de test générés avec succès!" 
        : "Test cases generated successfully!";
      toast.success(successMessage);
    } catch (err) {
      console.error("Error generating test cases:", err);
      
      const errorMessage = data.language === "fr"
        ? "Échec de la génération des cas de test. Veuillez vérifier votre clé API et réessayer."
        : "Failed to generate test cases. Please check your API key and try again.";
        
      setError(err instanceof Error ? err.message : errorMessage);
      toast.error(data.language === "fr" ? "Échec de la génération des cas de test" : "Failed to generate test cases");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTestCases([]);
  };

  const getHeaderText = () => {
    return currentLanguage === "fr" ? "TestLink AI Scribe" : "TestLink AI Scribe";
  };

  const getSubHeaderText = () => {
    return currentLanguage === "fr" 
      ? "Générez des cas de test compatibles avec TestLink à partir d'user stories grâce à l'IA" 
      : "Generate TestLink-compatible test cases from user stories using AI";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-6">
          <h1 className="text-3xl font-bold text-center">{getHeaderText()}</h1>
          <p className="text-center text-gray-600 mt-2">
            {getSubHeaderText()}
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {testCases.length === 0 ? (
          <div className="flex flex-col items-center">
            <div className="max-w-3xl w-full">
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-3">
                  {currentLanguage === "fr" ? "Comment ça marche" : "How it works"}
                </h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  {currentLanguage === "fr" ? (
                    <>
                      <li>Entrez votre user story dans le formulaire ci-dessous</li>
                      <li>Ajoutez tout contexte supplémentaire qui pourrait être utile</li>
                      <li>Entrez votre clé API OpenRouter</li>
                      <li>Générez des cas de test détaillés à l'aide de l'IA</li>
                      <li>Téléchargez le fichier XML pour l'importation dans TestLink</li>
                    </>
                  ) : (
                    <>
                      <li>Enter your user story in the form below</li>
                      <li>Add any additional context that might be helpful</li>
                      <li>Enter your OpenRouter API key</li>
                      <li>Generate detailed test cases using AI</li>
                      <li>Download the XML file for import into TestLink</li>
                    </>
                  )}
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
          <TestCaseResults testCases={testCases} onReset={handleReset} language={currentLanguage} />
        )}
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto py-6 px-4">
          <p className="text-center text-gray-500 text-sm">
            {currentLanguage === "fr" 
              ? `TestLink AI Scribe &copy; ${new Date().getFullYear()} - Utilisant les modèles IA d'OpenRouter`
              : `TestLink AI Scribe &copy; ${new Date().getFullYear()} - Using OpenRouter AI models`}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
