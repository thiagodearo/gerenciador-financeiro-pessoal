
import { GoogleGenAI } from "@google/genai";
import { CATEGORIES } from '../constants';

// FIX: Aligned with Gemini API guidelines by removing the `as string` type assertion for the API key.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const categorizeTransaction = async (description: string): Promise<string> => {
  // FIX: Removed the check for `process.env.API_KEY` existence, as the guidelines mandate assuming its availability.
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