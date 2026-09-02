# Especificação de Requisitos e Modelagem de Dados — Mapa Esportivo

**Sistema de Levantamento e Diagnóstico de Perfil Esportivo Escolar**  
**Instituição:** Colégio EREM Santa Ana (Escola de Referência em Ensino Médio Santa Ana — Olinda/PE)  
**Projeto:** Engenharia de Software / Análise de Sistemas / Banco de Dados  
**Ano/Período:** 2026.2  

---

## 1. Integrantes da Equipe

| Nome | Matrícula |
|---|---|
| Juan Alencar de Barros | 01621647 |
| Allan Victor Cavalcanti de Sá | 01587571 |
| Fabiano Vitor de Holanda Coelho | 01647936 |
| João Guilherme Nemesio Beltrão | 01591539 |
| Matheus Henrique Souto Dosquinha | 01604657 |
| Ruan Deud Rameh de Oliveira | 01647036 |

---

## 2. O que é o Projeto

### 2.1. Definição do Sistema
O **Mapa Esportivo** é uma plataforma web institucional de levantamento censitário e diagnóstico analítico sobre a prática de atividades físicas, interesses esportivos e barreiras enfrentadas pelos estudantes do **Colégio EREM Santa Ana (Escola de Referência em Ensino Médio Santa Ana)**, em Olinda/PE.

### 2.2. Contexto Institucional
O Colégio EREM Santa Ana atende centenas de jovens no Ensino Médio Integral e propedêutico/técnico. O diagnóstico abrange os três anos do Ensino Médio:
- **1º Ano**
- **2º Ano**
- **3º Ano**

No campo de identificação de curso/itinerário, o sistema adota a nomenclatura padronizada **Curso / Itinerário**, disponibilizando opções frequentes da rede (`Nutrição e Dietética`, `Farmácia`, `Enfermagem`), além da opção de digitação livre (`Outro`), o que permite o acolhimento flexível de qualquer itinerário formativo, área de conhecimento ou turma da instituição.

### 2.3. Problema que o Projeto Resolve
Tradicionalmente, a elaboração do plano pedagógico de Educação Física, a oferta de oficinas extracurriculares e os Jogos Escolares ocorrem sem uma base estatística representativa. Isso acarreta:
1. **Descompasso de modalidades**: oferta concentrada exclusivamente em esportes tradicionais (como futsal), sem aferir demandas reais como dança, artes marciais, vôlei, basquete, musculação ou calistenia;
2. **Falta de diagnóstico de barreiras**: desconhecimento dos fatores que limitam os estudantes (falta de tempo, espaço escolar reduzido, custo de equipamentos ou falta de oportunidade na escola);
3. **Inviabilidade de pesquisas em papel**: perda de questionários impressos, custos com fotocópias e demora excessiva na tabulação manual;
4. **Viés por falta de privacidade**: alunos sedentários ou com dificuldades evitam participar de questionários nominais.

O Mapa Esportivo provê um **questionário discente digital com coleta desidentificada** e um **painel analítico (dashboard)** para orientar gestores e professores com base em evidências estatísticas consolidadas.

---

## 3. Requisitos Funcionais (RF)

