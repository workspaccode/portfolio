'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink, Github, Mail, Linkedin, ArrowUp, MessageCircle, Menu, X, Code2, Sparkles, Zap } from 'lucide-react'
import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  useEffect(() => {
    fetchData()
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="w-16 h-16 border-4 border-primary/30 rounded-full" />
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-primary rounded-full animate-spin" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-muted-foreground"
        >
          Loading portfolio...
        </motion.p>
      </div>
    )
  }

  const name = about?.title || 'Mahmoud Hafez'
  const aboutText = about?.description || 'My Name is Mahmoud Hafez. I successfully graduated Technical University, Bachelor of Information Systems Higher Institute for Advanced Studies, Katameya, Cairo, Egypt. During my university years, I developed a deep passion for Mobile apps, web apps programming, and I consistently engaged in learning new concepts and techniques in this field. So, officially, my programming August began in 2023 as a Flutter developer. I enjoy learning technologies that interest me, which is why I dedicated a significant amount of time to working with Flutter. One day, I decided to try something new, and I started learning React. I was so excited to see how fast I can build a website with it, and how easy it is to maintain it. Consequently, I quickly learnt Next.js and I used it to build some projects working in a team with a backend dev with my friends.'

  const splineUrl = process.env.NEXT_PUBLIC_SPLINE_URL as string | undefined

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-animated-gradient" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 -right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 -left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
        />
      </div>

      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-40 border-b border-border/40 glass-surface backdrop-blur-xl"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"
              >
                <Code2 className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Hafez Codex
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {['Introduction', 'About', 'Projects', 'Tech'].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              {socialLinks.slice(0, 3).map((social, index) => (
                <motion.a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label={social.platform}
                >
                  {social.icon || getSocialIcon(social.platform)}
                </motion.a>
              ))}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-surface backdrop-blur-xl border-l border-border/40 md:hidden"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold">Menu</span>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <X />
                </Button>
              </div>
              <nav className="flex flex-col space-y-2">
                {['Introduction', 'About', 'Projects', 'Tech'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-lg font-medium hover:bg-muted/50 transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
              <div className="mt-auto flex gap-3">
                {socialLinks.slice(0, 4).map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all"
                    aria-label={social.platform}
                  >
                    {social.icon || getSocialIcon(social.platform)}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="introduction" className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              style={{ opacity, scale }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Available for work</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent animate-gradient bg-300%">
                  {name}
                </span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-4"
              >
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  A <span className="font-semibold text-foreground">passionate software developer</span> crafting beautiful
                </p>
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-primary">Flutter apps</span> for Android & iOS
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  asChild
                  size="lg"
                  className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <a href="#projects" className="relative z-10 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    View Projects
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{
                        x: ['-100%', '200%'],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild className="group">
                  <a href="#about" className="flex items-center gap-2">
                    About Me
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.div>
                  </a>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-6 pt-8"
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center"
                    >
                      <span className="text-xs font-semibold">{i}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <div className="font-semibold text-foreground">10+ Projects</div>
                  <div>Completed successfully</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex relative"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-full aspect-square"
              >
                {splineUrl ? (
                  <SplineEmbed url={splineUrl} className="rounded-2xl overflow-hidden glass-surface shadow-2xl" height="100%" />
                ) : (
                  <div className="w-full h-full rounded-2xl glass-surface shadow-2xl flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      className="w-48 h-48 rounded-full border-4 border-primary/20 border-t-primary"
                    />
                  </div>
                )}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                  }}
                  className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [360, 180, 0],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                  }}
                  className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="text-muted-foreground text-sm flex flex-col items-center gap-2">
            <span>Scroll to explore</span>
            <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
              />
            </div>
          </div>
        </motion.div>
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
      <section id="projects" className="py-32 px-4 sm:px-6 lg:px-8 border-t border-border/40 relative overflow-hidden">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />

        <div className="container mx-auto max-w-6xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6"
            >
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">My Work</span>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of projects showcasing my skills in mobile and web development
            </p>
          </motion.div>

          {projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center py-20 glass-surface rounded-2xl"
            >
              <Code2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground text-lg mb-2">No projects yet</p>
              <p className="text-sm text-muted-foreground">Check back soon for updates</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-primary" />
                </div>
                <span className="text-lg font-bold">Hafez Codex</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Building beautiful digital experiences with modern technologies.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                {['Introduction', 'About', 'Projects', 'Tech'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Connect</h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all"
                    aria-label={social.platform}
                  >
                    {social.icon || getSocialIcon(social.platform)}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              2025 Hafez Codex. All rights reserved.
            </p>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="overflow-hidden border-border/40 bg-card/50 backdrop-blur-sm h-full transition-all duration-300 hover:shadow-2xl hover:border-primary/50">
        <div className="relative aspect-video overflow-hidden bg-muted">
          <motion.img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
            animate={{
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent flex items-end justify-start p-4"
          >
            {project.featured && (
              <div className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </div>
            )}
          </motion.div>
        </div>

        <CardContent className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {project.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 4).map((tech) => (
              <Badge
                key={tech}
                variant="secondary"
                className="text-xs bg-muted/50 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-muted/50">
                +{project.technologies.length - 4}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            {project.github_url && (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex-1 group/btn"
              >
                <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                  Code
                </a>
              </Button>
            )}
            {project.live_url && (
              <Button
                size="sm"
                asChild
                className="flex-1 bg-primary hover:bg-primary/90 group/btn"
              >
                <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
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
