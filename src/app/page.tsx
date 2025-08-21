"use client";

import { useState, useEffect } from "react";

const MAX_QUERIES = 5; // Limite de consultas por sessão

type Idea = string;

export default function HomePage() {
  const [theme, setTheme] = useState("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queriesLeft, setQueriesLeft] = useState(MAX_QUERIES);
  const [copySuccess, setCopySuccess] = useState<number | null>(null); // Para feedback de cópia

  // Carrega o contador do localStorage ao iniciar
  useEffect(() => {
    const storedQueries = localStorage.getItem('creativeGeneratorQueriesLeft');
    if (storedQueries) {
      setQueriesLeft(parseInt(storedQueries, 10));
    }
  }, []);

  // Salva o contador no localStorage sempre que ele muda
  useEffect(() => {
    localStorage.setItem('creativeGeneratorQueriesLeft', queriesLeft.toString());
  }, [queriesLeft]);

  const handleGenerateIdeas = async () => {
    if (queriesLeft <= 0) {
      setError("Limite de 5 consultas por sessão atingido. Por favor, reinicie a sessão.");
      return;
    }

    if (!theme.trim()) {
      setError("Por favor, insira um tema ou palavra-chave para gerar ideias.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      });

      if (!response.ok) {
        throw new Error(`A resposta da API não foi bem-sucedida: ${response.statusText}`);
      }

      const data: { ideas: Idea[] } = await response.json();
      setIdeas(data.ideas);
      setQueriesLeft(prev => prev - 1); // Decrementa o contador

    } catch (err) {
      setError("Ocorreu um erro ao gerar ideias. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setQueriesLeft(MAX_QUERIES);
    setError(null);
    setTheme("");
    setIdeas([]);
    localStorage.removeItem('creativeGeneratorQueriesLeft');
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(index);
      setTimeout(() => setCopySuccess(null), 2000); // Feedback visual por 2 segundos
    }).catch(err => {
      console.error('Erro ao copiar: ', err);
      setError('Falha ao copiar o texto.');
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 text-gray-800 p-4 sm:p-6 md:p-8" role="main">
      <div className="w-full max-w-3xl">
        <header className="text-center mb-8" role="banner">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Gerador Criativo</h1>
          <p className="text-md sm:text-lg text-gray-600">
            Digite um tema ou palavra-chave e gere slogans, ideias ou frases criativas.
          </p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md mb-8" aria-labelledby="input-section-title">
          <h2 id="input-section-title" className="sr-only">Entrada de Tema</h2>
          <label htmlFor="theme-input" className="block text-sm font-medium text-gray-700 mb-2">Tema ou Palavra-chave:</label>
          <input
            id="theme-input"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Ex: Marketing, Sustentabilidade, Inovação..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            disabled={isLoading || queriesLeft <= 0}
            aria-describedby="theme-input-help"
          />
          <p id="theme-input-help" className="sr-only">Digite o tema para o qual você deseja gerar ideias criativas.</p>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-2">
            <button
              onClick={handleGenerateIdeas}
              disabled={isLoading || queriesLeft <= 0}
              className="w-full sm:w-auto flex-1 bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center"
              aria-live="polite"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                "Gerar Ideias"
              )}
            </button>
            <button
              onClick={handleResetSession}
              className="w-full sm:w-auto bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
              aria-label="Reiniciar contador de sessões"
            >
              Reiniciar Sessão
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2 text-right" aria-live="polite">Consultas restantes: {queriesLeft} de {MAX_QUERIES}</p>
        </section>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert" aria-live="assertive">
            <p>{error}</p>
          </div>
        )}

        {ideas.length > 0 && (
          <section className="mt-6 bg-white p-6 rounded-xl shadow-md animate-fade-in" aria-labelledby="results-section-title">
            <h2 id="results-section-title" className="text-2xl font-semibold text-gray-900 mb-4">Ideias Geradas</h2>
            <ul className="space-y-3" role="list">
              {ideas.map((idea, index) => (
                <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-800 flex-1 mr-4">{idea}</p>
                  <button
                    onClick={() => copyToClipboard(idea, index)}
                    className="bg-green-500 text-white text-sm font-semibold py-1 px-3 rounded-lg hover:bg-green-600 transition duration-200 flex items-center"
                    aria-label={copySuccess === index ? "Copiado!" : `Copiar slogan: ${idea}`}
                  >
                    {copySuccess === index ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    )}
                    <span className="ml-1 hidden sm:inline">{copySuccess === index ? "Copiado!" : "Copiar"}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}