| Código | Nome | Descrição Objetiva |
|---|---|---|
| **RF01** | Coleta de Perfil Demográfico | O sistema deve coletar do estudante: Curso / Itinerário, Série, Faixa Etária e Gênero, sem solicitar identificadores pessoais (nome, CPF, matrícula). |
| **RF02** | Seleção e Digitação de Curso / Itinerário | O sistema deve disponibilizar como primeiras opções formações de referência da rede (`Nutrição e Dietética`, `Farmácia`, `Enfermagem`), a opção `Outro` e, caso `Outro` seja selecionado, exibir um campo de texto obrigatório para digitação livre (2 a 80 caracteres). |
| **RF03** | Seleção de Série | O sistema deve restringir a seleção de série exclusivamente às opções do Ensino Médio: `1º Ano`, `2º Ano` e `3º Ano`. |
| **RF04** | Coleta de Prática Esportiva Atual | O sistema deve permitir ao estudante declarar se pratica atualmente alguma atividade física regular ("Sim, pratico" ou "Não pratico"). |
| **RF05** | Seleção de Modalidades Praticadas | O sistema deve permitir ao estudante assinalar uma ou múltiplas modalidades que pratica (`Futebol`, `Vôlei`, `Futsal`, `Basquete`, `Corrida/caminhada`, `Ciclismo`, `Musculação/academia`, `Dança`, `Artes marciais`, `Outro`). |
| **RF06** | Coleta de Frequência Semanal | O sistema deve registrar a regularidade semanal de prática (`Todos os dias`, `4–6 vezes por semana`, `2–3 vezes por semana`, `1 vez por semana`, `Menos de 1 vez por semana` ou `Não pratico`). |
| **RF07** | Condicionalidade de Prática na Aplicação | Caso o estudante informe que não pratica atividade física (RF04 = falso), a interface da aplicação deve desativar as opções de modalidades e fixar a frequência em `Não pratico`. |
| **RF08** | Coleta de Interesse Pessoal | O sistema deve permitir ao estudante selecionar a modalidade que ele mais gostaria de praticar ou aprender. |
| **RF09** | Coleta de Barreiras e Dificuldades | O sistema deve permitir a seleção múltipla de fatores limitantes (`Falta de tempo`, `Falta de espaço`, `Falta de equipamentos`, `Falta de dinheiro`, `Falta de companhia`, `Falta de oportunidade na escola`, `Falta de interesse`, `Outro`) ou a opção exclusiva `Nada dificulta`. |
| **RF10** | Coleta de Demanda Esportiva Escolar | O sistema deve permitir ao estudante indicar qual modalidade gostaria de ver incentivada ou oferecida pelo Colégio EREM Santa Ana. |
| **RF11** | Submissão de Participação | O sistema deve validar os dados preenchidos no formulário e persistir o registro da participação de forma segura e desidentificada. |
| **RF12** | Painel de Indicadores Gerais (KPIs) | O painel deve exibir em cards: Total de Respostas, Taxa e Contagem de Praticantes, Taxa e Contagem de Não Praticantes e Modalidade com Maior Interesse. |
| **RF13** | Gráficos de Distribuição Demográfica | O painel deve apresentar gráficos em barras horizontais detalhando a distribuição de respondentes por: Curso / Itinerário, Gênero, Série e Faixa Etária. |
| **RF14** | Gráficos de Diagnóstico Esportivo | O painel deve apresentar gráficos analíticos de: Modalidades Mais Praticadas, Frequência Semanal, Interesses Pessoais, Demandas para a Escola e Principais Dificuldades. |
| **RF15** | Gráfico de Adesão Geral | O painel deve apresentar barra comparativa de progresso destacando a proporção de estudantes praticantes versus não praticantes. |
| **RF16** | Acesso e Distribuição por QR Codes | O sistema deve disponibilizar QR Codes dedicados para acesso direto ao Questionário, ao Painel e à página Institucional, permitindo projeção em sala de aula e impressão em murais. |

---

## 4. Requisitos Não Funcionais (RNF)

| Código | Categoria | Descrição Objetiva |
|---|---|---|
| **RNF01** | Responsividade Completa | A interface deve ser responsiva (Mobile-First), adaptando-se sem rolagem horizontal ou sobreposição de elementos em telas com largura a partir de 320px (smartphones compactos) até 1920px+ (desktops). |
| **RNF02** | Coleta Desidentificada (Privacidade) | O sistema adota coleta desidentificada, sem armazenamento de nome, CPF, e-mail, telefone, matrícula ou endereço IP, reduzindo significativamente a possibilidade de identificação direta dos estudantes e atuando em consonância com as diretrizes de minimização de dados da LGPD. |
| **RNF03** | Usabilidade e Áreas de Toque | Todos os botões, checkboxes e seletores devem possuir altura mínima de toque de 44px a 48px em dispositivos móveis, com feedback visual de seleção imediata. |
| **RNF04** | Desempenho de Carregamento | O tempo de carregamento da página (First Contentful Paint) deve ser inferior a 1,5 segundos em conexões móveis convencionais, e o envio do formulário deve ser processado em menos de 800ms. |
| **RNF05** | Integridade Estrutural Relacional | O modelo relacional de banco de dados deve assegurar integridade por meio de chaves primárias, chaves estrangeiras (`ON DELETE RESTRICT/CASCADE`) e restrições declarativas (`CHECK`, `NOT NULL`, `UNIQUE`). |
| **RNF06** | Acessibilidade Visual | A interface deve priorizar contraste visual adequado, associando textos explicativos, ícones semânticos e rótulos acessíveis para leitores de tela (`aria-label`, `sr-only`). |
| **RNF07** | Segurança em Trânsito | Toda a comunicação entre o navegador do usuário e os serviços da aplicação deve ocorrer obrigatoriamente por meio de conexões criptografadas com protocolo HTTPS e TLS 1.3. |

