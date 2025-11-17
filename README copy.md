# 🚀 UaiFood - Plataforma de Delivery

Bem-vindo ao UaiFood\! Esta é uma plataforma full-stack de delivery de alimentos.

O projeto UaiFood é uma plataforma digital de venda de alimentos, desenvolvida com uma arquitetura full-stack baseada em Node.js/TypeScript e Express para o backend, utilizando Prisma ORM e PostgreSQL (via docker-compose) para persistência de dados. A estrutura do projeto é organizada de forma modular, seguindo o padrão de camadas (Controladores, Serviços, Repositórios), o que facilita a manutenção e a escalabilidade.

O front-end é construído com **Next.js 14+ (App Router)** e **TypeScript**, utilizando **Zustand** para gerenciamento de estado global e **Tailwind CSS** com **Shadcn/UI** para uma interface moderna.

-----

### \#\# 🛠️ Tecnologias Principais

| Categoria | Tecnologia |
| :--- | :--- |
| **Back-end (API)** | Node.js, Express, TypeScript, Zod, JWT, Bcryptjs |
| **Banco de Dados** | PostgreSQL (Docker), Prisma (ORM), Redis (Docker) |
| **Front-end** | Next.js 14+ (App Router), React 18+, TypeScript, Zustand |
| **UI (Front-end)** | Tailwind CSS, Shadcn/UI, Lucide Icons |
| **DevOps** | Docker, Docker Compose |
| **Documentação** | Swagger (OpenAPI) |

-----

### \#\# 📁 Organização do Projeto

Este repositório é um **monorepo**. A lógica do back-end e do front-end vivem em pastas separadas, mas são gerenciadas juntas.

```
/UaiFood (Raiz do Projeto)
│
├── 📁 backend/
│   ├── src/            # Código-fonte da API (Controllers, Services ...)
│   ├── prisma/         # Schema, migrações e seed do banco
│   ├── Dockerfile      # Instruções para construir a imagem da API
│   └── package.json    # Dependências do back-end
│
├── 📁 frontend/
│   ├── src/            # Código-fonte do app Next.js (páginas, ...)
│   └── package.json    # Dependências do front-end
│
├── 📄 docker-compose.yml # Orquestrador dos serviços (API, DB, Redis)
└── 📄 README.md (Você está aqui)
```

-----

### \#\# 🏃‍♂️ Como Rodar o Projeto (Guia Completo)

Siga estes passos para configurar e rodar o ambiente de desenvolvimento completo.

#### Pré-requisitos

  * [Git](https://www.google.com/search?q=https://git-scm.com/downloads)
  * [Node.js](https://nodejs.org/en) (v18 ou superior)
  * [Docker](https://www.docker.com/products/docker-desktop/)
  * [Docker Compose](https://docs.docker.com/compose/install/)

-----

#### 1\. Clonar o Repositório

```bash
git clone https://github.com/Raf1d3/UaiFood
cd UaiFood
```

#### 2\. Configuração de Ambiente (Crucial\!)

Você precisa criar **dois** arquivos de ambiente separados.

**A. Back-end (Para o Docker)**

Na **RAIZ** do projeto, crie o arquivo `.env` para o Docker Compose.

```bash
# Copia o arquivo de exemplo
cp .env.example .env
```

Agora, **edite o arquivo `.env`** com suas senhas e portas. Ele deve se parecer com isto:

```.env
# BACKEND - POSTGRES
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
POSTGRES_DB=uaifood
DB_PORT=5433 # Porta que o SEU PC usará para acessar o banco

# BACKEND - REDIS
REDIS_URL="redis://redis:6379"

# BACKEND - API
# Esta URL é usada PELO PRISMA (dentro do container) para falar com o banco
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"
SECRET_JWT="COLOQUE_UM_SEGREDO_DE_64_CARACTERES_AQUI"

# SEED (ADMIN)
ADMIN_EMAIL="admin@uaifood.com"
ADMIN_PASSWORD="admin123"
```

**B. Front-end (Para o Next.js)**

Na pasta `frontend/`, crie o arquivo `.env.local` para o Next.js.

```bash
# Navegue até a pasta do front-end
cd frontend

# Crie o .env.local
touch .env.local
```

Agora, **edite o arquivo `frontend/.env.local`** e adicione a URL da sua API:

```.env.local
# URL que o seu navegador usará para acessar a API
NEXT_PUBLIC_API_URL=http://localhost:3001
```

-----

#### 3\. Iniciar o Back-end (API, Banco & Redis)

Volte para a **RAIZ** do projeto. Suba os contêineres do Docker.

```bash
# (Na RAÍZ do projeto)
docker compose up -d --build
```

  * `--build`: Força a reconstrução da imagem da API (necessário na primeira vez).
  * `-d`: Roda os contêineres em segundo plano.

**Seu back-end (API, DB, Redis) já está rodando\!**

-----

#### 4\. Preparar o Banco de Dados (1ª Vez)

Com os contêineres no ar, precisamos criar as tabelas e popular o banco.

**A. Rodar as Migrações**
(Cria as tabelas `User`, `Item`, `Order`, etc.)

```bash
docker compose exec app npx prisma migrate dev
```

*(Você pode ser solicitado a dar um nome para a migração, ex: "init")*

**B. Rodar o Seed**
(Cria seu usuário Admin, categorias e itens de teste)

```bash
docker compose exec app npx prisma db seed
```

-----

#### 5\. Iniciar o Front-end (Interface)

Em um **novo terminal**, navegue até a pasta `frontend/`, instale as dependências e inicie o servidor de desenvolvimento.

```bash
cd frontend
npm install
npm run dev
```

-----

### \#\# ✅ Pronto\!

Seu ambiente está completo:

  * **Front-end (Next.js):** [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000)
  * **Back-end (API):** [http://localhost:3001](https://www.google.com/search?q=http://localhost:3001)
  * **Documentação (Swagger):** [http://localhost:3001/api-docs/](https://www.google.com/search?q=http://localhost:3001/api-docs/)

-----

### \#\# ⚙️ Comandos Úteis

#### Docker (Execute na RAÍZ)

  * **Ver Logs da Aplicação (Back-end):**
    ```bash
    docker compose logs -f app
    ```
  * **Parar todos os contêineres:**
    ```bash
    docker compose down
    ```
  * **Parar e APAGAR os dados do banco (Reset Total):**
    ```bash
    docker compose down -v
    ```
  * **Reiniciar apenas a aplicação (após um erro):**
    ```bash
    docker compose restart app
    ```
  * **Acessar o terminal do contêiner da aplicação:**
    ```bash
    docker compose exec app sh
    ```

#### Prisma (Execute na RAÍZ, dentro do `exec`)

  * **Aplicar mudanças no Schema:**
    (Rode isso toda vez que você editar o `backend/prisma/schema.prisma`)
    ```bash
    docker compose exec app npx prisma migrate dev
    ```
  * **Formatar seu Schema:**
    ```bash
    docker compose exec app npx prisma format
    ```
  * **Abrir o Gerenciador Visual do Banco (Prisma Studio):**
    Rode este comando e acesse [http://localhost:5555](https://www.google.com/search?q=http://localhost:5555) no seu navegador.
    ```bash
    docker compose exec app npx prisma studio
    ```
    *(Nota: Você pode precisar adicionar a porta `5555` ao `docker-compose.yml` se ele não conseguir se conectar)*