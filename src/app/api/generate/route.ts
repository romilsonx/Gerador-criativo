import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: NextRequest) {
  try {
    const { theme } = await req.json();

    if (!theme || typeof theme !== 'string') {
      return NextResponse.json({ error: 'Tema inválido fornecido.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY; // Usando GEMINI_API_KEY

    if (!apiKey) {
      console.error('Chave da API do Gemini não encontrada.');
      return NextResponse.json({ error: 'A chave da API do Gemini não foi configurada no servidor.' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"}); // Usando gemini-1.5-flash

    const prompt = `Você é um gerador de ideias criativas. Dada a palavra-chave '${theme}', gere 5 slogans curtos e impactantes. Responda apenas com um array JSON de strings, onde cada string é um slogan.

Exemplo: ["Slogan 1", "Slogan 2", "Slogan 3", "Slogan 4", "Slogan 5"]`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      let content = response.text();

      // Remove os marcadores de bloco de código Markdown se existirem
      content = content.trim();
      if (content.startsWith('```json') && content.endsWith('```')) {
        content = content.substring(7, content.length - 3).trim();
      }

      const ideas: string[] = JSON.parse(content);

      // Validação básica para garantir que é um array de strings
      if (!Array.isArray(ideas) || !ideas.every(item => typeof item === 'string')) {
        throw new Error('Formato de resposta inesperado da API do Gemini.');
      }

      return NextResponse.json({ ideas });

    } catch (apiError) {
      console.error('Erro na chamada da API do Gemini:', apiError);
      return NextResponse.json({ error: 'Falha ao comunicar com a API do Gemini.' }, { status: 502 });
    }

  } catch (error) {
    console.error('Erro na API route:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