---

## 5. Regras de Negócio e Separação de Responsabilidades

Para demonstrar clareza arquitetural, as regras do sistema foram separadas entre **Validações de Fluxo da Aplicação** (controladas pela lógica do formulário e interface) e **Restrições de Integridade Estrutural do Banco** (enforced pelo SGBD).

| Código | Regra de Negócio | Camada de Execução | Descrição e Comportamento |
|---|---|---|---|
| **RN01** | **Validação de Curso / Itinerário** | Aplicação + Banco | O curso informado deve ser um dos itens cadastrados (`Nutrição e Dietética`, `Farmácia`, `Enfermagem`) ou, se for selecionada a opção `Outro`, o campo de texto deve conter entre 2 e 80 caracteres. |
| **RN02** | **Restrição de Série** | Banco de Dados (`CHECK`) | A série do estudante deve pertencer exclusivamente ao conjunto: `['1º Ano', '2º Ano', '3º Ano']`. |
| **RN03** | **Domínio de Idade e Gênero** | Banco de Dados (`CHECK`) | A faixa etária é restrita a `['14 a 15 anos', '16 a 17 anos', '18 anos ou mais']`. O gênero deve pertencer a `['Feminino', 'Masculino', 'Outro', 'Prefiro não informar']`. |
| **RN04** | **Condicionalidade de Prática** | Aplicação (Frontend) | Se o discente responder que não pratica esportes (`pratica_esporte = false`), a interface desativa a seleção de modalidades, não envia tuplas para `resposta_modalidade` e define a frequência como `'Não pratico'`. O banco possui constraint para garantir que se `pratica_esporte = false`, a coluna `frequencia` contenha `'Não pratico'`. |
| **RN05** | **Exclusividade de "Nada dificulta"** | Aplicação (Frontend) | A opção `'Nada dificulta'` é mutuamente exclusiva. Ao ser assinalada, a aplicação desmarca qualquer outra barreira previamente selecionada; caso outra barreira seja clicada, `'Nada dificulta'` é desmarcada. |
| **RN06** | **Preenchimento Mínimo Obrigatório** | Aplicação (Validação) | O formulário só habilita o envio se: Curso/Itinerário for válido, Série, Idade e Gênero forem assinalados, ao menos uma barreira for escolhida e, para praticantes, pelo menos uma modalidade for marcada. |
| **RN07** | **Atomicidade na Atualização de Indicadores** | Aplicação / Banco | A gravação de uma nova resposta deve refletir na consolidação imediata dos indicadores agregados, evitando inconsistências de concorrência. |
| **RN08** | **Imutabilidade Pública das Respostas** | Aplicação / SGBD | O usuário público final não possui privilégios de alteração (`UPDATE`) ou exclusão (`DELETE`) sobre registros de respostas já enviados, prevenindo fraudes ou perdas de dados históricos. |

---

## 6. Detalhamento do Banco de Dados Relacional (PostgreSQL 16+)

O modelo foi estruturado segundo os princípios do modelo relacional e organizado para atender à **Terceira Forma Normal (3FN)**, reduzindo redundâncias e mantendo a integridade dos dados.

