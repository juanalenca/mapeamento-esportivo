import { useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  CheckCircle2,
  Send,
  GraduationCap,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Activity,
  ShieldCheck,
  Check,
} from 'lucide-react'
import {
  ageRanges,
  barriers,
  courses,
  frequencies,
  genders,
  grades,
  sports,
  type AgeRange,
  type Barrier,
  type Frequency,
  type Gender,
  type Grade,
  type Sport,
  type SurveyResponse,
} from '../types'
import { sendSurveyResponse } from '../services/survey'

const initialResponse: SurveyResponse = {
  course: 'Nutrição e Dietética',
  grade: '1º Ano',
  ageRange: '16 a 17 anos',
  gender: 'Prefiro não informar',
  practicesSport: true,
  practicedSports: [],
  frequency: '2–3 vezes por semana',
  desiredSport: 'Futebol',
  barriers: [],
  desiredAtSchool: 'Futebol',
}

export function Survey({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState<SurveyResponse>(initialResponse)
  const [courseChoice, setCourseChoice] = useState<string>('Nutrição e Dietética')
  const [customCourse, setCustomCourse] = useState<string>('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleCourseChange = (selected: string) => {
    setCourseChoice(selected)
    if (selected === 'Outro') {
      setForm((cur) => ({ ...cur, course: customCourse.trim() || 'Outro' }))
    } else {
      setForm((cur) => ({ ...cur, course: selected }))
    }
  }

  const handleCustomCourseChange = (text: string) => {
    setCustomCourse(text)
    setForm((cur) => ({ ...cur, course: text.trim() || 'Outro' }))
  }

  const toggle = <T extends string>(item: T, current: T[], update: (items: T[]) => void) =>
    update(current.includes(item) ? current.filter((entry) => entry !== item) : [...current, item])

  const setPractice = (value: boolean) =>
    setForm((current) => ({
      ...current,
      practicesSport: value,
      practicedSports: value ? current.practicedSports.filter((sport) => sport !== 'Outro') : [],
      frequency: value ? current.frequency : 'Não pratico',
    }))

  const toggleBarrier = (barrier: Barrier) => {
    if (barrier === 'Nada dificulta') {
      return setForm((current) => ({
        ...current,
        barriers: current.barriers.includes(barrier) ? [] : [barrier],
      }))
    }
    setForm((current) => ({
      ...current,
      barriers: current.barriers.includes(barrier)
        ? current.barriers.filter((entry) => entry !== barrier)
        : [...current.barriers.filter((entry) => entry !== 'Nada dificulta'), barrier],
    }))
  }

function formatCourseName(input: string): string {
  const trimmed = input.trim().replace(/\s+/g, ' ')
  if (!trimmed) return 'Outro'
  const lowerConnectives = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'em'])
  return trimmed
    .split(' ')
    .map((word, index) => {
      const lower = word.toLowerCase()
      if (index > 0 && lowerConnectives.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')

    const finalCourse = courseChoice === 'Outro' ? formatCourseName(customCourse) : courseChoice
    if (!finalCourse || finalCourse === 'Outro' && !customCourse.trim()) {
      setError('Por favor, informe o nome do seu curso.')
      return
    }

    if (form.practicesSport && form.practicedSports.length === 0) {
      setError('Selecione pelo menos uma atividade física que você pratica atualmente.')
      return
    }
    if (form.barriers.length === 0) {
      setError('Selecione ao menos um fator que dificulta sua prática ou marque “Nada dificulta”.')
      return
    }

    setStatus('sending')
    try {
      await sendSurveyResponse({ ...form, course: finalCourse })
      setStatus('success')
    } catch {
      setStatus('error')
      setError('Não foi possível registrar sua resposta. Verifique a conexão e tente novamente.')
    }
  }

  if (status === 'success') {
    return (
      <main className="survey-page">
        <section className="success-card">
          <span className="success-icon-badge">
            <CheckCircle2 size={46} />
          </span>
          <p className="eyebrow">Pesquisa registrada</p>
          <h1>Obrigado por participar!</h1>
          <p>
            Sua contribuição anônima foi salva com sucesso e já está integrada aos gráficos e estatísticas
            do painel do Colégio EREM Santa Ana.
          </p>
          <div className="success-actions">
            <button className="primary-button" onClick={onBack}>
              Ver painel atualizado
            </button>
            <button
              className="secondary-button"
              onClick={() => {
                setForm(initialResponse)
                setCourseChoice('Nutrição e Dietética')
                setCustomCourse('')
                setStatus('idle')
              }}
            >
              Nova resposta
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="survey-page">
      <div className="survey-header-nav">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} /> Voltar ao painel
        </button>
        <span className="survey-security-badge">
          <ShieldCheck size={15} /> 100% Anônimo & Seguro
        </span>
      </div>

      <section className="survey-intro">
        <div className="survey-badge-pill">
          <Sparkles size={14} /> Questionário Discente
        </div>
        <h1>Mapeamento Esportivo</h1>
        <p className="survey-lead-text">
          Responda com sinceridade de acordo com a sua realidade escolar e pessoal. 
          Não coletamos nome, CPF ou matrícula. As informações de curso e turma servem exclusivamente 
          para análise estatística agregada por grupo.
        </p>
      </section>

      <form className="survey-form" onSubmit={submit}>
        {/* ── CARD 0: PERFIL DEMOGRÁFICO ── */}
        <section className="survey-step-card demographic-card">
          <div className="card-header">
            <span className="step-badge demo">
              <GraduationCap size={18} />
            </span>
            <div>
              <h2>Perfil do Estudante</h2>
              <p className="field-help">Informações básicas para agrupamento estatístico na escola.</p>
            </div>
          </div>

          <div className="demographic-fields-grid">
            {/* Curso / Itinerário */}
            <div className="form-group course-group">
              <label className="input-label" htmlFor="course-select">
                Curso / Itinerário
              </label>
              <div className="select-wrapper">
                <select
                  id="course-select"
                  value={courseChoice}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="modern-select"
                >
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {courseChoice === 'Outro' && (
                <div className="custom-course-wrapper">
                  <input
                    type="text"
                    className="modern-text-input"
                    placeholder="Digite o nome do seu curso ou itinerário..."
                    value={customCourse}
                    onChange={(e) => handleCustomCourseChange(e.target.value)}
                    autoFocus
                    maxLength={80}
                  />
                  <small className="field-hint">Ex: Ciências Humanas, Linguagens, Técnico em Enfermagem, etc.</small>
                </div>
              )}
            </div>

            {/* Série */}
            <div className="form-group">
              <label className="input-label">Série</label>
              <div className="pill-group">
                {grades.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={`pill-option ${form.grade === grade ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, grade: grade as Grade })}
                  >
                    {form.grade === grade && <Check size={14} />}
                    {grade}
                  </button>
                ))}
              </div>
            </div>

            {/* Faixa Etária */}
            <div className="form-group">
              <label className="input-label">Faixa Etária</label>
              <div className="pill-group">
                {ageRanges.map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={`pill-option ${form.ageRange === age ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, ageRange: age as AgeRange })}
                  >
                    {form.ageRange === age && <Check size={14} />}
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Gênero */}
            <div className="form-group">
              <label className="input-label">Gênero</label>
              <div className="pill-group">
                {genders.map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`pill-option ${form.gender === g ? 'active' : ''}`}
                    onClick={() => setForm({ ...form, gender: g as Gender })}
                  >
                    {form.gender === g && <Check size={14} />}
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PERGUNTA 1: Prática Atual ── */}
        <section className="survey-step-card">
          <div className="card-header">
            <span className="step-badge">1</span>
            <div>
              <h2>Você pratica atualmente algum esporte ou atividade física?</h2>
              <p className="field-help">Considere qualquer modalidade, academia, corrida, futebol ou dança.</p>
            </div>
          </div>

          <div className="choice-cards-row">
            <button
              type="button"
              className={`choice-card ${form.practicesSport ? 'selected' : ''}`}
              onClick={() => setPractice(true)}
            >
              <span className="choice-check-circle">
                {form.practicesSport && <Check size={16} />}
              </span>
              <div className="choice-card-content">
                <strong>Sim, pratico</strong>
                <span>Pratico regularmente esportes ou exercícios</span>
              </div>
            </button>

            <button
              type="button"
              className={`choice-card ${!form.practicesSport ? 'selected' : ''}`}
              onClick={() => setPractice(false)}
            >
              <span className="choice-check-circle">
                {!form.practicesSport && <Check size={16} />}
              </span>
              <div className="choice-card-content">
                <strong>Não pratico</strong>
                <span>Atualmente não realizo atividades físicas</span>
              </div>
            </button>
          </div>
        </section>

        {/* ── PERGUNTA 2: Modalidades Praticadas ── */}
        <section className={`survey-step-card ${!form.practicesSport ? 'card-disabled' : ''}`}>
          <div className="card-header">
            <span className="step-badge">2</span>
            <div>
              <h2>Qual esporte ou atividade você pratica atualmente?</h2>
              <p className="field-help">
                {form.practicesSport
                  ? 'Você pode marcar uma ou mais opções que fazem parte da sua rotina.'
                  : 'Desativado porque você indicou que não pratica esporte atualmente.'}
              </p>
            </div>
          </div>

          <div className="checkbox-grid">
            {sports.map((sport) => {
              const checked = form.practicedSports.includes(sport)
              return (
                <label
                  key={sport}
                  className={`check-card-option ${checked ? 'checked' : ''} ${
                    !form.practicesSport ? 'disabled' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={!form.practicesSport}
                    onChange={() =>
                      toggle<Sport>(sport, form.practicedSports, (practicedSports) =>
                        setForm({ ...form, practicedSports })
                      )
                    }
                  />
                  <span className="custom-check-box">{checked && <Check size={13} />}</span>
                  <span className="check-card-label">{sport}</span>
                </label>
              )
            })}
          </div>
        </section>

        {/* ── PERGUNTA 3: Frequência ── */}
        <section className={`survey-step-card ${!form.practicesSport ? 'card-disabled' : ''}`}>
          <div className="card-header">
            <span className="step-badge">3</span>
            <div>
              <h2>Com que frequência você costuma praticar?</h2>
              <p className="field-help">Indique a regularidade semanal média das suas práticas.</p>
            </div>
          </div>

          <div className="frequency-cards-grid">
            {frequencies.map((frequency) => {
              const isSelected = form.frequency === frequency
              const isDisabled = !form.practicesSport && frequency !== 'Não pratico'
              return (
                <button
                  key={frequency}
                  type="button"
                  disabled={isDisabled}
                  className={`freq-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                  onClick={() => setForm({ ...form, frequency: frequency as Frequency })}
                >
                  <span className="freq-radio-dot">{isSelected && <span className="dot-inner" />}</span>
                  <span className="freq-label">{frequency}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* ── PERGUNTA 4: Desejo Pessoal ── */}
        <section className="survey-step-card">
          <div className="card-header">
            <span className="step-badge">4</span>
            <div>
              <h2>Qual esporte ou atividade você gostaria de praticar?</h2>
              <p className="field-help">Aquela atividade que você tem interesse ou curiosidade de aprender.</p>
            </div>
          </div>

          <div className="select-card-wrapper">
            <select
              value={form.desiredSport}
              onChange={(e) => setForm({ ...form, desiredSport: e.target.value as Sport })}
              className="modern-select full-width"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* ── PERGUNTA 5: Barreiras ── */}
        <section className="survey-step-card">
          <div className="card-header">
            <span className="step-badge">5</span>
            <div>
              <h2>O que mais dificulta você praticar esportes?</h2>
              <p className="field-help">
                Selecione as principais dificuldades que você enfrenta ou marque “Nada dificulta”.
              </p>
            </div>
          </div>

          <div className="checkbox-grid">
            {barriers.map((barrier) => {
              const checked = form.barriers.includes(barrier)
              return (
                <label
                  key={barrier}
                  className={`check-card-option ${checked ? 'checked' : ''} ${
                    barrier === 'Nada dificulta' ? 'highlight-option' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBarrier(barrier)}
                  />
                  <span className="custom-check-box">{checked && <Check size={13} />}</span>
                  <span className="check-card-label">{barrier}</span>
                </label>
              )
            })}
          </div>
        </section>

        {/* ── PERGUNTA 6: Desejadas na Escola ── */}
        <section className="survey-step-card">
          <div className="card-header">
            <span className="step-badge">6</span>
            <div>
              <h2>Qual atividade esportiva você mais gostaria de ver na escola?</h2>
              <p className="field-help">
                Modalidade que o Colégio EREM Santa Ana poderia incentivar em oficinas, torneios ou projetos.
              </p>
            </div>
          </div>

          <div className="select-card-wrapper">
            <select
              value={form.desiredAtSchool}
              onChange={(e) => setForm({ ...form, desiredAtSchool: e.target.value as Sport })}
              className="modern-select full-width"
            >
              {sports.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Mensagem de Erro */}
        {error && (
          <div className="survey-error-alert" role="alert">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Rodapé do Formulário e Envio */}
        <div className="survey-submit-footer">
          <p className="privacy-note">
            Ao enviar, sua resposta anônima é somada às estatísticas coletivas da pesquisa.
          </p>
          <button
            className="primary-button submit-button"
            disabled={status === 'sending'}
            type="submit"
          >
            {status === 'sending' ? (
              <>
                <span className="spinner-icon" /> Gravando resposta...
              </>
            ) : (
              <>
                Enviar resposta anônima <Send size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  )
}
