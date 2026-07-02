# Bank Interface

Sistema financeiro moderno desenvolvido com Angular e arquitetura de Micro Frontends.

O projeto simula uma plataforma bancária completa com módulos independentes para autenticação, controle financeiro, agendamentos, gastos e cartão de crédito.

---
# Backend da Aplicação

Este projeto possui integração com o backend da [bank-backend](https://github.com/Isabela01vSilva/bank.git) desenvolvido em Java com Spring Boot.

O backend é responsável por:

- Autenticação JWT
- Controle de usuários
- Transações financeiras
- Agendamentos
- Controle de gastos
- Integração com banco de dados
- APIs REST
- Regras de negócio financeiras

---

# 🔗 Backend & Regras de Negócio

Este frontend consome a API do projeto [Bank Isabela](https://github.com/Isabela01vSilva/bank), 
desenvolvida em Java + Spring Boot.

**Toda regra de negócio (validações, fluxos, status de conta, cálculos, etc.) é definida no backend.**
O frontend não deve reimplementar ou divergir dessas regras — apenas refletir e respeitar o que a API expõe.

Documentação de referência no repositório do backend:

- [`docs/regras-negocio.md`](https://github.com/Isabela01vSilva/bank/blob/main/docs/regras-negocio.md) — regras de negócio detalhadas
- [`docs/modelo-dados.md`](https://github.com/Isabela01vSilva/bank/blob/main/docs/modelo-dados.md) — modelo de dados / entidades
- [`docs/roadmap.md`](https://github.com/Isabela01vSilva/bank/blob/main/docs/roadmap.md) — fases já concluídas (RF001–RF019)

---

# ✨ Visão do Projeto

A aplicação foi projetada seguindo princípios de:

- Micro Frontends
- Arquitetura escalável
- Design System moderno
- UX inspirada em fintechs
- Separação de domínios
- Integração com microsserviços
- Segurança com JWT e OAuth

---

# 🧩 Arquitetura

```bash
bank
├── bank-module
├── schedule-module
├── expense-control-module
├── credit-card-module
└── export-module
```

---

# 🚀 Tecnologias

- Angular 21
- TypeScript
- TailwindCSS
- Angular Material
- RxJS

---

## 💰 Bank

Módulo principal responsável pelas operações financeiras.

### Funcionalidades

- Controle de saldo
- Entradas e saídas
- Histórico financeiro
- Dashboard
- Relatórios

---

## 📅 Schedule

Microserviço responsável pelos agendamentos financeiros.

### Funcionalidades

- Agendamentos futuros
- Controle de status
- Histórico de execuções

---

## 📊 Expense Control

Controle de gastos pessoais.

### Funcionalidades

- Categorias personalizadas
- Metas financeiras
- Limites de gastos
- Relatórios analíticos

---

## 💳 Credit Card

Gerenciamento de cartão de crédito.

### Funcionalidades

- Fatura
- Limite disponível
- Controle de compras
- Categorias de despesas

---

# 🛣️ Roadmap

## Fase 1

- Saldo
- Transações
- Dashboard inicial

## Fase 2

- Agendamentos
- Histórico financeiro

## Fase 3

- Controle de gastos
- Metas financeiras
- Relatórios

## Fase 4

- Cartão de crédito
- Exportação Excel
- Analytics avançado

---

# 📚 Arquitetura Técnica

O projeto possui documentação técnica detalhada da arquitetura Angular e autenticação.

## Inclui

- Fluxo JWT
- Google OAuth
- Guards
- Interceptors
- NgRx
- Estrutura compartilhada
- Segurança
- Integração com Spring Security

---

# ⚙️ Status

🚧 Projeto em desenvolvimento.

---

# 📁 Documentação

- `/docs/auth-architecture.md`
- `/docs/frontend-architecture.md`
- `/docs/roadmap.md`

---

# 🎯 Objetivo

Este projeto foi desenvolvido para estudo avançado de:

- Angular
- Arquitetura Frontend
- Micro Frontends
- UX/UI
- Sistemas financeiros
- Integração com Java Spring
- Boas práticas enterprise
