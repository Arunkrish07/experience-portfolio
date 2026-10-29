import Header from './components/Header'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Credentials from './components/Credentials'
import Skills from './components/Skills'
import ProjectsOverview from './components/ProjectsOverview'
import CaseStudy from './components/CaseStudy'
import HowIBuild from './components/HowIBuild'
import FunFacts from './components/FunFacts'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import { projects } from './data'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Credentials />
        <Skills />
        <ProjectsOverview />
        {projects.map((p, i) => (
          <CaseStudy key={p.id} project={p} flip={i % 2 === 1} dark={i % 2 === 0} />
        ))}
        <HowIBuild />
        <FunFacts />
        <Footer />
      </main>
    </div>
  )
}
