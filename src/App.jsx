import Header from './components/Header'
import Hero from './components/Hero'
import Intro from './components/Intro'
import Credentials from './components/Credentials'
import Skills from './components/Skills'
import ProjectsOverview from './components/ProjectsOverview'
import CaseStudies from './components/CaseStudies'
import HowIBuild from './components/HowIBuild'
import FunFacts from './components/FunFacts'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import { GlassDefs } from './components/Glass'
import DuckChatbot from './chatbot/DuckChatbot'
import { projects } from './data'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <GlassDefs />
      <ScrollProgress />
      <Header />
      <main>
        <Hero />
        <Intro />
        <Credentials />
        <Skills />
        <ProjectsOverview />
        <CaseStudies projects={projects} />
        <HowIBuild />
        <FunFacts />
        <Footer />
      </main>
      <DuckChatbot />
    </div>
  )
}
