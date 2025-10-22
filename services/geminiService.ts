
import { GoogleGenAI } from "@google/genai";
import { CATEGORIES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const categorizeTransaction = async (description: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY for Gemini is not set. Returning 'Outros'.");
    return 'Outros';
  }

  try {
    const prompt = `Categorize a seguinte descrição de despesa em uma das seguintes categorias: ${CATEGORIES.join(', ')}. Descrição: "${description}". Responda apenas com o nome da categoria. Se não tiver certeza, responda "Outros".`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    const category = response.text.trim();

    // Validate if the returned category is one of the allowed ones
    if (CATEGORIES.includes(category)) {
      return category;
    }

    return 'Outros';
  } catch (error) {
    console.error("Error categorizing transaction with Gemini:", error);
    return 'Outros';
  }
};
