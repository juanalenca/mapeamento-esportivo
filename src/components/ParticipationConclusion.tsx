interface ParticipationConclusionProps {
  practices: { yes: number; no: number }
}

function getParticipationInsight(pct: number): string {
  if (pct >= 75) {
    return `A ampla maioria dos participantes (${pct}%) já possui contato regular com atividades físicas, sinalizando alto engajamento da comunidade escolar e ambiente favorável para a expansão de oficinas e torneios.`
  }
  if (pct >= 50) {
    return `Mais da metade dos estudantes (${pct}%) declara praticar atividades físicas com frequência, apontando para uma base ativa sólida com capacidade de integrar os demais colegas.`
  }
  if (pct >= 35) {
    return `Aproximadamente ${pct}% dos estudantes relatam rotina ativa de exercícios, configurando um equilíbrio que demanda ações de incentivo para que a maioria alcance uma vida fisicamente ativa.`
  }
  return `A minoria dos estudantes (${pct}%) mantém uma rotina regular de esportes, apontando para a necessidade prioritária de iniciativas pedagógicas escolares de conscientização e acesso.`
}

export function ParticipationConclusion({ practices }: ParticipationConclusionProps) {
  const total = (practices.yes || 0) + (practices.no || 0)
  const yesPercent = total > 0 ? Math.round((practices.yes / total) * 100) : 0
  const noPercent = total > 0 ? 100 - yesPercent : 0

  const insightText = getParticipationInsight(yesPercent)

  return (
    <section className="participation-conclusion-card" aria-labelledby="participation-conclusion-title">
      <div className="conclusion-header">
        <span className="conclusion-eyebrow">Diagnóstico Geral</span>
        <h2 id="participation-conclusion-title">Participação Esportiva</h2>
      </div>

      <div className="conclusion-hero">
        <span className="conclusion-hero-number">{yesPercent}%</span>
        <p className="conclusion-hero-label">dos estudantes praticam alguma atividade física</p>
      </div>

      <div className="conclusion-track-wrap" aria-hidden="true">
        <div className="conclusion-progress-track">
          <div className="conclusion-progress-fill" style={{ width: `${yesPercent}%` }} />
        </div>
      </div>

      <div className="conclusion-metrics-row">
        <div className="conclusion-metric-col metric-yes">
          <span className="metric-dot yes-dot" aria-hidden="true" />
          <strong>{practices.yes}</strong> praticam regularmente ({yesPercent}%)
        </div>
        <div className="conclusion-metric-col metric-no">
          <span className="metric-dot no-dot" aria-hidden="true" />
          <strong>{practices.no}</strong> não praticam ({noPercent}%)
        </div>
      </div>

      <div className="conclusion-insight-box">
        <p>{insightText}</p>
      </div>
    </section>
  )
}
