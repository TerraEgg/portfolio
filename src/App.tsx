import { useEffect, useState } from 'react'
import AnimatedBackground from './components/AnimatedBackground'
import ProjectCard from './components/ProjectCard'
import GameCard from './components/GameCard'
import DiscordStatus from './components/DiscordStatus'
import PerthClock from './components/PerthClock'
import Snowfall from './components/Snowfall'
import './App.css'

interface Project {
  name: string
  description: string
  url: string
  language: string | null
}

interface Game {
  name: string
  logo: string
  steamUrl: string
}

const GAMES: Game[] = [
  {
    name: 'Rust',
    logo: '/games/Rust.png',
    steamUrl: 'https://steamcommunity.com/app/252490/'
  },
  {
    name: 'BeamNG.drive',
    logo: '/games/BeamNG.drive.png',
    steamUrl: 'https://steamcommunity.com/app/284160/'
  },
  {
    name: 'The Finals',
    logo: '/games/The Finals.jpg',
    steamUrl: 'https://steamcommunity.com/app/2080350/'
  },
  {
    name: 'GTA5',
    logo: '/games/GTA5.png',
    steamUrl: 'https://steamcommunity.com/app/271590/'
  }
]


export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    const waitForAssets = async () => {
      const maxWaitMs = 20000
      const timeout = new Promise<void>((resolve) => {
        window.setTimeout(() => resolve(), maxWaitMs)
      })

      try {
        if ('fonts' in document) {
          await Promise.race([
            Promise.all([
              document.fonts.load('1em "BlueScreenPersonalUse"', 'TerraEgg'),
              document.fonts.ready
            ]),
            timeout
          ])
        } else {
          await timeout
        }
      } catch {
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void waitForAssets()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true)
      try {
        const response = await fetch('https://api.github.com/users/TerraEgg/repos?sort=updated&per_page=30')
        const data = await response.json()
        
        const projectsData: Project[] = data
          .filter((repo: any) => !repo.fork && repo.description)
          .slice(0, 6)
          .map((repo: any) => ({
            name: repo.name,
            description: repo.description,
            url: repo.html_url,
            language: repo.language
          }))
        
        setProjects(projectsData)
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setProjectsLoading(false)
      }
    }

    void fetchProjects()
  }, [])

  useEffect(() => {
    if (isLoading) return

    const handleProjectsWheel = (e: WheelEvent) => {
      const projectsScroll = document.querySelector('.projects-scroll') as HTMLElement | null
      if (!projectsScroll) return

      const rect = projectsScroll.getBoundingClientRect()
      const isOverProjects = 
        e.clientX >= rect.left && 
        e.clientX <= rect.right && 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom

      if (isOverProjects) {
        const atLeft = projectsScroll.scrollLeft <= 0
        const atRight = Math.abs(projectsScroll.scrollLeft + projectsScroll.clientWidth - projectsScroll.scrollWidth) < 2
        if ((e.deltaY < 0 && atLeft) || (e.deltaY > 0 && atRight)) {
          return
        }
        e.preventDefault()
        projectsScroll.scrollLeft += e.deltaY > 0 ? 315 : -315
      }
    }

    window.addEventListener('wheel', handleProjectsWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleProjectsWheel)
  }, [isLoading])

  useEffect(() => {
    if (!isLoading) {
      const wrapper = document.querySelector('.content-wrapper') as HTMLElement | null
      if (wrapper) {
        wrapper.scrollTop = 0
      }
    }
  }, [isLoading])

  useEffect(() => {
    if (isLoading) return

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (!hasScrolled && target.scrollTop > 0) {
        setHasScrolled(true)
      }
    }

    const wrapper = document.querySelector('.content-wrapper')
    if (wrapper) {
      wrapper.addEventListener('scroll', handleScroll)
      return () => wrapper.removeEventListener('scroll', handleScroll)
    }
  }, [hasScrolled, isLoading])

  return (
    <div className="app-container">
      <Snowfall />
      {!isLoading && <AnimatedBackground />}
      {isLoading && (
        <div className="loading-container">
          <div className="loader-wrapper">
            <span className="simple-spinner"></span>
          </div>
          <p className="loading-text">Loading assets...</p>
        </div>
      )}
      {!isLoading && (
        <div className="content-wrapper">
          <div className="content-container">
            <h1 className="title">Terraegg.dev</h1>
            {!hasScrolled && <div className="bottom-text">Yes you can scroll...</div>}
          </div>
          <div className="scrollable-content">
            <div className="content-section">
              <h2>Hello,</h2>
              <p>
                My name is Kai, also known as Terraegg and Albuman. I’m a web developer who specializes in{' '}
                <span className="typescript-hover">
                  TypeScript
                  <span className="ts-tooltip">
                    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript logo" className="ts-logo" />
                    <span className="ts-tooltip-text">
                      TypeScript is a high-level programming language that adds static typing with optional type annotations to JavaScript.
                    </span>
                  </span>
                </span>.
              </p>
            </div>
            <div className="content-section">
              <h2>My Work</h2>
              <div className="projects-container">
                {projectsLoading ? (
                  <p className="loading-projects">Loading projects...</p>
                ) : projects.length > 0 ? (
                  <div className="projects-scroll">
                    {projects.map((project) => (
                      <ProjectCard key={project.name} project={project} />
                    ))}
                  </div>
                ) : (
                  <p className="no-projects">Something happned and data aint loading. Its either 1. Im banned 2. Githubs down. </p>
                )}
              </div>
            </div>
            <div className="content-section">
              <h2>What games do you play?</h2>
              <div className="games-container">
                <div className="games-scroll">
                  {GAMES.map((game) => (
                    <GameCard key={game.name} {...game} />
                  ))}
                </div>
              </div>
            </div>
            <div className="content-section">
              <h2>What is this blud doing?</h2>
              <DiscordStatus />
            </div>
            <div className="content-section">
              <h2>Oh, hey Kai. Whats the time for you?</h2>
              <PerthClock />
            </div>
            <div className="content-section">
              <h2>The End</h2>
              <p>I hope I didnt bore you too much ;)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
