import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// --- Configuração da API do Google Gemini ---

// Carrega a chave de API do ambiente. É crucial para a segurança que a chave não esteja no código-fonte.
const API_KEY = process.env.GOOGLE_API_KEY;

// Validação inicial: garante que a chave de API foi configurada antes de continuar.
if (!API_KEY) {
  throw new Error('Google API key is not set in environment variables');
}

// Inicializa o cliente da Google AI com a chave de API.
const genAI = new GoogleGenerativeAI(API_KEY);

// --- Handler para Requisições POST ---

/**
 * Processa requisições POST para gerar ideias criativas usando a API do Google Gemini.
 * @param {NextRequest} req - O objeto da requisição, contendo o tema ou palavra-chave.
 * @returns {NextResponse} - Uma resposta JSON com as ideias geradas ou uma mensagem de erro.
 */
export async function POST(req: NextRequest) {
  try {
    // Extrai o tema ou palavra-chave do corpo da requisição JSON.
    const { theme } = await req.json();

    // Validação de entrada: verifica se o tema é válido e não está vazio.
    if (!theme || typeof theme !== 'string') {
      return NextResponse.json({ error: 'Tema inválido fornecido.' }, { status: 400 });
    }

    // --- Configurações de Segurança (Safety Settings) ---
    // Estas configurações instruem o modelo Gemini a bloquear conteúdo potencialmente prejudicial.
    // São aplicadas na inicialização do modelo para garantir que todas as interações sigam estas diretrizes.
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // Seleciona o modelo de IA a ser usado e aplica as configurações de segurança.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings});

    // --- Engenharia de Prompt ---
    // O prompt é a instrução detalhada para a IA. Ele define:
    // 1. O papel da IA ("gerador de ideias criativas").
    // 2. O formato de saída obrigatório (array JSON de strings).
    // 3. O tema ou palavra-chave para a geração.
    const prompt = `Você é um gerador de ideias criativas. Dada a palavra-chave '${theme}', gere 5 slogans curtos e impactantes. Responda apenas com um array JSON de strings, onde cada string é um slogan.\n\nExemplo: ["Slogan 1", "Slogan 2", "Slogan 3", "Slogan 4", "Slogan 5"]`;

    // Faz a chamada à API do Gemini com o prompt.
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let content = response.text(); // O conteúdo bruto da resposta da IA.

    // --- Pós-processamento da Resposta da IA ---
    // A IA pode ocasionalmente incluir marcadores de bloco de código Markdown (```json) na resposta.
    // Este bloco remove esses marcadores para garantir que o JSON seja parsável.
    content = content.trim();
    if (content.startsWith('```json') && content.endsWith('```')) {
      content = content.substring(7, content.length - 3).trim();
    }

    // Tenta fazer o parse do texto da resposta para um array JSON de strings.
    const ideas: string[] = JSON.parse(content);

    // Validação básica para garantir que a resposta é um array de strings.
    if (!Array.isArray(ideas) || !ideas.every(item => typeof item === 'string')) {
      throw new Error('Formato de resposta inesperado da API do Gemini.');
    }

    // Retorna as ideias geradas em formato JSON para o frontend.
    return NextResponse.json({ ideas });

  } catch (error) {
    // --- Tratamento de Erros ---
    console.error('Erro na API route:', error);
    
    // Se o erro for de sintaxe, indica que a IA não retornou um JSON válido.
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Falha ao processar a resposta da IA. O formato retornado não é um JSON válido.' }, { status: 500 });
    }
    // Para outros erros internos, retorna uma mensagem genérica.
    return NextResponse.json({ error: 'Erro interno do servidor ao gerar ideias.' }, { status: 500 });
  }
}