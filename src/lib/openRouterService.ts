
import { Language, TestCase } from "./types";

const getSystemPrompt = (language: Language) => `
You are a specialized software testing expert who generates detailed test cases for TestLink based on user stories.
For each user story, you must generate comprehensive test cases that cover different aspects, edge cases, and user flows.

${language === "fr" ? `
Vous devez répondre EN FRANÇAIS.
Pour chaque cas de test, vous devez fournir les champs suivants:
1. Titre - Un titre clair et concis pour le cas de test
2. Résumé - Une brève description de ce que le cas de test vérifie
3. Préconditions - Conditions qui doivent être satisfaites avant l'exécution du test
4. Étapes - Liste numérotée des étapes pour exécuter le test
5. Résultats attendus - Liste numérotée des résultats attendus correspondant à chaque étape
6. Importance - Soit "Low", "Medium", ou "High" selon l'importance du cas de test
7. Type d'exécution - Soit "Manual" ou "Automated"

Pensez toujours à tous les scénarios possibles, y compris:
- Scénarios du chemin heureux (happy path)
- Cas limites
- Conditions d'erreur
- Considérations de sécurité
- Aspects de performance (si pertinent)
` : `
You must respond IN ENGLISH.
For each test case, you must provide the following fields:
1. Title - A clear, concise title for the test case
2. Summary - A brief description of what the test case verifies
3. Preconditions - Conditions that must be met before the test can be executed
4. Steps - Numbered list of steps to execute the test
5. Expected Results - Numbered list of expected outcomes corresponding to each step
6. Importance - Either "Low", "Medium", or "High" based on the test case's importance
7. Execution Type - Either "Manual" or "Automated"

Always think about all possible scenarios, including:
- Happy path scenarios
- Edge cases
- Error conditions
- Security considerations
- Performance aspects (if relevant)
`}

Respond with a **single JSON array** of test cases (start with "[" and end with "]):
{
  "title": "Test Case Title",
  "summary": "Brief description of what this test verifies",
  "preconditions": "Conditions required before test execution",
  "steps": ["Step 1", "Step 2", ...],
  "expectedResults": ["Expected result 1", "Expected result 2", ...],
  "importance": "Low|Medium|High",
  "executionType": "Manual|Automated"
}

${language === "fr" ? "Votre réponse doit être entièrement en français." : "Your response must be entirely in English."}
`;

export async function generateTestCases(
  userStory: string,
  additionalContext: string,
  language: Language = "en"
): Promise<TestCase[]> {
  try {
    const systemPrompt = getSystemPrompt(language);
    
    const prompt = `
${language === "fr" ? "User Story (Histoire Utilisateur):" : "User Story:"}
${userStory}

${additionalContext ? `${language === "fr" ? "Contexte Additionnel:" : "Additional Context:"}\n${additionalContext}\n` : ""}

${language === "fr" 
  ? "En fonction de cette histoire utilisateur, générez des cas de test détaillés pour TestLink."
  : "Based on this user story, generate detailed test cases for TestLink."}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("openRouterApiKey") || ""}`,
        "HTTP-Referer": window.location.href,
        "X-Title": "TestCase Generator"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-30b-a3b:free", // Using a reliable free model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error?.message || (language === "fr" ? 'Échec de la génération des cas de test' : 'Failed to generate test cases'));
    }

    // Parse the completion content as JSON array
    const content = data.choices[0].message.content;
    
    // Find JSON array in the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error(language === "fr" ? 'Format de réponse invalide du modèle AI' : 'Invalid response format from AI model');
    }
    
    const testCases: TestCase[] = JSON.parse(jsonMatch[0]);
    return testCases;
  } catch (error) {
    console.error("Error generating test cases:", error);
    throw error;
  }
}
