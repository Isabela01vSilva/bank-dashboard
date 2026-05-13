# Bank Interface — Arquitetura Frontend Angular (Micro Frontends)

> Guia de arquitetura sênior para o frontend de um sistema financeiro com backend
> em Java + Spring Boot (microsserviços). Foco: profissional para portfólio,
> simples o bastante para evoluir gradualmente.

---

## 1. Stack ideal do frontend

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | **Angular 17+** (standalone components, signals) | Maturidade enterprise, DI, CLI, SSR opcional |
| Build / MFE | **Native Federation** (`@angular-architects/native-federation`) | Substitui Module Federation no Vite/esbuild do Angular 17+ |
| Estilo | **Tailwind CSS** + tokens CSS (`oklch`) | Produtividade + design system consistente |
| UI kit | **Angular Material** (base) + **componentes próprios** no design system | Acessibilidade pronta, customizável via theming |
| Estado | **NgRx** (global) + **Signals** (local) + **Component Store** (feature) | Previsível, devtools, escala bem |
| Reatividade | **RxJS** | HTTP, websockets, debouncing, combinação de streams |
| Gráficos | **ngx-charts** ou **ApexCharts (ng-apexcharts)** | Bonito, responsivo, fácil de tematizar |
| Forms | **Reactive Forms** + **ngx-mask** | Validação robusta + máscaras BR (CPF, moeda, data) |
| HTTP | `HttpClient` + **Interceptors** (auth, error, loading, retry) | Padrão Angular |
| Auth | **JWT + Refresh Token** (httpOnly cookie ideal, ou storage com cuidado) | Stateless, integra com Spring Security |
| Tabelas | **@tanstack/angular-table** ou **ag-grid-community** | Virtualização, sorting, filtros |
| Export | **xlsx** (SheetJS) / **jspdf + jspdf-autotable** | Excel e PDF client-side |
| i18n | `@angular/localize` ou **transloco** | pt-BR / en |
| Toast | **ngx-sonner** ou Material Snackbar | Feedback rápido |
| Loading | Interceptor + **NgxSpinner** ou skeleton (`ngx-skeleton-loader`) | UX percebida |
| Tema | CSS variables + `prefers-color-scheme` + toggle | Dark/light sem rebuild |
| Testes | **Jest** + **Testing Library** + **Playwright** (e2e) | Padrão moderno |
| Lint/format | ESLint + Prettier + Husky + lint-staged + commitlint | Qualidade no commit |
| Observabilidade | **Sentry** (errors) + **web-vitals** | Produção saudável |

---

## 2. Arquitetura Micro Frontends

### 2.1 Apps

```
bank-interface/
├── shell-app/              # host: layout, sidebar, auth, roteamento raiz
├── bank-app/               # remoto: dashboard, transações
├── schedule-app/           # remoto: agendamentos, histórico
├── expense-control-app/    # remoto: gastos, categorias, limites, relatórios
├── credit-card-app/        # remoto: cartão, fatura, limite
├── export-app/             # remoto: exportação Excel/PDF
└── shared-lib/             # biblioteca: design system, models, auth, utils
```

### 2.2 Comunicação entre apps

1. **Roteamento** — shell carrega remotos via `loadRemoteModule` em rotas com lazy loading.
2. **Estado compartilhado** — store NgRx exposto pela `shared-lib` (auth, user, feature flags). Nunca compartilhe `BehaviorSubject` "soltos".
3. **Eventos** — `EventBus` (RxJS `Subject` em singleton da shared-lib) para eventos cross-app desacoplados (ex.: `transaction.created`).
4. **URL como contrato** — query params e rotas são API pública entre MFEs. Evite acoplar serviços internos.
5. **Custom Events do DOM** apenas em último caso (cross-framework).

### 2.3 Compartilhamento de componentes

- `shared-lib` versionada (workspace Nx ou monorepo com `npm workspaces`).
- Expor: `UiButton`, `UiCard`, `UiTable`, `UiInputMoney`, `AuthService`, `ApiClient`, `tokens.css`.
- Singletons (Auth, ApiClient) marcados como **`shared: { singleton: true, strictVersion: true }`** no Native Federation.

### 2.4 Autenticação JWT entre MFEs

```
[Login no shell] → POST /auth/login → {accessToken, refreshToken}
                 → AuthService (shared-lib, singleton)
                 → access em memória + refresh em httpOnly cookie
                 → AuthInterceptor injeta Bearer em toda chamada
                 → on 401 → refresh → repete request → ou logout
```

