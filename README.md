# UaiFood
Projeto de DAW II de uma plataforma digital de venda de alimentos. 


## 🚀 Rodando o Projeto

Este projeto utiliza Node.js com TypeScript. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### 1\. Instalação

Primeiro, clone o repositório e instale as dependências necessárias:

```bash
# Clone o repositório (se ainda não o fez)
# git clone <URL_DO_SEU_REPOSITORIO>

# Entre na pasta do projeto
cd nome-do-projeto

# Instale todas as dependências listadas no package.json
npm install
```

### 2\. Modo de Desenvolvimento

Para rodar o servidor em modo de desenvolvimento, utilize o script `dev`. Ele usará o `nodemon` para reiniciar o servidor automaticamente sempre que um arquivo for alterado.

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

### 3\. Modo de Produção

Para preparar o projeto para produção, siga os passos abaixo:

**Passo 1: Compilar o código**

Execute o comando `build` para compilar os arquivos TypeScript (`.ts`) para JavaScript (`.js`). Os arquivos compilados serão salvos na pasta `/dist`.

```bash
npm run build
```

**Passo 2: Iniciar o servidor**

Após a compilação, inicie o servidor com o comando `start`. Ele executará o código JavaScript a partir da pasta `/dist`, que é otimizado para produção.

```bash
npm start
```