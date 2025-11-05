'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Upload, X, LogOut, User, Code, ExternalLink, Clock, Settings } from 'lucide-react'
import { SetupNotice } from '@/components/setup-notice'
import { AdminGuard } from '@/components/admin-guard'
import Link from 'next/link'

type Project = Database['public']['Tables']['projects']['Row']
type Skill = Database['public']['Tables']['skills']['Row']
type About = Database['public']['Tables']['about']['Row']
type SocialLink = Database['public']['Tables']['social_links']['Row']
type Timeline = Database['public']['Tables']['timeline']['Row']

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [about, setAbout] = useState<About | null>(null)
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [timeline, setTimeline] = useState<Timeline[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')
  const { toast } = useToast()

  // Project states
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    technologies: '',
    github_url: '',
    live_url: '',
    featured: false
  })

  // Skill states
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [skillFormData, setSkillFormData] = useState({
    name: '',
    category: '',
    level: 80,
    icon: ''
  })

  // About states
  const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false)
  const [aboutFormData, setAboutFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    email: '',
    phone: '',
    location: ''
  })

  // Social Link states
  const [isSocialDialogOpen, setIsSocialDialogOpen] = useState(false)
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null)
  const [socialFormData, setSocialFormData] = useState({
    platform: '',
    url: '',
    icon: '',
    display_order: 0
  })

  // Timeline states
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false)
  const [editingTimeline, setEditingTimeline] = useState<Timeline | null>(null)
  const [timelineFormData, setTimelineFormData] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    type: 'experience',
    display_order: 0
  })

  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [projectsRes, skillsRes, aboutRes, socialRes, timelineRes] = await Promise.all([
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('skills').select('*').order('category', { ascending: true }),
        supabase.from('about').select('*').single(),
        supabase.from('social_links').select('*').order('display_order', { ascending: true }),
        supabase.from('timeline').select('*').order('display_order', { ascending: true })
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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      window.location.href = '/admin/login'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Project functions
  const resetProjectForm = () => {
    setProjectFormData({
      title: '',
      description: '',
      image_url: '',
      technologies: '',
      github_url: '',
      live_url: '',
      featured: false
    })
    setEditingProject(null)
  }

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const projectData = {
        title: projectFormData.title,
        description: projectFormData.description,
        image_url: projectFormData.image_url,
        technologies: projectFormData.technologies.split(',').map(t => t.trim()).filter(t => t),
        github_url: projectFormData.github_url || null,
        live_url: projectFormData.live_url || null,
        featured: projectFormData.featured,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingProject) {
        result = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingProject.id)
      } else {
        result = await supabase
          .from('projects')
          .insert({
            ...projectData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          })
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: `Project ${editingProject ? 'updated' : 'created'} successfully`,
      })

      setIsProjectDialogOpen(false)
      resetProjectForm()
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingProject ? 'update' : 'create'} project`,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectFormData({
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      technologies: project.technologies.join(', '),
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      featured: project.featured
    })
    setIsProjectDialogOpen(true)
  }

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Project deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  // Skill functions
  const resetSkillForm = () => {
    setSkillFormData({
      name: '',
      category: '',
      level: 80,
      icon: ''
    })
    setEditingSkill(null)
  }

  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const skillData = {
        name: skillFormData.name,
        category: skillFormData.category,
        level: skillFormData.level,
        icon: skillFormData.icon,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingSkill) {
        result = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', editingSkill.id)
      } else {
        result = await supabase
          .from('skills')
          .insert({
            ...skillData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          })
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: `Skill ${editingSkill ? 'updated' : 'created'} successfully`,
      })

      setIsSkillDialogOpen(false)
      resetSkillForm()
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingSkill ? 'update' : 'create'} skill`,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setSkillFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      icon: skill.icon || ''
    })
    setIsSkillDialogOpen(true)
  }

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Skill deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
      })
    }
  }

  // About functions
  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const aboutData = {
        title: aboutFormData.title,
        description: aboutFormData.description,
        image_url: aboutFormData.image_url,
        email: aboutFormData.email,
        phone: aboutFormData.phone,
        location: aboutFormData.location,
        updated_at: new Date().toISOString()
      }

      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboutData)
      })

      if (!response.ok) throw new Error('Failed to update about section')

      toast({
        title: "Success",
        description: "About section updated successfully",
      })

      setIsAboutDialogOpen(false)
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to update about section",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  // Social Link functions
  const resetSocialForm = () => {
    setSocialFormData({
      platform: '',
      url: '',
      icon: '',
      display_order: 0
    })
    setEditingSocial(null)
  }

  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const socialData = {
        platform: socialFormData.platform,
        url: socialFormData.url,
        icon: socialFormData.icon,
        display_order: socialFormData.display_order,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingSocial) {
        result = await supabase
          .from('social_links')
          .update(socialData)
          .eq('id', editingSocial.id)
      } else {
        result = await supabase
          .from('social_links')
          .insert({
            ...socialData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          })
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: `Social link ${editingSocial ? 'updated' : 'created'} successfully`,
      })

      setIsSocialDialogOpen(false)
      resetSocialForm()
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingSocial ? 'update' : 'create'} social link`,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEditSocial = (social: SocialLink) => {
    setEditingSocial(social)
    setSocialFormData({
      platform: social.platform,
      url: social.url,
      icon: social.icon || '',
      display_order: social.display_order
    })
    setIsSocialDialogOpen(true)
  }

  const handleDeleteSocial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social link?')) return

    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Social link deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete social link",
        variant: "destructive",
      })
    }
  }

  // Timeline functions
  const resetTimelineForm = () => {
    setTimelineFormData({
      year: new Date().getFullYear(),
      title: '',
      description: '',
      type: 'experience',
      display_order: 0
    })
    setEditingTimeline(null)
  }

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploading(true)

    try {
      const timelineData = {
        year: timelineFormData.year,
        title: timelineFormData.title,
        description: timelineFormData.description,
        type: timelineFormData.type,
        display_order: timelineFormData.display_order,
        updated_at: new Date().toISOString()
      }

      let result
      if (editingTimeline) {
        result = await supabase
          .from('timeline')
          .update(timelineData)
          .eq('id', editingTimeline.id)
      } else {
        result = await supabase
          .from('timeline')
          .insert({
            ...timelineData,
            id: crypto.randomUUID(),
            created_at: new Date().toISOString()
          })
      }

      if (result.error) throw result.error

      toast({
        title: "Success",
        description: `Timeline event ${editingTimeline ? 'updated' : 'created'} successfully`,
      })

      setIsTimelineDialogOpen(false)
      resetTimelineForm()
      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingTimeline ? 'update' : 'create'} timeline event`,
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEditTimeline = (timeline: Timeline) => {
    setEditingTimeline(timeline)
    setTimelineFormData({
      year: timeline.year,
      title: timeline.title,
      description: timeline.description,
      type: timeline.type,
      display_order: timeline.display_order
    })
    setIsTimelineDialogOpen(true)
  }

  const handleDeleteTimeline = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timeline event?')) return

    try {
      const { error } = await supabase
        .from('timeline')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Timeline event deleted successfully",
      })

      fetchData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Failed to delete timeline event",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <SetupNotice />
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center">
            <div className="mr-4 flex">
              <Link className="mr-6 flex items-center space-x-2" href="/">
                <span className="font-bold">Portfolio</span>
              </Link>
            </div>
            <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
              <Link href="/">Home</Link>
              <Link href="/admin" className="text-primary">Admin</Link>
            </nav>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Portfolio Management</h1>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="skills" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="about" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                About
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                Social
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timeline
              </TabsTrigger>
            </TabsList>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Projects</h2>
                <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetProjectForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProject ? 'Edit Project' : 'Add New Project'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProject ? 'Update the project details below.' : 'Fill in the details to create a new project.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProjectSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={projectFormData.title}
                            onChange={(e) => setProjectFormData(prev => ({ ...prev, title: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="featured"
                            checked={projectFormData.featured}
                            onCheckedChange={(checked) => setProjectFormData(prev => ({ ...prev, featured: checked }))}
                          />
                          <Label htmlFor="featured">Featured Project</Label>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={projectFormData.description}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="image_url">Image URL</Label>
                        <Input
                          id="image_url"
                          value={projectFormData.image_url}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="Enter image URL"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                        <Input
                          id="technologies"
                          value={projectFormData.technologies}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, technologies: e.target.value }))}
                          placeholder="React, TypeScript, Tailwind CSS"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="github_url">GitHub URL (optional)</Label>
                          <Input
                            id="github_url"
                            value={projectFormData.github_url}
                            onChange={(e) => setProjectFormData(prev => ({ ...prev, github_url: e.target.value }))}
                            type="url"
                          />
                        </div>
                        <div>
                          <Label htmlFor="live_url">Live URL (optional)</Label>
                          <Input
                            id="live_url"
                            value={projectFormData.live_url}
                            onChange={(e) => setProjectFormData(prev => ({ ...prev, live_url: e.target.value }))}
                            type="url"
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                          {uploading ? 'Saving...' : (editingProject ? 'Update' : 'Create')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {projects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">No projects yet.</p>
                    <Button onClick={() => setIsProjectDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {project.title}
                              {project.featured && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Featured</span>}
                            </CardTitle>
                            <CardDescription className="mt-2">
                              {project.description}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech) => (
                              <Badge key={tech} variant="secondary">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            {project.github_url && (
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                GitHub
                              </a>
                            )}
                            {project.live_url && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Skills</h2>
                <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetSkillForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSkillSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="skill-name">Skill Name</Label>
                          <Input
                            id="skill-name"
                            value={skillFormData.name}
                            onChange={(e) => setSkillFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="skill-category">Category</Label>
                          <Select value={skillFormData.category} onValueChange={(value) => setSkillFormData(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Frontend">Frontend</SelectItem>
                              <SelectItem value="Backend">Backend</SelectItem>
                              <SelectItem value="Mobile">Mobile</SelectItem>
                              <SelectItem value="Tools">Tools</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="skill-level">Skill Level ({skillFormData.level}%)</Label>
                        <Input
                          id="skill-level"
                          type="range"
                          min="1"
                          max="100"
                          value={skillFormData.level}
                          onChange={(e) => setSkillFormData(prev => ({ ...prev, level: parseInt(e.target.value) }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="skill-icon">Icon (emoji or text)</Label>
                        <Input
                          id="skill-icon"
                          value={skillFormData.icon}
                          onChange={(e) => setSkillFormData(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="⚛️ or React"
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                          {uploading ? 'Saving...' : (editingSkill ? 'Update' : 'Create')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {skills.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">No skills yet.</p>
                    <Button onClick={() => setIsSkillDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Skill
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {skills.map((skill) => (
                    <Card key={skill.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{skill.icon}</span>
                            <div>
                              <CardTitle>{skill.name}</CardTitle>
                              <CardDescription>{skill.category}</CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditSkill(skill)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteSkill(skill.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{skill.level}%</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">About Section</h2>
                <Dialog open={isAboutDialogOpen} onOpenChange={setIsAboutDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit About
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Edit About Section</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAboutSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="about-title">Title</Label>
                        <Input
                          id="about-title"
                          value={aboutFormData.title}
                          onChange={(e) => setAboutFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="about-description">Description</Label>
                        <Textarea
                          id="about-description"
                          value={aboutFormData.description}
                          onChange={(e) => setAboutFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={6}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="about-image">Profile Image URL</Label>
                        <Input
                          id="about-image"
                          value={aboutFormData.image_url}
                          onChange={(e) => setAboutFormData(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="Enter profile image URL"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="about-email">Email</Label>
                          <Input
                            id="about-email"
                            type="email"
                            value={aboutFormData.email}
                            onChange={(e) => setAboutFormData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="about-phone">Phone</Label>
                          <Input
                            id="about-phone"
                            value={aboutFormData.phone}
                            onChange={(e) => setAboutFormData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="about-location">Location</Label>
                          <Input
                            id="about-location"
                            value={aboutFormData.location}
                            onChange={(e) => setAboutFormData(prev => ({ ...prev, location: e.target.value }))}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsAboutDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                          {uploading ? 'Saving...' : 'Update'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {about ? (
                <Card>
                  <CardHeader>
                    <CardTitle>{about.title}</CardTitle>
                    <CardDescription>{about.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {about.email && <div><strong>Email:</strong> {about.email}</div>}
                      {about.phone && <div><strong>Phone:</strong> {about.phone}</div>}
                      {about.location && <div><strong>Location:</strong> {about.location}</div>}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">No about section yet.</p>
                    <Button onClick={() => setIsAboutDialogOpen(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Create About Section
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Social Links Tab */}
            <TabsContent value="social" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Social Links</h2>
                <Dialog open={isSocialDialogOpen} onOpenChange={setIsSocialDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetSocialForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Social Link
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSocial ? 'Edit Social Link' : 'Add New Social Link'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSocialSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="social-platform">Platform</Label>
                          <Input
                            id="social-platform"
                            value={socialFormData.platform}
                            onChange={(e) => setSocialFormData(prev => ({ ...prev, platform: e.target.value }))}
                            placeholder="GitHub, LinkedIn, etc."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="social-order">Display Order</Label>
                          <Input
                            id="social-order"
                            type="number"
                            value={socialFormData.display_order}
                            onChange={(e) => setSocialFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="social-url">URL</Label>
                        <Input
                          id="social-url"
                          value={socialFormData.url}
                          onChange={(e) => setSocialFormData(prev => ({ ...prev, url: e.target.value }))}
                          type="url"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="social-icon">Icon (emoji or text)</Label>
                        <Input
                          id="social-icon"
                          value={socialFormData.icon}
                          onChange={(e) => setSocialFormData(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder="🐙 or GitHub"
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsSocialDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                          {uploading ? 'Saving...' : (editingSocial ? 'Update' : 'Create')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {socialLinks.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">No social links yet.</p>
                    <Button onClick={() => setIsSocialDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Social Link
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {socialLinks.map((social) => (
                    <Card key={social.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{social.icon}</span>
                            <div>
                              <CardTitle>{social.platform}</CardTitle>
                              <CardDescription>{social.url}</CardDescription>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditSocial(social)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteSocial(social.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Timeline Tab */}
            <TabsContent value="timeline" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Timeline</h2>
                <Dialog open={isTimelineDialogOpen} onOpenChange={setIsTimelineDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetTimelineForm}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Timeline Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingTimeline ? 'Edit Timeline Event' : 'Add New Timeline Event'}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTimelineSubmit} className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="timeline-year">Year</Label>
                          <Input
                            id="timeline-year"
                            type="number"
                            value={timelineFormData.year}
                            onChange={(e) => setTimelineFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeline-type">Type</Label>
                          <Select value={timelineFormData.type} onValueChange={(value) => setTimelineFormData(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="experience">Experience</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="achievement">Achievement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="timeline-order">Display Order</Label>
                          <Input
                            id="timeline-order"
                            type="number"
                            value={timelineFormData.display_order}
                            onChange={(e) => setTimelineFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) }))}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="timeline-title">Title</Label>
                        <Input
                          id="timeline-title"
                          value={timelineFormData.title}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="timeline-description">Description</Label>
                        <Textarea
                          id="timeline-description"
                          value={timelineFormData.description}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          required
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsTimelineDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={uploading}>
                          {uploading ? 'Saving...' : (editingTimeline ? 'Update' : 'Create')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {timeline.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground mb-4">No timeline events yet.</p>
                    <Button onClick={() => setIsTimelineDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Timeline Event
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {timeline.map((event) => (
                    <Card key={event.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {event.year} - {event.title}
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {event.type}
                              </span>
                            </CardTitle>
                            <CardDescription>{event.description}</CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditTimeline(event)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteTimeline(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  )
}