- **AuthService singleton** na `shared-lib` é a fonte única.
- Cada MFE injeta o mesmo serviço (graças ao `singleton: true`).
- **Guards** (`authGuard`, `roleGuard`) ficam na shared-lib.
- Refresh token rotativo. Logout limpa store + redireciona para `/login` no shell.

### 2.5 Gerenciamento de estado

- **Auth, user, feature flags, theme** → store global (NgRx) na shared-lib.
- **Estado de feature** (ex.: filtros da tela de transações) → Component Store ou Signals locais.
- **Cache de servidor** → considerar **TanStack Query Angular** para reduzir boilerplate de NgRx em CRUD simples.

### 2.6 Deploy

- Cada app gera bundle independente, hospedado em CDN (Cloudflare Pages, S3+CloudFront, Vercel estático).
- `remoteEntry.json` por app, versionado por hash.
- Shell aponta para URLs de produção via `environment.ts`.
- CI/CD: pipeline por app — só rebuilda o que mudou (Nx affected).

### 2.7 Vantagens × Desvantagens

**Vantagens**
- Times independentes, deploy independente.
- Escala organizacional e técnica.
- Failover por domínio.

**Desvantagens**
- Complexidade de build, versionamento e debug.
- Overhead de rede (chunks duplicados se shared mal configurado).
- Curva de aprendizado.

> **Verdade incômoda:** para um portfólio solo, MFE é overkill funcional, mas
> **excelente vitrine arquitetural**. A estratégia abaixo entrega ambos.

### 2.8 Estratégia gradual recomendada

1. **Comece monolito modular** Angular com `loadChildren` (lazy modules).
2. Estruture pastas como se já fosse MFE (`apps/bank`, `apps/schedule`, `libs/shared`).
3. Use **Nx workspace** desde o dia 1 — facilita extrair MFEs depois.
4. Quando 2 features estiverem estáveis, **extraia a primeira para Native Federation** (sugestão: `expense-control-app`, por ser mais isolada).
5. Documente no README cada passo da migração — recrutador adora ver evolução.

---

## 3. Estrutura profissional de pastas (Nx)

```
bank-interface/
├── apps/
│   ├── shell/
│   │   ├── src/app/
│   │   │   ├── app.config.ts
│   │   │   ├── app.routes.ts          # rotas + loadRemoteModule
│   │   │   ├── layouts/
│   │   │   │   ├── main-layout/       # sidebar + topbar + outlet
│   │   │   │   └── auth-layout/
│   │   │   └── pages/
│   │   │       ├── login/
│   │   │       └── not-found/
│   │   └── federation.config.ts
│   ├── bank/
│   ├── schedule/
│   ├── expense-control/
│   ├── credit-card/
│   └── export/
├── libs/
│   ├── shared/
│   │   ├── ui/                        # design system: button, card, input...
│   │   ├── data-access/               # ApiClient, base services, NgRx root
│   │   ├── auth/                      # AuthService, guards, interceptors
│   │   ├── models/                    # interfaces TS (Transaction, User...)
│   │   ├── utils/                     # formatters (BRL, CPF, data)
│   │   └── theme/                     # tokens.css, tailwind preset
│   └── feature-*/                     # libs específicas opcionais
├── tools/
├── nx.json
├── tsconfig.base.json
└── package.json
```

Dentro de cada feature (ex.: `apps/bank/src/app`):

```
bank/
├── core/                # singletons da app: services, interceptors locais
├── shared/              # componentes/pipes/diretivas só desta app
├── features/
│   ├── dashboard/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/       # NgRx feature
│   │   └── models/
│   └── transactions/
├── layouts/
└── routes.ts
```

Pastas raiz cross-cutting na shared-lib:
`core/`, `shared/`, `layouts/`, `services/`, `interceptors/`, `guards/`, `environments/`, `design-system/`.

---

## 4. Roadmap REAL de desenvolvimento

### Ordem recomendada

