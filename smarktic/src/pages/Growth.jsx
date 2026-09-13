import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, ArrowUpRight, BarChart3, CheckCircle2, Cookie, Download, Layers, LineChart, Map, Repeat, ShieldCheck, TrendingUp } from 'lucide-react'
import { Link } from '../lib/router.jsx'
import Aurora from '../components/bits/Aurora.jsx'
import SplitText from '../components/bits/SplitText.jsx'
import DecryptedText from '../components/bits/DecryptedText.jsx'
import Magnet from '../components/bits/Magnet.jsx'
import Reveal from '../components/bits/Reveal.jsx'
import SpotlightCard from '../components/bits/SpotlightCard.jsx'
import TiltCard from '../components/bits/TiltCard.jsx'
import Marquee from '../components/bits/Marquee.jsx'
import RoiCalculator from '../components/RoiCalculator.jsx'
import Accordion from '../components/Accordion.jsx'
import CaseStudyModal from '../components/CaseStudyModal.jsx'
import CtaSection from '../components/CtaSection.jsx'

const pillars = [
  {
    icon: Layers,
    title: 'Audit & Optimisation du MarTech Stack',
    text: 'Nous analysons vos outils actuels pour éliminer les doublons coûteux et intégrer des technologies (IA, Automation) qui servent réellement votre Croissance Digitale.',
  },
  {
    icon: LineChart,
    title: 'Architecture de Données & Attribution',
    text: "Finissez-en avec les rapports flous. Nous mettons en place des modèles d'attribution précis pour comprendre exactement quel canal génère de la valeur et optimiser votre ROI en temps réel.",
  },
  {
    icon: Repeat,
    title: 'Stratégie de Conversion & LTV (Life Time Value)',
    text: 'Nous ne cherchons pas seulement le clic, mais la fidélisation. Nous codons des parcours clients qui maximisent la valeur à long terme de chaque utilisateur acquis.',
  },
]

const deliverables = [
  { icon: Map, title: 'Digital Growth Blueprint', text: "La cartographie complète de votre moteur d'acquisition." },
  { icon: BarChart3, title: 'Tableau de Bord de Performance Exécutif', text: 'Vos KPIs business (CAC, LTV, ROAS) centralisés et actionnables.' },
  { icon: TrendingUp, title: "Roadmap d'Optimisation Technologique", text: "Recommandations sur les outils et l'automatisation." },
]

const faq = [
  {
    q: "Qu'est-ce qu'une « Architecture de Croissance » ?",
    a: "C'est l'ensemble des processus, des outils technologiques et des stratégies de données qui permettent à votre entreprise de générer des revenus de manière prévisible, sans dépendre uniquement de la chance ou des tendances éphémères.",
  },
  {
    q: "Comment garantissez-vous l'amélioration de la Performance ?",
    a: "Grâce à une approche rigoureuse de test et d'apprentissage (A/B testing, analyse de cohortes) et une intégration parfaite entre vos équipes Sales et Marketing.",
  },
  {
    q: 'Travaillez-vous avec nos agences de marketing actuelles ?',
    a: "Absolument. Smarktic agit comme l'architecte qui dessine les plans. Nous aidons vos agences ou vos équipes internes à exécuter avec une précision chirurgicale pour maximiser les résultats.",
  },
]

