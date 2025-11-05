'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  ExternalLink, Github, Mail, Phone, MapPin, Linkedin, ArrowUp, MessageCircle, 
  Award, ArrowRight, Quote, Star, Sparkles, Menu, X, Send, Facebook, Instagram, Twitter
} from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

type Project = Database['public']['Tables']['projects']['Row']
type Skill = Database['public']['Tables']['skills']['Row']
type About = Database['public']['Tables']['about']['Row']
type SocialLink = Database['public']['Tables']['social_links']['Row']
type Timeline = Database['public']['Tables']['timeline']['Row']
type Certificate = Database['public']['Tables']['certificates']['Row']

export default function PortfolioPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [timeline, setTimeline] = useState<Timeline[]>([])
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    fetchData()
    const handleScroll = () => setScrollPosition(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const fetchData = async () => {
    try {
      const [projectsRes, skillsRes, aboutRes, socialRes, timelineRes, certificatesRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('category', { ascending: true }),
        supabase.from('about').select('*').single(),
        supabase.from('social_links').select('*').order('display_order', { ascending: true }),
        supabase.from('timeline').select('*').order('year', { ascending: false }).order('display_order', { ascending: true }),
        supabase.from('certificates').select('*').order('issue_date', { ascending: false })
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

      if (certificatesRes.error) console.error('Certificates error:', certificatesRes.error)
      else setCertificates(certificatesRes.data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Email submitted:', email)
    setEmail('')
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
    if (lower.includes('facebook')) return <Facebook className="w-5 h-5" />
    if (lower.includes('instagram')) return <Instagram className="w-5 h-5" />
    if (lower.includes('twitter')) return <Twitter className="w-5 h-5" />
    return null
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  const name = about?.title?.split(' ')[0] || 'Mahmoud'
  const fullName = about?.title || 'Mahmoud Hafez'
  const aboutText = about?.description || 'My Name is Mahmoud Hafez. I successfully graduated Technical University, Bachelor of Information Systems Higher Institute for Advanced Studies, Katameya, Cairo, Egypt. During my university years, I developed a deep passion for Mobile apps, web apps programming, and I consistently engaged in learning new concepts and techniques in this field. So, officially, my programming August began in 2023 as a Flutter developer. I enjoy learning technologies that interest me, which is why I dedicated a significant amount of time to working with Flutter. One day, I decided to try something new, and I started learning React. I was so excited to see how fast I can build a website with it, and how easy it is to maintain it. Consequently, I quickly learnt Next.js and I used it to build some projects working in a team with a backend dev with my friends.'

  // Sort timeline by year and display_order
  const sortedTimeline = [...timeline].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return (a.display_order || 0) - (b.display_order || 0)
  })

  // Get profile image URL
  const profileImage = about?.image_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + fullName

  // Services data
  const services = [
    { title: 'UI/UX Design', icon: '🎨', description: 'Creating intuitive and beautiful user interfaces' },
    { title: 'Web Design', icon: '🌐', description: 'Modern and responsive web designs' },
    { title: 'Mobile Apps', icon: '📱', description: 'Flutter and React Native mobile applications' }
  ]

  // Skills for banner
  const skillsList = skills.map(s => s.name).join(' + ')

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo in Center */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
              <Link href="/portfolio-website" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">HC</span>
                </div>
                <span className="text-xl font-bold">Hafez Codex</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 ml-auto">
              <a href="#home" className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                Home
              </a>
              <a href="#about" className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                About
              </a>
              <a href="#services" className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                Service
              </a>
              <a href="#resume" className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                Resume
              </a>
              <a href="#projects" className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                Project
              </a>
              <a href="#contact" className="px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">
                Contact
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-border/40">
              <a href="#home" className="block px-4 py-2 rounded-md bg-primary text-primary-foreground" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#about" className="block px-4 py-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>About</a>
              <a href="#services" className="block px-4 py-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Service</a>
              <a href="#resume" className="block px-4 py-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Resume</a>
              <a href="#projects" className="block px-4 py-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Project</a>
              <a href="#contact" className="block px-4 py-2 rounded-md hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Contact</a>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="relative flex flex-col lg:flex-row items-center gap-12">
            {/* Left Side - Quote */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-md"
            >
              <Card className="glass-surface border-primary/20 bg-white dark:bg-card">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary mb-4" />
                  <p className="text-muted-foreground italic">
                    "{fullName}'s Exceptional product design ensure our website's success. Highly Recommended."
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Center - Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                {/* Orange circular background */}
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl -z-10"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-primary/30">
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + fullName
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex-1 space-y-6"
            >
              {/* Greeting Bubble */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative bg-primary/10 rounded-full px-4 py-2 border border-primary/20">
                  <span className="text-sm font-medium">Hello!</span>
                  <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-primary" />
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                I'm <span className="text-primary">{name}</span>,{' '}
                <span className="text-primary">Product Designer</span>.
              </h1>

              {/* Experience Badge */}
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-lg font-semibold">10 Years Experience</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Portfolio
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  Hire me
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/40 bg-white dark:bg-background">
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

      {/* My Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="text-primary">Services</span>
              </h2>
              <p className="text-muted-foreground max-w-md">
                I provide comprehensive design and development services to bring your ideas to life.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-surface border-border/40 hover:border-primary/50 transition-all h-full">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="flex justify-end">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group cursor-pointer hover:bg-primary transition-colors">
                        <ArrowRight className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* My Work Experience Section */}
      <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
            My Work <span className="text-primary">Experience</span>
          </h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border hidden md:block transform -translate-x-1/2"></div>

            <div className="space-y-8">
              {sortedTimeline.length > 0 ? (
                sortedTimeline.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex flex-col md:flex-row gap-6"
                  >
                    {/* Timeline dot */}
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-white dark:border-background z-10"></div>

                    {/* Left Side - Company & Dates */}
                    <div className="flex-1 md:text-right md:pr-8">
                      <div className="font-semibold text-lg mb-1">{event.title}</div>
                      <div className="text-sm text-muted-foreground">{event.year}</div>
                    </div>

                    {/* Right Side - Role & Description */}
                    <div className="flex-1 md:text-left md:pl-8">
                      <div className="bg-card border border-border/40 rounded-lg p-6 glass-surface">
                        <h3 className="text-xl font-semibold mb-2">{event.type || 'Role'}</h3>
                        {event.description && (
                          <p className="text-muted-foreground text-sm">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-12">No experience added yet.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Hire Me Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                <div className="relative w-full aspect-square rounded-full overflow-hidden border-4 border-primary/30">
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + fullName
                    }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold">
                Why Hire <span className="text-primary">me?</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {aboutText.split('.').slice(0, 2).join('.')}.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">450+</div>
                  <div className="text-muted-foreground">Project Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary mb-1">450+</div>
                  <div className="text-muted-foreground">Clients Served</div>
                </div>
              </div>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 mt-4">
                Hire me
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* My Portfolio Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-0">
              Let's have a look at my <span className="text-primary">Portfolio</span>
            </h2>
            <Button variant="outline" className="border-border/40">
              See All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No projects yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {projects.slice(0, 2).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}

          {/* Featured Project */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-card border border-border/40 rounded-lg p-8 glass-surface mt-8"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                {projects[0]?.technologies?.slice(0, 5).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs border-primary/30">
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-2xl font-bold">
                  <span className="text-primary">{projects[0]?.title}</span> - Food Delivery Solution
                </h3>
                <ArrowRight className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground">{projects[0]?.description}</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Testimonials That <span className="text-primary">Speak</span> to My{' '}
              <span className="text-primary">Results</span>
              <Sparkles className="w-6 h-6 inline-block ml-2 text-primary" />
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here's what clients say about working with me.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="glass-surface border-border/40 h-full">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-primary mb-4" />
                    <p className="text-muted-foreground mb-4 italic">
                      "Exceptional work and attention to detail. Highly recommended!"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">U</span>
                      </div>
                      <div>
                        <div className="font-semibold">Client Name</div>
                        <div className="text-sm text-muted-foreground">UI/UX Designer</div>
                      </div>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Have an Awesome Project Idea?{' '}
              <span className="text-primary">Let's Discuss</span>
            </h2>
          </div>

          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <Input
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Send
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Get a Free Review</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Join the engineers</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Get a best Product Designer</a>
          </div>
        </div>
      </section>

      {/* Skills Banner */}
      {skillsList && (
        <section className="py-8 px-4 bg-primary text-primary-foreground overflow-hidden">
          <div className="container mx-auto">
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-50%' }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="flex gap-8 whitespace-nowrap text-lg font-medium"
            >
              <span>{skillsList}</span>
              <span>{skillsList}</span>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer id="contact" className="py-12 px-4 sm:px-6 lg:px-8 bg-background border-t border-border/40">
        <div className="container mx-auto max-w-7xl">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-8 border-b border-border/40">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">Lets Connect there</h2>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Hire me
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-foreground">HC</span>
                </div>
                <span className="text-xl font-bold">Hafez Codex</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Passionate software developer creating beautiful applications.
              </p>
              <div className="flex gap-4">
                {socialLinks.slice(0, 4).map((social) => (
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

            {/* Navigation */}
            <div>
              <h3 className="font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#home" className="text-muted-foreground hover:text-primary transition-colors">Home</a></li>
                <li><a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Service</a></li>
                <li><a href="#resume" className="text-muted-foreground hover:text-primary transition-colors">Resume</a></li>
                <li><a href="#projects" className="text-muted-foreground hover:text-primary transition-colors">Project</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {socialLinks.find(s => s.platform.toLowerCase().includes('phone')) && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {socialLinks.find(s => s.platform.toLowerCase().includes('phone'))?.url.replace('tel:', '')}
                  </li>
                )}
                {socialLinks.find(s => s.platform.toLowerCase().includes('email') || s.platform.toLowerCase().includes('mail')) && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {socialLinks.find(s => s.platform.toLowerCase().includes('email') || s.platform.toLowerCase().includes('mail'))?.url.replace('mailto:', '')}
                  </li>
                )}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold mb-4">Get the latest Information</h3>
              <form onSubmit={handleEmailSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Send
                </Button>
              </form>
            </div>
          </div>

          <div className="border-t border-border/40 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Copyright © {new Date().getFullYear()} Favouur.inc. All Rights Reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">User Terms & Conditions</a>
              <span>|</span>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      {scrollPosition > 300 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
    >
      <Card className="overflow-hidden border-border/40 glass-surface">
        <div className="aspect-video overflow-hidden bg-muted relative">
          <img
            src={project.image_url}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary/90 flex items-center justify-center group cursor-pointer hover:bg-primary transition-colors">
            <ArrowRight className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.technologies?.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/40">
      <div className="aspect-video overflow-hidden bg-muted flex items-center justify-center">
        {certificate.image_url ? (
          <img
            src={certificate.image_url}
            alt={certificate.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Award className="w-16 h-16 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-2">{certificate.name}</h3>
        <p className="text-sm text-muted-foreground mb-2">{certificate.issuer}</p>
        {certificate.issue_date && (
          <p className="text-xs text-muted-foreground">
            Issued: {new Date(certificate.issue_date).toLocaleDateString()}
          </p>
        )}
        {certificate.credential_url && (
          <Button variant="outline" size="sm" className="mt-4" asChild>
            <a href={certificate.credential_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Verify
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

