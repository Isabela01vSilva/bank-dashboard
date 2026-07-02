# Roadmap — Bank Interface (Frontend)

Este documento apresenta o planejamento de evolução do frontend do **Bank Interface**,
alinhado ao roadmap do backend ([Bank Isabela](https://github.com/Isabela01vSilva/bank)).

> ⚠️ O frontend deve seguir a ordem de entrega do backend. Cada fase abaixo só deve ser
> iniciada quando a funcionalidade correspondente já estiver disponível na API.

Legenda:

- ✅ Concluído
- 🚧 Em desenvolvimento
- 📅 Planejado
- 🔗 Depende de funcionalidade do backend ainda não implementada

---

# 🚧 Fase 1 - Consulta de Conta e Histórico

> Backend: ✅ Fase 1 - Core Bancário (RF004–RF009, RF013–RF017)
> Foco: exibição de informações de contas já existentes. **Não inclui** cadastro de
> cliente nem abertura de nova conta (ver Fase 5), nem saque/depósito (ver Fase 7 -
> Boletos, RF010–RF012).

## Conta

- [ ] RF004 - Exibição da conta criada automaticamente no cadastro
  - Número da agência e número da conta visíveis no menu
  - Nome completo do titular da conta exibido na tela inicial
- [ ] RF005 - Campo de consulta de conta (saldo, tipo, status da conta)
- [ ] RF006 - Seleção/visualização do tipo de conta (Corrente / Poupança)
- [ ] RF007 - Ação de ativar / encerrar conta
- [ ] RF009 - Exibição do status do cliente (ATIVO/INATIVO) e regras de bloqueio na UI

## Histórico

> Decisão de UX: **uma única tela de histórico/extrato**, não telas separadas por
> cliente e por conta. A visão consolidada (RF017) é o padrão; os filtros abaixo
> (conta, tipo de movimentação, período) refinam essa mesma tela — evita duplicar
> UI/lógica e não obriga o cliente a escolher "onde procurar" antes de ver os dados.

- [ ] RF013 - Tela de histórico (extrato) com filtros combináveis, controlados pelo cliente
- [ ] RF014 - Filtro de histórico por tipo de conta
- [ ] RF015 - Filtro de histórico por tipo de movimentação
- [ ] RF016 - Filtro de histórico por período
- [ ] RF017 - Extrato consolidado do cliente (visão padrão ao abrir a tela)

---

# 📅 Fase 2 - Transferências

> Backend: ✅ Fase 2 - Transferências (RF018–RF019)

- [ ] RF018 - Tela/fluxo de transferência entre contas
- [ ] RF019 - Tela de histórico de transferências
  - Lista consolidada mostrando transferências **imediatas** e **agendadas** juntas
  - Filtro para exibir: todas / apenas imediatas / apenas agendadas

---

# 📅 Fase 3 - Agendamentos 🔗

> Backend: 📅 Fase 4 - Agendamentos (ainda não implementada)

- [ ] Tela de agendamento de transferência
- [ ] Cancelamento de agendamento
- [ ] Edição de agendamento
- [ ] Histórico de execuções de agendamento
  - Contempla todos os tipos de transferência agendada
  - Estados: **executado**, **agendado (pendente)**, **falhou**
  - Filtro por status (todos / executado / agendado / falhou)

---

# 📅 Fase 4 - Dashboard Financeiro (Básico) 🔗

> Backend: 📅 Fase 6 - Dashboard Financeiro (ainda não implementada)

- [ ] Despesas (do mês)
- [ ] Receitas (do mês)
- [ ] Investimentos
- [ ] Economias (do mês / acumulada)
- [ ] Gastos por categoria
- [ ] Fluxo mensal

---

# 📅 Fase 5 - Cadastro de Cliente & Abertura de Conta

> Backend: ✅ Já implementado (RF001–RF003, RF008) — só faltava o front

## Cliente

- [ ] RF001 - Tela de cadastro de cliente
- [ ] RF002 - Tela de consulta / detalhe do cliente
- [ ] RF003 - Tela de atualização de dados cadastrais
- [ ] Validações de CPF, e-mail e telefone no formulário (espelhando regras do backend)

## Conta

- [ ] RF008 - Fluxo de abertura de nova conta

---

# 📅 Fase 6 - Dashboard Financeiro (Avançado) 🔗

- [ ] Comparativo com mês anterior
- [ ] Indicadores percentuais
- [ ] Gráficos de evolução financeira

---

# 📅 Fase 7 - Boletos & Movimentações 🔗

> Backend: 📅 Fase 7 - Boletos (ainda não implementada)
> Saque e depósito passam a ser feitos via boleto, não como ação direta na conta.

## Movimentações (via boleto)

- [ ] RF010 - Validação de conta antes de permitir movimentação (feedback de erro na UI)
- [ ] RF011 - Tela/ação de saque (geração de boleto de saque)
- [ ] RF012 - Tela/ação de depósito (geração de boleto de depósito)

## Boletos

- [ ] Geração de boleto de depósito
- [ ] Pagamento de boleto
- [ ] Geração de boleto de saque
- [ ] Cancelamento / expiração de boleto

---

# 📅 Fase 8 - Cartão de Crédito 🔗

> Backend: 📅 Fase 8 - Cartão de Crédito (ainda não implementada)

- [ ] Emissão / bloqueio / cancelamento de cartão
- [ ] Registro de compras e limite utilizado
- [ ] Fatura
- [ ] Gastos por categoria / estabelecimento

---

# 📅 Fase 9 - Controle de Gastos & Exportação

- [ ] Categorias personalizadas
- [ ] Metas financeiras
- [ ] Limites de gastos
- [ ] Exportação de extrato (PDF / Excel)

---

# Observações

- A Fase 1 tem prioridade máxima: são as telas de consulta que já têm suporte total
  no backend e estão faltando hoje no front.
- A Fase 5 (cadastro de cliente e abertura de conta) foi movida para depois do
  dashboard básico por decisão de produto — o backend já suporta, mas a prioridade
  de UX é primeiro mostrar dados de quem já é cliente.
- Itens marcados com 🔗 dependem de fases do backend ainda não iniciadas e **não devem
  ser solicitados ao Lovable** até a API correspondente existir.