function ProblemSolution() {
  const [mode, setMode] = useState('problem')
  const isProblem = mode === 'problem'

  return (
    <div className={`ps ${isProblem ? 'is-problem' : 'is-solution'}`}>
      <div className="toggle ps-toggle" role="group" aria-label="Problème ou solution">
        {[
          ['problem', 'Le Problème'],
          ['solution', 'La Solution Smarktic'],
        ].map(([id, label]) => (
          <button key={id} className={mode === id ? 'is-on' : ''} onClick={() => setMode(id)}>
            {label}
            {mode === id && <motion.span layoutId="ps-pill" className="toggle-pill" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          className="ps-card"
          initial={{ opacity: 0, rotateX: -25, y: 30 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          exit={{ opacity: 0, rotateX: 25, y: -30 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {isProblem ? (
            <>
              <div className="ps-chips">
                <span><TrendingUp size={14} /> Coûts d'acquisition (CAC)</span>
                <span><Cookie size={14} /> Fin des cookies tiers</span>
                <span><ShieldCheck size={14} /> Exigence de transparence</span>
              </div>
              <p>
                Des budgets marketing <strong>fragmentés</strong>, une <strong>dépendance aux algorithmes</strong> et une incapacité à lier les clics au chiffre d'affaires réel.
              </p>
            </>
          ) : (
            <>
              <div className="ps-chips">
                <span><Layers size={14} /> Architecture technique</span>
                <span><LineChart size={14} /> Performance</span>
                <span><TrendingUp size={14} /> Scalabilité</span>
              </div>
              <p>
                Une <strong>approche d'ingénieur</strong> appliquée à la croissance. Nous concevons l'architecture technique et stratégique qui garantit la Performance et la scalabilité de vos revenus.
              </p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function Growth() {
  const [modal, setModal] = useState(false)

  return (
    <>
      <section className="hero hero-growth">
        <Aurora colors={['#0891b2', '#3b82f6', '#10b981']} />
        <div className="hero-grid" aria-hidden="true" />
        <div className="container hero-inner">
          <DecryptedText text="CROISSANCE DIGITALE" className="eyebrow" />
          <SplitText
            text="De la Visibilité à la Performance : Architectez votre Croissance Digitale."
            className="hero-title"
            stagger={0.016}
            highlight={{ Performance: 'grad-blue', Croissance: 'grad-green', 'Digitale.': 'grad-green', Digitale: 'grad-green' }}
          />
          <motion.p className="hero-sub" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
            Ne vous contentez plus de « faire du digital ». Bâtissez un système d'acquisition et de rétention haute précision qui transforme chaque interaction en actif financier.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
            <Magnet>
              <Link to="/contact?type=performance" className="btn btn-primary btn-lg">
                Réserver mon Diagnostic de Performance <ArrowRight size={18} />
              </Link>
            </Magnet>
            <Magnet>
              <a href="#simulateur" className="btn btn-ghost btn-lg" onClick={(e) => { e.preventDefault(); document.getElementById('simulateur')?.scrollIntoView({ behavior: 'smooth' }) }}>
                Simuler mon ROI
              </a>
            </Magnet>
          </motion.div>
        </div>
      </section>

      <Marquee items={['CAC', 'LTV', 'ROAS', 'Attribution', 'MarTech', 'Automation', 'IA', 'Rétention', 'A/B testing']} reverse />

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">01 — Le défi de la rentabilité</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Le Marketing Digital moderne est devenu complexe." highlight={{ complexe: 'grad-blue' }} />
            <Reveal as="p" className="lead" delay={0.2}>
              Entre l'augmentation des coûts d'acquisition (CAC), la fin des cookies tiers et l'exigence de transparence, les entreprises ne peuvent plus naviguer à l'intuition.
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <ProblemSolution />
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">02 — Nos Piliers d'Intervention</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Trois leviers pour une croissance mesurable." />
          </div>
          <div className="pillar-grid">
            {pillars.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.12}>
                <TiltCard>
                  <SpotlightCard className="pillar-card" color="rgba(34, 211, 238, 0.2)">
                    <span className="pillar-num">0{i + 1}</span>
                    <Icon size={30} className="pillar-icon" />
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </SpotlightCard>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="simulateur">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Simulateur</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Liez vos clics à votre chiffre d'affaires." highlight={{ "chiffre": 'grad-green', "d'affaires.": 'grad-green' }} />
            <Reveal as="p" className="lead" delay={0.2}>
              Ajustez vos hypothèses et voyez l'impact d'une meilleure attribution et d'une meilleure rétention sur votre LTV, votre ratio LTV:CAC et votre ROAS.
            </Reveal>
          </div>
          <Reveal>
            <RoiCalculator />
          </Reveal>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">03 — Ce que vous recevez</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Des livrables concrets et actionnables." />
          </div>
          <div className="pillar-grid">
            {deliverables.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.12}>
                <SpotlightCard className="deliv-card" color="rgba(52, 211, 153, 0.2)">
                  <div className="deliv-top">
                    <Icon size={26} />
                    <motion.span initial={{ scale: 0, rotate: -90 }} whileInView={{ scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + i * 0.15, type: 'spring' }}>
                      <CheckCircle2 size={22} className="deliv-check" />
                    </motion.span>
                  </div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">FAQ</span>
            <SplitText as="h2" by="words" stagger={0.05} className="section-title" text="Questions fréquentes sur la Croissance." />
            <div className="link-cards">
              <Reveal>
                <a className="link-card" href="https://mindfull.ma" target="_blank" rel="noreferrer">
                  <span className="link-card-label">Besoin de former vos équipes ?</span>
                  <span>Découvrez nos certifications internationales avec le Digital Marketing Institute (DMI) sur Mindfull.ma</span>
                  <ArrowUpRight size={20} />
                </a>
              </Reveal>
              <Reveal delay={0.1}>
                <Link className="link-card" to="/services?engagement=audit">
                  <span className="link-card-label">Sécurisez votre croissance</span>
                  <span>Une croissance rapide nécessite une gouvernance solide. Consultez notre service Audit &amp; Gouvernance.</span>
                  <ArrowRight size={20} />
                </Link>
              </Reveal>
            </div>
          </div>
          <Reveal delay={0.15}>
            <Accordion items={faq} />
          </Reveal>
        </div>
      </section>

      <CtaSection
        eyebrow="Passez à l'action"
        title="Transformez chaque interaction en actif financier."
        highlight={{ actif: 'grad-green', 'financier.': 'grad-green' }}
        actions={[{ label: 'Réserver mon Diagnostic de Performance', to: '/contact?type=performance' }]}
      >
        <button className="link-button cta-download" onClick={() => setModal(true)}>
          <Download size={16} /> Télécharger notre étude de cas sur l'optimisation du ROI
        </button>
      </CtaSection>

      <CaseStudyModal open={modal} onClose={() => setModal(false)} />
    </>
  )
}
