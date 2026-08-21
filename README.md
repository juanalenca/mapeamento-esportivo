# Mapa Esportivo

Plataforma de extensão curricularizada para mapear, de forma anônima, hábitos, interesses e dificuldades relacionadas a esportes entre alunos da ETE Chico Science, Olinda/PE.

## Tecnologias

- React + TypeScript + Vite
- Firebase Hosting, Firestore e Cloud Functions
- Recharts para visualização de dados

## Execução local

1. Copie `.env.example` para `.env` e revise as variáveis Firebase.
2. Instale as dependências: `pnpm install`.
3. Execute: `pnpm dev`.

O painel mostra dados demonstrativos até que a Cloud Function processe a primeira resposta real.

## Deploy Firebase

1. Autentique-se: `firebase login`.
2. Instale dependências das Functions: `cd functions && npm install`.
3. No diretório raiz: `pnpm build` e `firebase deploy`.

Antes do deploy, configure Firestore, Cloud Functions (plano Blaze, se exigido pelo Firebase) e App Check com reCAPTCHA Enterprise no Console Firebase. Depois, ative a aplicação das regras de Firestore incluídas neste repositório.

## Privacidade e segurança

O formulário não solicita identificação nem dados de saúde. As regras impedem leitura pública das respostas individuais, alterações e exclusões. O dashboard lê apenas estatísticas agregadas em `dashboardStats/current`.
