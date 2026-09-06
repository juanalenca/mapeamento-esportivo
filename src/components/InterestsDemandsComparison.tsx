import type { CountItem } from '../types'
import { ChartCard } from './ChartCard'

export function InterestsDemandsComparison({
  desiredSports,
  desiredAtSchool,
  totalResponses = 80,
}: {
  desiredSports: CountItem[]
  desiredAtSchool: CountItem[]
  totalResponses?: number
}) {
  return (
    <section className="interests-demands-section" aria-labelledby="interests-demands-title">
      <div className="subblock-heading">
        <span className="eyebrow">Convergência de Demandas</span>
        <h3 id="interests-demands-title">O que os estudantes querem praticar?</h3>
        <p className="section-subtitle">
          Comparativo entre os interesses pessoais dos jovens e o que esperam que a escola ofereça. <strong>{totalResponses} respostas</strong>
        </p>
      </div>

      <div className="interests-demands-grid">
        <ChartCard
          categoryBadge="Interesse Pessoal"
          title="Atividades que gostariam de praticar"
          description="Modalidades com maior interesse para prática pessoal"
          data={desiredSports}
          hideTotalBadge={true}
          singleColorWithHighlight={true}
          cleanGrid={true}
          showValueLabels={true}
        />
        <ChartCard
          categoryBadge="Demanda para a Escola"
          title="Modalidades sugeridas para a escola"
          description="Projetos e esportes para incentivo na EREM Santa Ana"
          data={desiredAtSchool}
          hideTotalBadge={true}
          singleColorWithHighlight={true}
          cleanGrid={true}
          showValueLabels={true}
        />
      </div>
    </section>
  )
}
