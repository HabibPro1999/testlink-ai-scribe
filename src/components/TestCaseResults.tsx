
import React from 'react';
import { TestCase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import TestCaseCard from './TestCaseCard';
import { generateTestLinkXML, downloadXML } from '@/lib/xmlGenerator';

interface Props {
  testCases: TestCase[];
  onReset: () => void;
}

const TestCaseResults: React.FC<Props> = ({ testCases, onReset }) => {
  const handleDownloadXML = () => {
    const xml = generateTestLinkXML(testCases);
    downloadXML(xml);
  };

  return (
    <div className="w-full max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Generated Test Cases</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onReset}>
                New Query
              </Button>
              <Button 
                variant="secondary" 
                onClick={handleDownloadXML}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download XML for TestLink</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-0">
          <div className="text-sm text-muted-foreground mb-4">
            {testCases.length} test case{testCases.length !== 1 ? 's' : ''} generated
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {testCases.map((testCase, index) => (
          <TestCaseCard key={index} testCase={testCase} index={index} />
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleDownloadXML}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span>Download XML for TestLink</span>
        </Button>
      </div>
    </div>
  );
};

export default TestCaseResults;
