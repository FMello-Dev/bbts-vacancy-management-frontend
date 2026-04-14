# BBTS — Gestão de Vagas · Frontend

Interface web para gestão de vagas, aprovação RH e ranking de candidatos.  
Stack: **React · TypeScript · Vite · Material UI · TanStack Query**

---

## Pré-requisitos

- Node.js 18 ou superior → [nodejs.org](https://nodejs.org) (recomendo versão LTS)
- npm — já vem junto com o Node
- Backend rodando em `http://localhost:8000`

```bash
# Verificar instalação
node -v
npm -v
```

---

## Instalação e execução

```bash
# 1. Clone o repositório
git clone https://github.com/FMello-Dev/bbts-vacancy-management-frontend.git
cd bbts-vacancy-management-frontend/bbts-vagas

# 2. Instalar dependências
npm install

# 3. Registrar o Service Worker do MSW
npx msw init public/ --save

# 4. Configurar variáveis de ambiente
# Crie um arquivo .env na raiz de bbts-vagas/
echo "VITE_API_URL=http://localhost:8000" > .env
echo "VITE_USE_MOCK=false" >> .env

# 5. Rodar
npm run dev
```

Acesse: **http://localhost:5173**

---

## Variáveis de ambiente

| Variável | Valor | Descrição |
|----------|-------|-----------|
| `VITE_API_URL` | `http://localhost:8000` | URL do backend |
| `VITE_USE_MOCK` | `false` | `true` para usar dados mockados sem backend |

> Com `VITE_USE_MOCK=true` o sistema usa o MSW para simular as respostas — útil quando o backend não está disponível.

---

## Estrutura de pastas

```
src/
├── app/
│   ├── App.tsx              # Componente raiz
│   ├── router.tsx           # Rotas + guards de autenticação
│   ├── providers.tsx        # QueryClientProvider + ThemeProvider
│   ├── queryClient.ts       # Configuração do TanStack Query
│   └── theme.ts             # Tema MUI (cores BBTS)
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx    # Tela de login (selecionar perfil)
│   │   └── authContext.tsx  # Contexto de autenticação + token
│   ├── vacancies/
│   │   ├── VacanciesListPage.tsx    # Lista de vagas
│   │   ├── VacancyCreatePage.tsx   # Criar nova vaga
│   │   ├── VacancyDetailsPage.tsx  # Detalhe + submeter para aprovação
│   │   ├── components/
│   │   │   ├── RequirementsField.tsx  # Campo dinâmico de requisitos
│   │   │   └── VacancyStatusChip.tsx  # Chip colorido por status
│   │   └── hooks/
│   │       ├── useVacancies.ts
│   │       ├── useVacancy.ts
│   │       ├── useCreateVacancy.ts
│   │       └── useSubmitVacancy.ts
│   ├── approvals/
│   │   ├── ApprovalsQueuePage.tsx   # Fila de aprovação (RH)
│   │   └── hooks/
│   │       ├── usePendingApprovals.ts
│   │       ├── useApproveVacancy.ts
│   │       └── useRejectVacancy.ts
│   ├── candidates/
│   │   ├── CandidatesByVacancyPage.tsx  # Ranking de candidatos
│   │   └── hooks/
│   │       └── useCandidatesByVacancy.ts
│   └── imports/                         # Sprint 2
│       ├── ImportCandidatesPage.tsx     # Importar via CSV ou JSON
│       └── useImportCandidates.ts       # Hooks de upload
├── shared/
│   ├── api/
│   │   ├── http.ts        # Cliente HTTP + toCamel + auth header
│   │   └── endpoints.ts   # Centraliza todas as URLs da API
│   ├── types/
│   │   └── index.ts       # Todos os tipos TypeScript do domínio
│   ├── components/        # Componentes reutilizáveis (AppButton, AppDialog...)
│   ├── layouts/           # AppShell, SideNav, TopBar
│   └── utils/
└── mocks/                 # MSW handlers para dev sem backend
```

---

## Telas disponíveis

| Rota | Tela | Role |
|------|------|------|
| `/login` | Seleção de perfil | Todos |
| `/vacancies` | Lista de vagas | REQUESTER (só suas) / RH (todas) |
| `/vacancies/new` | Criar nova vaga | REQUESTER |
| `/vacancies/:id` | Detalhe da vaga + submeter | Todos |
| `/vacancies/:id/candidates` | Ranking de candidatos | Todos |
| `/approvals` | Fila de aprovação | RH |
| `/candidates/import` | Importar candidatos CSV/JSON | RH |

---

## Login

O sistema usa login simplificado por perfil (Sprint 1/2):

| Botão | user_id | Role | Redireciona para |
|-------|---------|------|-----------------|
| Entrar como Solicitante | 1 | REQUESTER | `/vacancies` |
| Entrar como RH | 2 | RH | `/approvals` |

---

## Integração com o backend

Toda comunicação com a API passa por `src/shared/api/http.ts`:

- Adiciona automaticamente o header `Authorization: Bearer <token>`
- Converte respostas de `snake_case` → `camelCase` automaticamente
- Redireciona para `/login` em caso de 401
- Erros padronizados via `error.detail` do FastAPI

Para usar mock sem backend, altere no `.env`:
```env
VITE_USE_MOCK=true
```

---

## Próximas sprints

- [ ] Sprint 3: Tela de listagem e busca de candidatos com filtros
- [ ] Sprint 3: Tela de detalhe do candidato (perfil completo)
- [ ] Sprint 3: Dashboard com KPIs por vaga
- [ ] Sprint 4: Role MANAGER com visão de área