### 6.1. Justificativa da Estrutura e Normalização (3FN)
O esquema relacional é composto por **4 tabelas**:
1. **`curso`** (Entidade Forte de Catálogo): Armazena as opções de cursos/itinerários institucionais padronizados, evitando redundância de strings e assegurando integridade referencial.
2. **`participacao`** (Entidade Central de Sessão): Registra a participação do estudante e armazena todos os atributos atômicos e monovalorados da resposta (relação 1:1 com a participação: curso selecionado, curso digitado em caso de `Outro`, série, faixa etária, gênero, prática binária, frequência, esportes desejados e carimbo de envio).
3. **`resposta_modalidade`** (Decomposição de Atributo Multivalorado — 1FN / 3FN): A pergunta *"Qual esporte você pratica atualmente?"* permite múltipla escolha. Para atender à 1FN (eliminar grupos repetitivos e arrays), cada modalidade assinalada gera um registro individual associado ao `id_participacao`.
4. **`resposta_barreira`** (Decomposição de Atributo Multivalorado — 1FN / 3FN): De forma análoga, a pergunta sobre dificuldades permite múltiplas respostas. Cada barreira assinalada gera um registro individual associado ao `id_participacao`.

- **Atendimento à 1FN**: Todos os atributos possuem valores atômicos indivisíveis; atributos multivalorados foram decompostos nas tabelas filhas `resposta_modalidade` e `resposta_barreira`.
- **Atendimento à 2FN**: Todas as tabelas utilizam chaves primárias simples (`SERIAL`), garantindo que os atributos não-chave dependam por inteiro da chave primária.
- **Atendimento à 3FN**: Não há dependências funcionais transitivas entre atributos não-chave.

---

### 6.2. Diagrama Entidade-Relacionamento (DER / Mermaid)

```mermaid
erDiagram
    CURSO ||--o{ PARTICIPACAO : "informa"
    PARTICIPACAO ||--o{ RESPOSTA_MODALIDADE : "pratica"
    PARTICIPACAO ||--o{ RESPOSTA_BARREIRA : "enfrenta"

    CURSO {
        int id_curso PK
        varchar nome UK
        varchar sigla UK
        boolean ativo
    }

    PARTICIPACAO {
        int id_participacao PK
        int id_curso FK
        varchar curso_digitado
        varchar serie
        varchar faixa_etaria
        varchar genero
        boolean pratica_esporte
        varchar frequencia
        varchar esporte_desejado
        varchar esporte_escola
        timestamptz data_submissao
    }

    RESPOSTA_MODALIDADE {
        int id_resposta_mod PK
        int id_participacao FK
        varchar modalidade
    }

    RESPOSTA_BARREIRA {
        int id_resposta_bar PK
        int id_participacao FK
        varchar barreira
    }
```

---

### 6.3. Dicionário de Dados das Tabelas Relacionais

#### Tabela 1: `curso`
| Atributo | Tipo de Dado | Restrições | Descrição |
|---|---|---|---|
| `id_curso` | `SERIAL` | `PRIMARY KEY` | Identificador autoincrementado do curso/itinerário. |
| `nome` | `VARCHAR(120)` | `NOT NULL, UNIQUE` | Nome oficial do curso/itinerário. |
| `sigla` | `VARCHAR(15)` | `NOT NULL, UNIQUE` | Sigla curta de identificação. |
| `ativo` | `BOOLEAN` | `NOT NULL, DEFAULT TRUE` | Status para listagem no sistema. |