1. **Setup**: Nx workspace, ESLint/Prettier, Tailwind, tokens CSS, Husky.
2. **Design system mínimo** (`libs/shared/ui`): Button, Card, Input, Money, Badge, Skeleton, Toast.
3. **Layout shell**: Sidebar + Topbar + Outlet + tema dark/light.
4. **Autenticação**: tela de login, AuthService, AuthInterceptor, Refresh, AuthGuard, RoleGuard.
5. **Camada HTTP**: ApiClient, ErrorInterceptor, LoadingInterceptor, environment configs.
6. **Fase 1 — Bank**: Dashboard (saldo, KPIs, gráfico) + Transações (tabela, filtros, modal de criação).
7. **Responsividade + acessibilidade** revisão.
8. **Fase 2 — Schedule**: Agendamentos + Histórico, integração com Bank via EventBus.
9. **Fase 3 — Expense Control**: Categorias, Limites (com alertas), Relatórios (gráficos).
10. **Fase 4 — Credit Card**: Fatura, Limite, lista de compras.
11. **Export**: Excel + PDF client-side.
12. **Extração para MFE**: começar por Expense Control.
13. **Testes**: Jest unit, Playwright e2e dos fluxos críticos (login, criar transação).
14. **Deploy**: Cloudflare Pages / Vercel; pipeline GitHub Actions; preview por PR.
15. **Observabilidade**: Sentry + web-vitals.

---

## 5. Fases — componentes, páginas, services, models, rotas, APIs

### Fase 1 — Bank
- **Páginas**: `/dashboard`, `/transactions`
- **Componentes**: `BalanceCard`, `KpiCard`, `MonthlyChart`, `ExpenseChart`, `TransactionList`, `TransactionRow`, `TransactionFormDialog`, `FilterBar`
- **Services**: `BankService`, `TransactionService`
- **Store**: `transactions` (NgRx feature) — entities adapter
- **Models**: `Transaction`, `Account`, `BalanceSummary`
- **Rotas**: `/`, `/transactions`
- **APIs Spring**: `GET /accounts/me`, `GET /transactions?from&to&type`, `POST /transactions`, `GET /summary?period`

### Fase 2 — Schedule
- **Páginas**: `/schedules`, `/schedule-history`
- **Componentes**: `ScheduleCard`, `ScheduleFormDialog`, `StatusBadge`, `RecurrenceSelector`
- **Services**: `ScheduleService`
- **Store**: `schedules`
- **Models**: `Schedule { id, type, amount, dueDate, recurrence, status }`, `ScheduleExecution`
- **Rotas**: `/schedules`, `/schedule-history`
- **APIs**: `GET/POST/PUT/DELETE /schedules`, `GET /schedules/:id/executions`

### Fase 3 — Expense Control
- **Páginas**: `/expenses`, `/categories`, `/limits`, `/reports`
- **Componentes**: `CategoryPill`, `LimitProgress`, `BudgetAlert`, `CategoryDonut`, `EvolutionLineChart`, `InsightCard`
- **Services**: `ExpenseService`, `CategoryService`, `LimitService`, `ReportService`
- **Models**: `Expense`, `Category`, `Limit`, `ReportSeries`
- **Rotas**: `/expenses`, `/categories`, `/limits`, `/reports`
- **APIs**: `CRUD /expenses`, `CRUD /categories`, `CRUD /limits`, `GET /reports?range&groupBy`

### Fase 4 — Credit Card + Export
- **Páginas**: `/credit-card`, `/export`
- **Componentes**: `CardVisual`, `InvoiceSummary`, `LimitBar`, `PurchaseList`, `ExportFormatPicker`, `ExportFieldsSelector`
- **Services**: `CreditCardService`, `InvoiceService`, `ExportService`
- **Models**: `CreditCard`, `Invoice`, `Purchase`
- **Rotas**: `/credit-card`, `/export`
- **APIs**: `GET /cards/me`, `GET /cards/:id/invoices`, `GET /cards/:id/purchases`, `POST /export`

---

## 6. Estratégias de integração

### 6.1 Consumir APIs Spring Boot
- `ApiClient` baseado em `HttpClient` com `baseUrl` por `environment`.
- Serviços por domínio retornando `Observable<T>`; nunca exponha `HttpClient` direto às páginas.
- Modelos TS sincronizados com DTOs do Spring (gerar via **openapi-generator** se houver Swagger).

### 6.2 JWT + Refresh
- Access token em memória (`AuthService`).
- Refresh token em **cookie httpOnly + Secure + SameSite=Strict** (Spring seta).
- `AuthInterceptor`:
  ```ts
  if (401 && !isRefresh) → queue requests → call /auth/refresh → retry
  ```
- Use `BehaviorSubject<boolean>` para enfileirar concorrentes durante refresh.

### 6.3 ErrorInterceptor
- Mapeia `status → mensagem amigável` (i18n).
- Toast para erros recuperáveis, dialog para críticos, redirect 401/403.
- Log para Sentry com contexto (rota, user id).

### 6.4 LoadingInterceptor
- `LoadingService` com counter; emite `isLoading$` para barra global no topo (`<app-progress-bar>`).
- Skip via header `X-Skip-Loading: true` em chamadas silenciosas.

