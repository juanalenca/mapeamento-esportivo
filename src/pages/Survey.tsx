import { useState, type FormEvent } from 'react'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { ageRanges, barriers, courses, frequencies, genders, grades, sports, type AgeRange, type Barrier, type Course, type Frequency, type Gender, type Grade, type Sport, type SurveyResponse } from '../types'
import { sendSurveyResponse } from '../services/survey'

const initialResponse: SurveyResponse = { course: 'Desenvolvimento de Sistemas', grade: '1º Ano', ageRange: '16 a 17 anos', gender: 'Prefiro não informar', practicesSport: true, practicedSports: [], frequency: '2–3 vezes por semana', desiredSport: 'Futebol', barriers: [], desiredAtSchool: 'Futebol' }

export function Survey({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState<SurveyResponse>(initialResponse)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const toggle = <T extends string>(item: T, current: T[], update: (items: T[]) => void) => update(current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item])
  const setPractice = (value: boolean) => setForm((current) => ({ ...current, practicesSport: value, practicedSports: value ? current.practicedSports.filter((sport) => sport !== 'Outro') : [], frequency: value ? current.frequency : 'Não pratico' }))
  const toggleBarrier = (barrier: Barrier) => {
    if (barrier === 'Nada dificulta') return setForm((current) => ({ ...current, barriers: current.barriers.includes(barrier) ? [] : [barrier] }))
    setForm((current) => ({ ...current, barriers: current.barriers.includes(barrier) ? current.barriers.filter((entry) => entry !== barrier) : [...current.barriers.filter((entry) => entry !== 'Nada dificulta'), barrier] }))
  }
  async function submit(event: FormEvent) {
    event.preventDefault(); setError('')
    if (form.practicesSport && form.practicedSports.length === 0) { setError('Selecione pelo menos uma atividade que você pratica.'); return }
    if (form.barriers.length === 0) { setError('Selecione uma dificuldade ou marque "Nada dificulta".'); return }
    setStatus('sending')
    try { await sendSurveyResponse(form); setStatus('success') } catch { setStatus('error'); setError('Não foi possível registrar sua resposta. Verifique a conexão e tente novamente.') }
  }
  if (status === 'success') return <main className="survey-page"><section className="success-card"><span><CheckCircle2 size={42}/></span><p className="eyebrow">Pesquisa concluída</p><h1>Obrigado por participar!</h1><p>Sua resposta anônima foi registrada e ajudará a construir uma visão mais clara sobre o esporte na escola.</p><button className="primary-button" onClick={onBack}>Ver o painel</button><button className="secondary-button" onClick={() => { setForm(initialResponse); setStatus('idle') }}>Enviar outra resposta</button></section></main>
  return <main className="survey-page"><button className="back-button" onClick={onBack}><ArrowLeft size={18}/> Voltar ao painel</button><section className="survey-intro"><p className="eyebrow">Pesquisa anônima</p><h1>Mapeamento esportivo</h1><p>Responda de acordo com a sua realidade. Não coletamos nome, CPF ou matrícula. As informações de curso e turma servem exclusivamente para análise estatística por grupo.</p></section><form className="survey-form" onSubmit={submit}>

    <fieldset className="demographic-section"><legend><span>📋</span> Perfil do participante</legend><p className="field-help">Essas informações servem apenas para análise estatística por grupo — não identificam você.</p>
      <div className="demographic-grid">
        <label className="demo-field"><span className="demo-label">Curso</span><Select value={form.course} onChange={(course) => setForm({ ...form, course: course as Course })} options={courses}/></label>
        <label className="demo-field"><span className="demo-label">Série / Turma</span><Select value={form.grade} onChange={(grade) => setForm({ ...form, grade: grade as Grade })} options={grades}/></label>
        <div className="demo-field"><span className="demo-label">Faixa etária</span><div className="radio-row compact">{ageRanges.map((age) => <Radio key={age} label={age} checked={form.ageRange === age} onChange={() => setForm({ ...form, ageRange: age as AgeRange })}/>)}</div></div>
        <div className="demo-field"><span className="demo-label">Gênero</span><div className="radio-row compact">{genders.map((g) => <Radio key={g} label={g} checked={form.gender === g} onChange={() => setForm({ ...form, gender: g as Gender })}/>)}</div></div>
      </div>
    </fieldset>

    <fieldset><legend><span>1</span> Você pratica atualmente algum esporte ou atividade física?</legend><div className="radio-row"><Radio label="Sim" checked={form.practicesSport} onChange={() => setPractice(true)}/><Radio label="Não" checked={!form.practicesSport} onChange={() => setPractice(false)}/></div></fieldset>
    <fieldset className={!form.practicesSport ? 'muted-field' : ''} disabled={!form.practicesSport}><legend><span>2</span> Qual esporte ou atividade você pratica atualmente?</legend><p className="field-help">Você pode selecionar mais de uma opção.</p><div className="option-grid">{sports.map((sport) => <Checkbox key={sport} label={sport} checked={form.practicedSports.includes(sport)} onChange={() => toggle<Sport>(sport, form.practicedSports, (practicedSports) => setForm({ ...form, practicedSports }))}/>)}</div></fieldset>
    <fieldset><legend><span>3</span> Com que frequência você pratica?</legend><div className="frequency-list">{frequencies.map((frequency) => <Radio key={frequency} label={frequency} checked={form.frequency === frequency} disabled={!form.practicesSport && frequency !== 'Não pratico'} onChange={() => setForm({ ...form, frequency: frequency as Frequency })}/>)}</div></fieldset>
    <fieldset><legend><span>4</span> Qual esporte ou atividade você gostaria de praticar?</legend><Select value={form.desiredSport} onChange={(desiredSport) => setForm({ ...form, desiredSport: desiredSport as Sport })} options={sports}/></fieldset>
    <fieldset><legend><span>5</span> O que dificulta você praticar esportes?</legend><p className="field-help">Você pode selecionar mais de uma opção.</p><div className="option-grid">{barriers.map((barrier) => <Checkbox key={barrier} label={barrier} checked={form.barriers.includes(barrier)} onChange={() => toggleBarrier(barrier)}/>)}</div></fieldset>
    <fieldset><legend><span>6</span> Qual atividade esportiva você gostaria de ver mais na escola?</legend><Select value={form.desiredAtSchool} onChange={(desiredAtSchool) => setForm({ ...form, desiredAtSchool: desiredAtSchool as Sport })} options={sports}/></fieldset>
    {error && <p className="form-error" role="alert">{error}</p>}<p className="privacy-note">Ao enviar, você concorda que a resposta seja usada de forma agregada exclusivamente neste projeto de extensão.</p><button className="primary-button submit-button" disabled={status === 'sending'} type="submit">{status === 'sending' ? 'Enviando...' : <>Enviar resposta <Send size={18}/></>}</button>
  </form></main>
}

function Radio({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: () => void; disabled?: boolean }) { return <label className="radio-option"><input type="radio" checked={checked} onChange={onChange} disabled={disabled}/><span>{label}</span></label> }
function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) { return <label className="check-option"><input type="checkbox" checked={checked} onChange={onChange}/><span>{label}</span></label> }
function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: readonly string[] }) { return <select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select> }