#### Tabela 2: `participacao`
| Atributo | Tipo de Dado | Restrições | Descrição |
|---|---|---|---|
| `id_participacao` | `SERIAL` | `PRIMARY KEY` | Identificador único da resposta enviada. |
| `id_curso` | `INTEGER` | `FK → curso(id_curso), NOT NULL` | Vínculo com a tabela de cursos. |
| `curso_digitado` | `VARCHAR(80)` | `NULL` | Texto preenchido caso o curso seja "Outro". |
| `serie` | `VARCHAR(10)` | `NOT NULL, CHECK` | Restrita a: `'1º Ano'`, `'2º Ano'`, `'3º Ano'`. |
| `faixa_etaria` | `VARCHAR(20)` | `NOT NULL, CHECK` | Restrita a: `'14 a 15 anos'`, `'16 a 17 anos'`, `'18 anos ou mais'`. |
| `genero` | `VARCHAR(30)` | `NOT NULL, CHECK` | `'Feminino'`, `'Masculino'`, `'Outro'`, `'Prefiro não informar'`. |
| `pratica_esporte` | `BOOLEAN` | `NOT NULL` | Indicador binário de prática regular de atividades físicas. |
| `frequencia` | `VARCHAR(35)` | `NOT NULL, CHECK` | Frequência declarada de exercícios por semana. |
| `esporte_desejado` | `VARCHAR(50)` | `NOT NULL` | Modalidade de maior interesse pessoal. |
| `esporte_escola` | `VARCHAR(50)` | `NOT NULL` | Modalidade demandada para as dependências da escola. |
| `data_submissao` | `TIMESTAMPTZ` | `NOT NULL, DEFAULT CURRENT_TIMESTAMP` | Data e hora de envio da participação. |

#### Tabela 3: `resposta_modalidade`
| Atributo | Tipo de Dado | Restrições | Descrição |
|---|---|---|---|
| `id_resposta_mod` | `SERIAL` | `PRIMARY KEY` | Identificador único do registro da modalidade. |
| `id_participacao` | `INTEGER` | `FK → participacao(id_participacao) ON DELETE CASCADE` | Vínculo com a participação correspondente. |
| `modalidade` | `VARCHAR(50)` | `NOT NULL, CHECK` | Modalidade assinalada na questão de múltipla escolha. |

#### Tabela 4: `resposta_barreira`
| Atributo | Tipo de Dado | Restrições | Descrição |
|---|---|---|---|
| `id_resposta_bar` | `SERIAL` | `PRIMARY KEY` | Identificador único do registro da barreira. |
| `id_participacao` | `INTEGER` | `FK → participacao(id_participacao) ON DELETE CASCADE` | Vínculo com a participação correspondente. |
| `barreira` | `VARCHAR(60)` | `NOT NULL, CHECK` | Fator de dificuldade assinalado pelo discente. |

---

### 6.4. Script SQL DDL Completo (PostgreSQL 16+)