### 6.5 Cache
- `HttpCacheInterceptor` para GETs idempotentes (TTL curto), invalidação por mutação.
- Ou **TanStack Query Angular** com `staleTime` por feature.

### 6.6 Environments
```
environments/
├── environment.ts            # dev
├── environment.staging.ts
└── environment.production.ts
```
Nunca commit secrets. URLs de remotos MFE também ficam aqui.

---

## 7. README temporário (cole na raiz do repo)

```markdown
# Bank Interface — Frontend

Sistema financeiro completo (Bank, Schedule, Expense Control, Credit Card, Export)
construído em Angular com arquitetura preparada para Micro Frontends.

## Módulos
- **Bank** — saldo, transações, dashboard
- **Schedule** — agendamento de operações
- **Expense Control** — categorias, limites, relatórios
- **Credit Card** — fatura, limite, compras
- **Export** — Excel e PDF

## Tecnologias
Angular 17 · Tailwind CSS · Angular Material · NgRx · RxJS · ApexCharts ·
Native Federation · Jest · Playwright · ESLint · Prettier · Nx

## Arquitetura
Monorepo Nx com apps independentes (`shell`, `bank`, `schedule`,
`expense-control`, `credit-card`, `export`) e libs compartilhadas
(`shared/ui`, `shared/auth`, `shared/data-access`, `shared/models`).
Migração gradual de monolito modular para Micro Frontends via Native Federation.

## Estrutura
Ver `/docs/architecture.md`.

## Roadmap
- [x] Design system + layout shell
- [x] Autenticação JWT + interceptors
- [ ] Fase 1 — Bank
- [ ] Fase 2 — Schedule
- [ ] Fase 3 — Expense Control
- [ ] Fase 4 — Credit Card + Export
- [ ] Extração MFE (Expense Control primeiro)
- [ ] CI/CD + deploy Cloudflare Pages

## Status
Em desenvolvimento — Fase 1.

## Backend
Java 21 + Spring Boot (microsserviços) — repositório separado.
```

---

## 8. Nível empresa — checklist

- **Clean architecture**: separar `domain` (models + casos de uso), `data` (services HTTP), `presentation` (componentes/pages).
- **Componentização**: smart vs dumb; nunca chame HTTP em componente de apresentação.
- **Lazy loading**: rotas + standalone components + `@defer` blocks.
- **Performance**: OnPush change detection, `trackBy`, virtual scroll, imagens otimizadas (`NgOptimizedImage`), bundle analyzer.
- **Segurança**: CSP, sanitização, sem `innerHTML` cru, HTTPS, cookies httpOnly, CSRF token quando aplicável.
- **Acessibilidade**: ARIA, foco visível, contraste WCAG AA, navegação por teclado, `cdk/a11y`.
- **Responsividade**: mobile-first, breakpoints Tailwind, sidebar colapsável.
- **Organização**: barrel files (`index.ts`) por lib; nada de imports relativos profundos; aliases `@bank/*`.

---

## 9. Quando realmente separar em MFE

Separe quando ao menos 2 forem verdade:
- Times diferentes tocam o código.
- Ciclos de release independentes.
- Stack divergente (ex.: uma feature em React).
- Tempo de build > 2 min ou bundle > 1.5 MB.

Para portfólio: **simule** com 2 MFEs reais (shell + expense-control) e mantenha o resto como lazy modules. Mostra domínio sem inflar custo.

---

## 10. Ordem de aprendizado sugerida (Angular Full Stack)

1. TypeScript avançado (generics, utility types, narrowing).
2. RxJS essencial (operators, subjects, error handling).
3. Angular core: DI, módulos vs standalone, signals, change detection, forms reactive.
4. Roteamento + lazy loading + guards + resolvers.
5. HTTP + Interceptors + tratamento de erros.
6. NgRx (actions, reducers, effects, selectors, entity).
7. Testes (Jest, Testing Library, Playwright).
8. Performance e acessibilidade.
9. Nx + monorepos + bibliotecas internas.
10. Native Federation / Module Federation.
11. CI/CD, observabilidade, segurança frontend.
12. Integração profunda com Spring Boot (OpenAPI, contracts, auth, websockets).

---

**Resumo executivo:** comece monolito modular em Nx, com design system e auth
desde o dia 1. Entregue Fase 1 (Bank) ponta a ponta antes de qualquer MFE.
Extraia o primeiro remoto (Expense Control) só quando o domínio estiver
estável. Documente cada decisão — é isso que diferencia um portfólio sênior.
```
