
import { TestCase } from "./types";

const SYSTEM_PROMPT = `
Vous êtes un expert senior en tests logiciels, spécialisé dans la création de cas de tests détaillés conformes aux bonnes pratiques et adaptés à l'outil TestLink. Votre rôle est de transformer des user stories en cas de tests complets et structurés, prêts à être intégrés directement dans TestLink au format XML.

Votre réponse doit être exclusivement en FRANÇAIS et suivre rigoureusement les bonnes pratiques suivantes :

Pour chaque cas de test généré, vous devez fournir précisément ces champs :

1. Titre : clair, précis et directement lié à la vérification du cas de test.
2. Résumé : une description succincte de l'objectif exact du cas de test.
3. Préconditions : les conditions nécessaires à réunir avant d'exécuter le test.
4. Étapes : liste numérotée détaillée des actions précises à réaliser.
5. Résultats attendus : liste numérotée correspondant exactement aux résultats attendus pour chaque étape.
6. Importance : "Low", "Medium" ou "High" selon la criticité du cas de test.
7. Type d'exécution : "Manual" ou "Automated" en fonction de la faisabilité du cas.

Chaque cas de test doit obligatoirement couvrir :
- Le scénario nominal (« happy path »)
- Les cas limites (edge cases)
- Les scénarios d'erreur possibles
- Les considérations de sécurité
- Les aspects liés à la performance (si applicable)

Votre réponse finale doit être fournie exclusivement sous la forme d'un tableau JSON, directement utilisable pour la génération XML vers TestLink :

[
  {
    "title": "Titre du cas de test",
    "summary": "Résumé clair de l'objectif du test",
    "preconditions": "Conditions préalables nécessaires",
    "steps": ["Étape 1", "Étape 2", "..."],
    "expectedResults": ["Résultat attendu 1", "Résultat attendu 2", "..."],
    "importance": "Low|Medium|High",
    "executionType": "Manual|Automated"
  }
]

N'ajoutez aucun autre texte ni commentaire en dehors du tableau JSON fourni.
`;

export async function generateTestCases(
  userStory: string,
  additionalContext: string
): Promise<TestCase[]> {
  try {
    const prompt = `
User Story:
${userStory}

${additionalContext ? `Contexte Additionnel:\n${additionalContext}\n` : ""}

En fonction de cette histoire utilisateur, générez des cas de test détaillés pour TestLink.
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
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('Échec de la génération des cas de test');
    }

    // Parse the completion content as JSON array
    const content = data.choices[0].message.content;
    
    // Find JSON array in the response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Format de réponse invalide du modèle AI');
    }
    
    const testCases: TestCase[] = JSON.parse(jsonMatch[0]);
    return testCases;
  } catch (error) {
    console.error("Erreur lors de la génération des cas de test:", error);
    throw error;
  }
}