```sql
-- ============================================================
-- Mapa Esportivo — Sistema de Levantamento de Perfil Esportivo
-- Instituição: Colégio EREM Santa Ana (Olinda/PE)
-- SGBD: PostgreSQL 16+
-- Script DDL Normalizado em 3FN
-- ============================================================

SET client_encoding = 'UTF8';

-- 1. TABELA: curso
CREATE TABLE curso (
    id_curso       SERIAL       PRIMARY KEY,
    nome           VARCHAR(120) NOT NULL UNIQUE,
    sigla          VARCHAR(15)  NOT NULL UNIQUE,
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE
);

-- Cursos de referência da rede estadual e opção personalizada
INSERT INTO curso (nome, sigla) VALUES 
('Nutrição e Dietética', 'NUTRI'),
('Farmácia', 'FARM'),
('Enfermagem', 'ENF'),
('Outro', 'OUTRO');

-- 2. TABELA: participacao
CREATE TABLE participacao (
    id_participacao   SERIAL       PRIMARY KEY,
    id_curso          INTEGER      NOT NULL REFERENCES curso(id_curso) ON DELETE RESTRICT,
    curso_digitado    VARCHAR(80),
    serie             VARCHAR(10)  NOT NULL CHECK (serie IN ('1º Ano', '2º Ano', '3º Ano')),
    faixa_etaria      VARCHAR(20)  NOT NULL CHECK (faixa_etaria IN ('14 a 15 anos', '16 a 17 anos', '18 anos ou mais')),
    genero            VARCHAR(30)  NOT NULL CHECK (genero IN ('Feminino', 'Masculino', 'Outro', 'Prefiro não informar')),
    pratica_esporte   BOOLEAN      NOT NULL,
    frequencia        VARCHAR(35)  NOT NULL CHECK (frequencia IN (
                          'Todos os dias', '4–6 vezes por semana', '2–3 vezes por semana',
                          '1 vez por semana', 'Menos de 1 vez por semana', 'Não pratico'
                      )),
    esporte_desejado  VARCHAR(50)  NOT NULL,
    esporte_escola    VARCHAR(50)  NOT NULL,
    data_submissao    TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_curso_outro_preenchido CHECK (
        (id_curso <> 4) OR (curso_digitado IS NOT NULL AND length(trim(curso_digitado)) >= 2)
    ),
    CONSTRAINT chk_nao_pratica_frequencia CHECK (
        pratica_esporte = TRUE OR frequencia = 'Não pratico'
    )
);

CREATE INDEX idx_participacao_curso   ON participacao (id_curso);
CREATE INDEX idx_participacao_serie   ON participacao (serie);
CREATE INDEX idx_participacao_pratica ON participacao (pratica_esporte);

-- 3. TABELA: resposta_modalidade (Decomposição N:N em 3FN)
CREATE TABLE resposta_modalidade (
    id_resposta_mod   SERIAL      PRIMARY KEY,
    id_participacao   INTEGER     NOT NULL REFERENCES participacao(id_participacao) ON DELETE CASCADE,
    modalidade        VARCHAR(50) NOT NULL CHECK (modalidade IN (
                          'Futebol', 'Vôlei', 'Futsal', 'Basquete', 'Corrida/caminhada',
                          'Ciclismo', 'Musculação/academia', 'Dança', 'Artes marciais', 'Outro'
                      )),
    CONSTRAINT uq_part_modalidade UNIQUE (id_participacao, modalidade)
);

CREATE INDEX idx_resp_mod_part ON resposta_modalidade (id_participacao);
CREATE INDEX idx_resp_mod_nome ON resposta_modalidade (modalidade);

-- 4. TABELA: resposta_barreira (Decomposição N:N em 3FN)
CREATE TABLE resposta_barreira (
    id_resposta_bar   SERIAL      PRIMARY KEY,
    id_participacao   INTEGER     NOT NULL REFERENCES participacao(id_participacao) ON DELETE CASCADE,
    barreira          VARCHAR(60) NOT NULL CHECK (barreira IN (
                          'Falta de tempo', 'Falta de espaço', 'Falta de equipamentos', 'Falta de dinheiro',
                          'Falta de companhia', 'Falta de oportunidade na escola', 'Falta de interesse', 
                          'Outro', 'Nada dificulta'
                      )),
    CONSTRAINT uq_part_barreira UNIQUE (id_participacao, barreira)
);

CREATE INDEX idx_resp_bar_part ON resposta_barreira (id_participacao);
CREATE INDEX idx_resp_bar_nome ON resposta_barreira (barreira);

-- 5. VIEW ANALÍTICA: Consolidação Dinâmica de Indicadores
-- Nota: Trata-se de uma consulta analítica dinâmica para extração de métricas consolidadas via SQL.
CREATE OR REPLACE VIEW vw_indicadores_gerais AS
SELECT
    COUNT(*) AS total_participantes,
    COUNT(*) FILTER (WHERE pratica_esporte = TRUE) AS praticantes,
    ROUND(COUNT(*) FILTER (WHERE pratica_esporte = TRUE)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS perc_praticantes,
    COUNT(*) FILTER (WHERE pratica_esporte = FALSE) AS nao_praticantes,
    ROUND(COUNT(*) FILTER (WHERE pratica_esporte = FALSE)::NUMERIC / NULLIF(COUNT(*), 0) * 100, 1) AS perc_nao_praticantes
FROM participacao;
```

---

## 7. Justificativa Arquitetural: Modelo Relacional na Documentação vs. NoSQL em Produção

