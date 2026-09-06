import type { CountItem } from '../types'
import { ChartCard } from './ChartCard'

export function InterestsDemandsComparison({
  desiredSports,
  desiredAtSchool,
}: {
  desiredSports: CountItem[]
  desiredAtSchool: CountItem[]
}) {
  return (
    <section className="interests-demands-section" aria-labelledby="interests-demands-title">
      <div className="subblock-heading">
        <span className="eyebrow">Convergência de Demandas</span>
        <h3 id="interests-demands-title">O que os estudantes querem praticar?</h3>
        <p>Comparativo entre os interesses pessoais dos jovens e o que esperam que a escola ofereça.</p>
      </div>

      <div className="interests-demands-grid">
        <ChartCard
          categoryBadge="Interesse Pessoal"
          title="Atividades que gostariam de praticar"
          description="Modalidades com maior desejo de aprendizado ou prática individual"
          data={desiredSports}
          singleColorWithHighlight={true}
          cleanGrid={true}
          showValueLabels={true}
        />
        <ChartCard
          categoryBadge="Demanda para a Escola"
          title="Modalidades sugeridas para a escola"
          description="Projetos e esportes para incentivo prioritário na EREM Santa Ana"
          data={desiredAtSchool}
          singleColorWithHighlight={true}
          cleanGrid={true}
          showValueLabels={true}
        />
      </div>
    </section>
  )
}
