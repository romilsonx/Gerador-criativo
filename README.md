# Gerador Criativo com IA

Este é um aplicativo web construído com Next.js que utiliza a API do Google Gemini para gerar slogans, ideias ou frases criativas com base em um tema fornecido pelo usuário. O projeto demonstra o uso criativo de IA para geração de conteúdo, com foco em responsividade e acessibilidade.

## Funcionalidades

- Geração de slogans, ideias ou frases criativas em tempo real.
- Interface de usuário intuitiva e responsiva.
- Limite de 5 consultas por sessão para demonstração.
- Utiliza a API do Google Gemini (modelo `gemini-1.5-flash`).
- **Acessibilidade (A11y):** Desenvolvido com foco em inclusão, utilizando HTML semântico, atributos ARIA e garantindo navegação por teclado e contraste adequado.

## Tecnologias Utilizadas

- **Next.js:** Framework React para desenvolvimento de aplicações web.
- **React:** Biblioteca JavaScript para construção de interfaces de usuário.
- **Tailwind CSS:** Framework CSS para estilização rápida e responsiva.
- **Google Gemini API:** Para processamento e geração de texto com IA.
- **TypeScript:** Linguagem de programação que adiciona tipagem estática ao JavaScript.

## Como Instalar e Rodar o Projeto Localmente

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter o Node.js (versão 18 ou superior) e o npm (ou yarn) instalados em seu sistema.

### 1. Clone o Repositório

```bash
git clone https://github.com/romilsonx/Gerador-criativo.git
cd Gerador-criativo/site
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure a Chave da API do Gemini

Crie um arquivo `.env.local` na raiz do diretório `site` (onde está o `package.json`) e adicione sua chave da API do Google Gemini:

```
GEMINI_API_KEY=SUA_CHAVE_DA_API_DO_GEMINI_AQUI
```

Você pode obter sua chave da API do Gemini no [Google AI Studio](https://aistudio.google.com/app/apikey).

### 4. Execute o Servidor de Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:3000` (ou outra porta, se a 3000 estiver em uso).

## Como Usar

1.  Acesse o aplicativo em seu navegador.
2.  Digite um tema ou palavra-chave no campo de entrada.
3.  Clique no botão "Gerar Ideias".
4.  Os slogans ou ideias geradas serão exibidos abaixo. Você pode clicar no botão de copiar ao lado de cada ideia para copiá-la para a área de transferência.
5.  Você tem um limite de 5 consultas por sessão. Para reiniciar o contador, clique em "Reiniciar Sessão".

## Acessibilidade (A11y)

Este projeto foi desenvolvido com as seguintes considerações de acessibilidade:

- **HTML Semântico:** Utilização de tags HTML apropriadas para estruturar o conteúdo (e.g., `<main>`, `<header>`, `<section>`, `<button>`, `<label>`, `<ul>`, `<li>`).
- **Atributos ARIA:** Uso de atributos `aria-label`, `aria-describedby`, `aria-live`, `role` e `aria-busy` para fornecer informações adicionais a tecnologias assistivas, como leitores de tela.
- **Navegação por Teclado:** Todos os elementos interativos são acessíveis e operáveis via teclado.
- **Foco Visível:** O foco dos elementos interativos é claramente indicado para usuários de teclado.
- **Contraste de Cores:** As cores de texto e fundo foram escolhidas para garantir um contraste adequado, facilitando a leitura para pessoas com baixa visão.
- **Alternativas de Texto:** Ícones e imagens possuem atributos `alt` ou `aria-hidden` quando apropriado.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## Licença

Este projeto está licenciado sob a licença [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0).