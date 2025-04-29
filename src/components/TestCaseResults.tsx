
import React from 'react';
import { Language, TestCase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import TestCaseCard from './TestCaseCard';
import { generateTestLinkXML, downloadXML } from '@/lib/xmlGenerator';

interface Props {
  testCases: TestCase[];
  onReset: () => void;
  language: Language;
}

const TestCaseResults: React.FC<Props> = ({ testCases, onReset, language }) => {
  const handleDownloadXML = () => {
    const xml = generateTestLinkXML(testCases);
    downloadXML(xml);
  };

  const translations = {
    generatedTestCases: language === "fr" ? "Cas de Test Générés" : "Generated Test Cases",
    newQuery: language === "fr" ? "Nouvelle Requête" : "New Query",
    downloadXml: language === "fr" ? "Télécharger XML pour TestLink" : "Download XML for TestLink",
    testCasesGenerated: (count: number) => {
      if (language === "fr") {
        return `${count} cas de test ${count !== 1 ? 's' : ''} généré${count !== 1 ? 's' : ''}`;
      }
      return `${count} test case${count !== 1 ? 's' : ''} generated`;
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{translations.generatedTestCases}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset}>
                {translations.newQuery}
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleDownloadXML}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>{translations.downloadXml}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="text-sm text-muted-foreground mb-4">
            {translations.testCasesGenerated(testCases.length)}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {testCases.map((testCase, index) => (
          <TestCaseCard key={index} testCase={testCase} index={index} language={language} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleDownloadXML}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>{translations.downloadXml}</span>
        </Button>
      </div>
    </div>
  );
};

export default TestCaseResults;
