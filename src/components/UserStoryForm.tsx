
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Language, UserStoryInput, languageLabels } from "@/lib/types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  onSubmit: (data: UserStoryInput) => void;
  isLoading: boolean;
  error: string | null;
}

const UserStoryForm: React.FC<Props> = ({ onSubmit, isLoading, error }) => {
  const [userStory, setUserStory] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [apiKey, setApiKey] = useState(localStorage.getItem("openRouterApiKey") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save API key to local storage
    if (apiKey) {
      localStorage.setItem("openRouterApiKey", apiKey);
    }
    
    onSubmit({
      userStory,
      additionalContext,
      language
    });
  };

  const getPlaceholder = () => {
    if (language === "fr") {
      return "En tant que [rôle], je veux [action], afin de [bénéfice]";
    }
    return "As a [role], I want to [action], so that [benefit]";
  };

  const getContextPlaceholder = () => {
    if (language === "fr") {
      return "Entrez toute information supplémentaire qui pourrait aider à générer de meilleurs cas de test...";
    }
    return "Enter any additional information that might help in generating better test cases...";
  };

  return (
    <Card className="w-full max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>
            {language === "fr" ? "Saisie d'Utilisateur" : "User Story Input"}
          </CardTitle>
          <CardDescription>
            {language === "fr" 
              ? "Entrez une user story pour générer des cas de test pour TestLink" 
              : "Enter a user story to generate test cases for TestLink"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">
              {language === "fr" ? "Langue" : "Language"}
            </Label>
            <Select 
              value={language} 
              onValueChange={(value: Language) => setLanguage(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(languageLabels).map(([code, label]) => (
                  <SelectItem key={code} value={code}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="userStory">
              {language === "fr" ? "User Story" : "User Story"}
            </Label>
            <Textarea
              id="userStory"
              placeholder={getPlaceholder()}
              value={userStory}
              onChange={(e) => setUserStory(e.target.value)}
              rows={5}
              required
              className="resize-y"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="context">
              {language === "fr" ? "Contexte Additionnel (optionnel)" : "Additional Context (optional)"}
            </Label>
            <Textarea
              id="context"
              placeholder={getContextPlaceholder()}
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={3}
              className="resize-y"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">
              {language === "fr" ? "Clé API OpenRouter" : "OpenRouter API Key"}
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder={language === "fr" ? "Entrez votre clé API OpenRouter" : "Enter your OpenRouter API key"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              {language === "fr" ? "Obtenez votre clé API gratuite sur" : "Get your free API key at"}{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading 
              ? (language === "fr" ? "Génération des cas de test..." : "Generating Test Cases...") 
              : (language === "fr" ? "Générer des cas de test" : "Generate Test Cases")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UserStoryForm;
