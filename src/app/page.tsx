'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Mail, Phone, MapPin, Linkedin, ArrowUp, MessageCircle, Sun, Moon } from 'lucide-react'
import { SetupNotice } from '@/components/setup-notice'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SplineEmbed from '@/components/SplineEmbed'

type Project = Database['public']['Tables']['projects']['Row']
type Skill = Database['public']['Tables']['skills']['Row']
type About = Database['public']['Tables']['about']['Row']
type SocialLink = Database['public']['Tables']['social_links']['Row']
type Timeline = Database['public']['Tables']['timeline']['Row']

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [timeline, setTimeline] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    fetchData()
    const handleScroll = () => setScrollPosition(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes, aboutRes, socialRes, timelineRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('category', { ascending: true }),
        supabase.from('about').select('*').single(),
        supabase.from('social_links').select('*').order('display_order', { ascending: true }),
        supabase.from('timeline').select('*').order('year', { ascending: false }).order('display_order', { ascending: true })
      ])

      if (projectsRes.error) console.error('Projects error:', projectsRes.error)
      else setProjects(projectsRes.data || [])

      if (skillsRes.error) console.error('Skills error:', skillsRes.error)
      else setSkills(skillsRes.data || [])

      if (aboutRes.error && aboutRes.error.code !== 'PGRST116') console.error('About error:', aboutRes.error)
      else setAbout(aboutRes.data)

      if (socialRes.error) console.error('Social links error:', socialRes.error)
      else setSocialLinks(socialRes.data || [])

      if (timelineRes.error) console.error('Timeline error:', timelineRes.error)
      else setTimeline(timelineRes.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {} as Record<string, Skill[]>)

  // Group timeline by year
  const timelineByYear = timeline.reduce((acc, event) => {
    if (!acc[event.year]) acc[event.year] = []
    acc[event.year].push(event)
    return acc
  }, {} as Record<number, Timeline[]>)

  // Get social links with icons
  const getSocialIcon = (platform: string) => {
    const lower = platform.toLowerCase()
    if (lower.includes('linkedin')) return <Linkedin className="w-5 h-5" />
    if (lower.includes('github')) return <Github className="w-5 h-5" />
    if (lower.includes('email') || lower.includes('mail')) return <Mail className="w-5 h-5" />
    if (lower.includes('whatsapp')) return <MessageCircle className="w-5 h-5" />
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const name = about?.title || 'Mahmoud Hafez'
  const aboutText = about?.description || 'My Name is Mahmoud Hafez. I successfully graduated Technical University, Bachelor of Information Systems Higher Institute for Advanced Studies, Katameya, Cairo, Egypt. During my university years, I developed a deep passion for Mobile apps, web apps programming, and I consistently engaged in learning new concepts and techniques in this field. So, officially, my programming August began in 2023 as a Flutter developer. I enjoy learning technologies that interest me, which is why I dedicated a significant amount of time to working with Flutter. One day, I decided to try something new, and I started learning React. I was so excited to see how fast I can build a website with it, and how easy it is to maintain it. Consequently, I quickly learnt Next.js and I used it to build some projects working in a team with a backend dev with my friends.'

  const splineUrl = process.env.NEXT_PUBLIC_SPLINE_URL as string | undefined

  return (
    <div className="min-h-screen bg-background text-foreground bg-animated-gradient">
      <SetupNotice />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 glass-surface">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Hafez Codex</span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#introduction" className="hover:text-primary transition-colors">Introduction</a>
              <a href="#about" className="hover:text-primary transition-colors">About</a>
              <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
              <a href="#tech" className="hover:text-primary transition-colors">Tech</a>
            </nav>

            <div className="flex items-center space-x-4">
              {socialLinks.slice(0, 4).map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.platform}
                >
                  {social.icon || getSocialIcon(social.platform)}
                </a>
              ))}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="introduction" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Hi, I'm <span className="text-primary">{name}</span> a{' '}
              <span className="text-primary">passionate</span> software developer.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
              I build <span className="font-semibold text-foreground">Flutter apps</span> for Android/iOS
            </p>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Stick around to see some of my work.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <a href="#projects">See my latest projects</a>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-border/40 hover:bg-muted">
                <a href="#about">Download</a>
              </Button>
            </div>
          </motion.div>

          {splineUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hidden lg:block"
            >
              <SplineEmbed url={splineUrl} className="rounded-xl overflow-hidden glass-surface" height={460} />
            </motion.div>
          )}
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">ABOUT ME</h2>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          <div className="max-w-4xl">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {aboutText}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {Object.keys(timelineByYear).length > 0 && (
        <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {Object.entries(timelineByYear)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, events]) => (
                  <div key={year} className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-2xl md:text-3xl font-bold">{year}</h3>
                      <div className="flex-1 h-px bg-border"></div>
                    </div>
                    <div className="space-y-3">
                      {events.map((event) => (
                        <p key={event.id} className="text-muted-foreground">
                          {event.title}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies Section */}
      <section id="tech" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">TECHNOLOGIES</h2>
            <div className="flex-1 h-px bg-border"></div>
          </div>
          <p className="text-lg text-muted-foreground mb-12">
            I work with the following technologies and tools:
          </p>

          {Object.keys(skillsByCategory).length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No technologies added yet.</p>
              <Button asChild>
                <Link href="/admin/login">Add Technologies</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="space-y-6">
                  <h3 className="text-xl font-semibold capitalize mb-6">{category}</h3>
                  <div className="flex flex-wrap gap-6">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex flex-col items-center gap-2 group cursor-pointer"
                        title={skill.name}
                      >
                        {skill.icon ? (
                          <div className="text-5xl group-hover:scale-110 transition-transform filter brightness-0 invert">
                            {skill.icon}
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center group-hover:bg-primary/20 transition-colors border border-border/40">
                            <span className="text-lg font-semibold">
                              {skill.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">PROJECTS</h2>
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet.</p>
              <Button asChild>
                <Link href="/admin/login">Add Your First Project</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Copyright 2025 © 2025 Hafez Codex
            </p>
            <div className="flex items-center gap-4">
              {scrollPosition > 300 && (
                <button
                  onClick={scrollToTop}
                  className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors"
                  aria-label="Scroll to top"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
              )}
              {socialLinks.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.platform}
                >
                  {social.icon || getSocialIcon(social.platform) || <span>{social.platform}</span>}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
    <Card className="overflow-hidden border-border/40">
      <div className="aspect-video overflow-hidden bg-muted">
        <img
          src={project.image_url}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 3).map((tech) => (
            <Badge key={tech} variant="secondary" className="text-xs">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          {project.github_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Code
              </a>
            </Button>
          )}
          {project.live_url && (
            <Button size="sm" asChild className="bg-primary hover:bg-primary/90">
              <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Live
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