Uma decisão de engenharia deliberada orientou a apresentação deste projeto:
- **Neste documento técnico (.md)**, especifica-se **exclusivamente o Modelo Relacional (PostgreSQL 16+)** estruturado em 3FN;
- **Na aplicação disponibilizada em produção ([mapeamento-esportivo.web.app](https://mapeamento-esportivo.web.app))**, emprega-se um **Banco de Dados Não-Relacional (Firebase Cloud Firestore — NoSQL Document Store)**.

As razões que fundamentam essa abordagem são as seguintes:

### 7.1. Finalidade do Modelo Relacional no Documento
1. **Atendimento aos Objetivos Pedagógicos da Disciplina**: O projeto acadêmico de Banco de Dados / Análise de Sistemas requer a demonstração prática de conceitos formais de modelagem: diagramação relacional (DER), cardinalidade, normalização até a Terceira Forma Normal (3FN), integridade referencial com chaves estrangeiras (`ON DELETE RESTRICT/CASCADE`) e aplicação de constraints declarativas (`CHECK`, `UNIQUE`, `NOT NULL`).
2. **Esquema Estruturado para Análises Estatísticas Consolidadas**: O paradigma relacional com SQL padrão (ANSI SQL) representa a referência consolidada para auditoria, extração de dados e cruzamento analítico de dados censitários escolares.

### 7.2. Razões da Adoção do Firestore na Aplicação em Produção ("No Ar")
1. **Infraestrutura Gerenciada e Custo Zero**: Por se tratar de uma iniciativa de extensão universitária voltada a uma escola pública sem orçamento de TI, o Firestore oferece infraestrutura gerenciada no plano gratuito (Spark), sem custos de aluguel e manutenção de servidores dedicados de banco de dados na nuvem.
2. **Escalabilidade Automática e Facilidade Operacional**: O Firestore foi escolhido na implementação por oferecer infraestrutura gerenciada, escalabilidade automática e integração direta com o Firebase, reduzindo a necessidade de manutenção de servidor próprio. Durante a aplicação simultânea em turmas de 40 a 50 alunos usando celulares, a plataforma atende às requisições sem exigir configuração manual de pools de conexão.
3. **Atualização Dinâmica dos Gráficos**: A sincronização instantânea dos indicadores do painel conforme os estudantes enviam suas respostas é viabilizada pelos ouvintes de snapshots em tempo real (*realtime listeners*) do SDK do Firestore, recurso provido diretamente pela camada da aplicação em produção.
4. **Validação Direta na Borda**: A associação entre as regras de segurança declarativas no servidor (`firestore.rules`) e o cliente web React permitiu validar as regras de negócio diretamente na nuvem, dispensando a implementação de uma API REST intermediária.

---

## 8. Distribuição e Acesso por QR Codes

Para viabilizar a divulgação prática no **Colégio EREM Santa Ana**, foram gerados códigos QR com os links oficiais da aplicação, armazenados em formato vetorial (SVG) e imagem rasterizada (PNG) para impressão:

1. **Questionário Discente (Pesquisa)**:  
   `https://mapeamento-esportivo.web.app/#survey`  
   *Finalidade:* Distribuição para que os estudantes respondam pelo celular em sala de aula ou a partir de cartazes nos murais.
2. **Painel de Resultados (Dashboard)**:  
   `https://mapeamento-esportivo.web.app/#dashboard`  
   *Finalidade:* Consulta aos gráficos consolidados pelos professores de Educação Física e pela coordenação pedagógica.
3. **Sobre o Projeto**:  
   `https://mapeamento-esportivo.web.app/#about`  
   *Finalidade:* Esclarecimentos sobre a proposta de extensão, minimização de dados e objetivos educacionais.

Na interface da aplicação web, o botão **"QR Codes"** no menu superior permite que docentes e discentes visualizem os códigos na tela para projeção ou façam o download dos arquivos diretamente.

---

## 9. Conclusão

A especificação documental do **Mapa Esportivo** alinha-se às demandas do **Colégio EREM Santa Ana (Olinda/PE)**:
- **Definição Objetiva:** Diagnóstico censitário desidentificado de hábitos esportivos discentes;
- **Requisitos e Regras Estruturados:** 16 requisitos funcionais, 7 não funcionais e 8 regras de negócio com delimitação clara entre validação de aplicação e integridade de banco;
- **Modelo Relacional Consistente:** 4 tabelas organizadas segundo a 3FN, com DDL completo em PostgreSQL 16+;
- **Justificativa Arquitetural Transparente:** Distinção explícita entre o modelo acadêmico relacional e a solução NoSQL serverless adotada em produção.
