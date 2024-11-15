# Dictionary App 📚

**Dictionary App** foi desenvolido como caso de estudo de uma aplicação Full-Stack completa.

## 🎯 Funcionalidades

- **Autenticação de Usuário**: Faça login com usuário e senha.
- **Lista de Palavras**: Navegue por uma lista de palavras do dicionário.
- **Detalhes de Palavras**: Visualize informações detalhadas sobre qualquer palavra.
- **Histórico de Pesquisas**: Salve automaticamente e visualize palavras já pesquisadas.
- **Palavras Favoritas**: Marque palavras como favoritas e gerencie a lista.
- **Integração com API**: A API backend faz proxy para a [Free Dictionary API](https://dictionaryapi.dev), garantindo acesso simplificado.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: [Next.js](https://nextjs.org/)
- **Backend**: [NestJS](https://nestjs.com/)
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker Compose
- **API de Dicionário**: [Free Dictionary API](https://dictionaryapi.dev)

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Docker e Docker Compose instalados

### Passo a Passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/rzulli/dictionary-app.git
   cd dictionary-app
   ```

2. Inicie Container

   ```bash
   docker-compose up
   ```

3. Acesse a aplicação:

   Frontend: https://localhost:8000 ( ambiente npm run dev configurado com experimental-https. Use https:// )

   Backend: http://localhost:3000

📂 Estrutura do Projeto

    Frontend: Localizado na pasta frontend/, desenvolvido em Next.js.

    Backend: Localizado na pasta backend/, desenvolvido em NestJS.

    Banco de Dados: PostgreSQL configurado no Docker Compose.

🧪 Testes

Testes não estão implementados na versão atual. Mas serão adicionados em breve.

🤝 Contribuições

Sinta-se à vontade para abrir issues ou pull requests para contribuir com o projeto. Toda ajuda é bem-vinda!

🐞 Known Issues

- Ao expirar token jwt frontend não realiza logout automaticamente
- Typescript Types precisam ser ajustados para npm run build bem sucedido
