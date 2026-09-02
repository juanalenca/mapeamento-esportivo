import { CheckCircle2, HeartHandshake, ShieldCheck, UsersRound } from 'lucide-react'

export function About({ onSurvey }: { onSurvey: () => void }) {
  return (
    <main className="content-page">
      <section className="about-hero">
        <p className="eyebrow">Sobre o projeto</p>
        <h1>Dados para incentivar o movimento.</h1>
        <p className="lead">
          O Mapa Esportivo aproxima tecnologia, educação e comunidade escolar para conhecer melhor os
          hábitos e interesses dos estudantes.
        </p>
      </section>
      <section className="about-grid">
        <article>
          <UsersRound />
          <h2>Para quem</h2>
          <p>
            Estudantes, professores de Educação Física, coordenação e toda a comunidade do Colégio EREM
            Santa Ana.
          </p>
        </article>
        <article>
          <HeartHandshake />
          <h2>Nosso propósito</h2>
          <p>
            Organizar informações que possam apoiar o planejamento de atividades esportivas mais
            próximas dos interesses dos alunos.
          </p>
        </article>
        <article>
          <ShieldCheck />
          <h2>Privacidade</h2>
          <p>
            Não coletamos nome, CPF, matrícula ou dados de saúde. As informações de curso e turma servem
            exclusivamente para análise estatística por grupo.
          </p>
        </article>
      </section>
      <section className="steps">
        <p className="eyebrow">Como funciona</p>
        <h2>Uma participação leva poucos minutos</h2>
        <ol>
          <li>
            <span>1</span>
            <div>
              <h3>Responda</h3>
              <p>Conte sobre seus hábitos e interesses esportivos sem criar cadastro.</p>
            </div>
          </li>
          <li>
            <span>2</span>
            <div>
              <h3>Dados organizados</h3>
              <p>As respostas anônimas são reunidas automaticamente em indicadores.</p>
            </div>
          </li>
          <li>
            <span>3</span>
            <div>
              <h3>Resultados para a escola</h3>
              <p>
                O painel mostra tendências que ajudam a comunidade escolar a conversar sobre
                oportunidades.
              </p>
            </div>
          </li>
        </ol>
        <button className="primary-button" onClick={onSurvey}>
          Participar da pesquisa <CheckCircle2 size={18} />
        </button>
      </section>
    </main>
  )
}
