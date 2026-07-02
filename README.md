# Bank Interface

🚧 Em desenvolvimento

# 🚀 Tecnologias

Angular 21 · TypeScript · TailwindCSS · Angular Material · RxJS · NgRx

Protótipo visual e telas iniciais gerados com [Lovable](https://lovable.dev/preview/wBayThaBL1t0Fz79A0ADGboGr7fA0WTf),
usado como ferramenta de design/prototipação.

---

Sistema financeiro moderno desenvolvido com Angular, simulando uma plataforma bancária
completa com módulos para autenticação, controle financeiro, agendamentos, gastos e
cartão de crédito.

Projeto de estudo avançado de Angular, UX/UI para fintechs, integração com APIs Java
Spring e boas práticas enterprise.

> 📝 **Nota:** o projeto começou desenhado com arquitetura de Micro Frontends, mas essa
> abordagem foi abandonada por adicionar complexidade desnecessária para o escopo atual.
> Os "módulos" abaixo são módulos/features do Angular dentro de uma aplicação única.

---

# 🔗 Backend

Consome a API do [Bank Isabela](https://github.com/Isabela01vSilva/bank) (Java + Spring Boot),
responsável por autenticação JWT, usuários, transações, agendamentos, gastos e todas as
regras de negócio financeiras.

**Toda regra de negócio é definida no backend.** O frontend reflete e respeita o que a
API expõe, sem reimplementar ou divergir dessas regras.

- [`docs/regras-negocio.md`](https://github.com/Isabela01vSilva/bank/blob/main/docs/regras-negocio.md)
- [`docs/modelo-dados.md`](https://github.com/Isabela01vSilva/bank/blob/main/docs/modelo-dados.md)
- [`docs/roadmap.md`](https://github.com/Isabela01vSilva/bank/blob/main/docs/roadmap.md)

---

# 🧩 Módulos

```bash
src/app
├── bank            # saldo, entradas/saídas, histórico, dashboard, relatórios
├── schedule         # agendamentos futuros, status, histórico de execuções
├── expense-control  # categorias, metas, limites, relatórios analíticos
├── credit-card      # fatura, limite, compras, categorias de despesas
└── export
```

---

# 🛣️ Roadmap

Fases, requisitos e decisões de UX em [`docs/roadmap.md`](docs/roadmap.md), sincronizado
com o [roadmap do backend](https://github.com/Isabela01vSilva/bank/blob/main/docs/roadmap.md).

---

# 📁 Documentação

- [`docs/auth-architecture.md`](docs/auth-architecture.md) — fluxo JWT, Google OAuth, Guards, Interceptors, segurança
- [`docs/frontend-architecture.md`](docs/frontend-architecture.md) — estrutura Angular, NgRx, estrutura compartilhada
- [`docs/roadmap.md`](docs/roadmap.md) — fases e requisitos
