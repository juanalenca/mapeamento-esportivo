-- ============================================================
-- Mapa Esportivo — Sistema de Levantamento de Perfil Esportivo
-- Instituição: Escola Técnica Estadual Chico Science (Olinda/PE)
-- SGBD: PostgreSQL 16+
-- Script DDL de Criação do Banco de Dados
-- ============================================================

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- 1. TABELA: curso
CREATE TABLE curso (
    id_curso       SERIAL       PRIMARY KEY,
    nome           VARCHAR(120) NOT NULL,
    sigla          VARCHAR(10)  NOT NULL UNIQUE,
    ativo          BOOLEAN      NOT NULL DEFAULT TRUE,
    data_cadastro  TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA: turma
CREATE TABLE turma (
    id_turma       SERIAL       PRIMARY KEY,
    id_curso       INTEGER      NOT NULL REFERENCES curso(id_curso) ON DELETE RESTRICT,
    codigo         VARCHAR(20)  NOT NULL,
    serie_modulo   SMALLINT     NOT NULL CHECK (serie_modulo BETWEEN 1 AND 5),
    turno          VARCHAR(15)  NOT NULL CHECK (turno IN ('manha', 'tarde', 'integral', 'noite')),
    ano_letivo     INTEGER      NOT NULL CHECK (ano_letivo >= 2020),
    ativa          BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_turma_curso_codigo_ano UNIQUE (id_curso, codigo, ano_letivo)
);

CREATE INDEX idx_turma_curso ON turma (id_curso);

-- 3. TABELA: pesquisa
CREATE TABLE pesquisa (
    id_pesquisa    SERIAL       PRIMARY KEY,
    titulo         VARCHAR(150) NOT NULL,
    descricao      TEXT,
    ano_letivo     INTEGER      NOT NULL CHECK (ano_letivo >= 2020),
    data_inicio    DATE         NOT NULL,
    data_fim       DATE         NOT NULL,
    situacao       VARCHAR(15)  NOT NULL DEFAULT 'planejada' 
                                CHECK (situacao IN ('planejada', 'aberta', 'encerrada')),
    data_criacao   TIMESTAMPTZ  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_pesquisa_datas CHECK (data_fim >= data_inicio),
    CONSTRAINT uq_pesquisa_titulo_ano UNIQUE (titulo, ano_letivo)
);

CREATE INDEX idx_pesquisa_situacao ON pesquisa (situacao);

-- 4. TABELA: pergunta
CREATE TABLE pergunta (
    id_pergunta    SERIAL       PRIMARY KEY,
    id_pesquisa    INTEGER      NOT NULL REFERENCES pesquisa(id_pesquisa) ON DELETE RESTRICT,
    enunciado      TEXT         NOT NULL,
    tipo_pergunta  VARCHAR(20)  NOT NULL 
                                CHECK (tipo_pergunta IN ('unica_escolha', 'multipla_escolha', 'texto_livre', 'escala')),
    ordem          SMALLINT     NOT NULL CHECK (ordem >= 1),
    obrigatoria    BOOLEAN      NOT NULL DEFAULT TRUE,
    CONSTRAINT uq_pergunta_pesquisa_ordem UNIQUE (id_pesquisa, ordem)
);

CREATE INDEX idx_pergunta_pesquisa ON pergunta (id_pesquisa, ordem);

-- 5. TABELA: opcao_resposta
CREATE TABLE opcao_resposta (
    id_opcao       SERIAL       PRIMARY KEY,
    id_pergunta    INTEGER      NOT NULL REFERENCES pergunta(id_pergunta) ON DELETE RESTRICT,
    texto_opcao    VARCHAR(200) NOT NULL,
    ordem          SMALLINT     NOT NULL CHECK (ordem >= 1),
    CONSTRAINT uq_opcao_pergunta_ordem UNIQUE (id_pergunta, ordem),
    CONSTRAINT uq_opcao_pergunta_id UNIQUE (id_pergunta, id_opcao)
);

CREATE INDEX idx_opcao_pergunta ON opcao_resposta (id_pergunta, ordem);

-- 6. TABELA: participacao
CREATE TABLE participacao (
    id_participacao SERIAL      PRIMARY KEY,
    id_pesquisa     INTEGER     NOT NULL REFERENCES pesquisa(id_pesquisa) ON DELETE RESTRICT,
    id_turma        INTEGER     NOT NULL REFERENCES turma(id_turma) ON DELETE RESTRICT,
    data_submissao  TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_participacao_pesquisa ON participacao (id_pesquisa);
CREATE INDEX idx_participacao_turma    ON participacao (id_turma);

-- 7. TABELA: resposta
-- A chave estrangeira composta (id_pergunta, id_opcao) garante a regra RN08 diretamente no banco
CREATE TABLE resposta (
    id_resposta     SERIAL      PRIMARY KEY,
    id_participacao INTEGER     NOT NULL REFERENCES participacao(id_participacao) ON DELETE RESTRICT,
    id_pergunta     INTEGER     NOT NULL REFERENCES pergunta(id_pergunta) ON DELETE RESTRICT,
    id_opcao        INTEGER,
    resposta_texto  TEXT,
    CONSTRAINT chk_resposta_conteudo CHECK (id_opcao IS NOT NULL OR resposta_texto IS NOT NULL),
    CONSTRAINT fk_resposta_opcao_pergunta 
        FOREIGN KEY (id_pergunta, id_opcao) 
        REFERENCES opcao_resposta(id_pergunta, id_opcao) 
        ON DELETE RESTRICT
);

CREATE INDEX idx_resposta_participacao     ON resposta (id_participacao);
CREATE INDEX idx_resposta_pergunta_opcao    ON resposta (id_pergunta, id_opcao);
