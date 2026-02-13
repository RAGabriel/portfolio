
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
  Github, 
  Linkedin,
  Terminal,
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Layers,
  Code,
  Loader2,
  AlertCircle,
  Cpu,
  Filter,
  X,
  Tag as TagIcon,
  ChevronDown,
  FilterX,
  Copy,
  Check
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import CircuitBackground from './components/CircuitBackground';
import ProjectCard, { getCategoryColor } from './components/ProjectCard';
import { Project, ProjectConfig } from './types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1581092921461-7d63503f56d6?auto=format&fit=crop&q=80&w=1000';

const resolveImagePath = (folderPath: string, fileName: string) => {
  if (!fileName) return FALLBACK_IMAGE;
  if (fileName.startsWith('http') || fileName.startsWith('data:')) return fileName;
  
  // Normalises the path removing ./ prefixes and trailing slashes
  let cleanPath = folderPath.startsWith('./') ? folderPath.substring(2) : folderPath;
  if (cleanPath.endsWith('/')) cleanPath = cleanPath.slice(0, -1);
  
  // Assumes local images are in the 'images' subfolder
  return `${cleanPath}/images/${fileName}`;
};

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbOffset, setThumbOffset] = useState(0);
  const thumbsPerPage = 4;

  const nextMain = useCallback(() => {
    const nextIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIdx);
    if (nextIdx >= thumbOffset + thumbsPerPage) setThumbOffset(nextIdx - thumbsPerPage + 1);
    if (nextIdx < thumbOffset) setThumbOffset(nextIdx);
  }, [currentIndex, images.length, thumbOffset]);

  const prevMain = useCallback(() => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIdx);
    if (prevIdx < thumbOffset) setThumbOffset(prevIdx);
    if (prevIdx >= thumbOffset + thumbsPerPage) setThumbOffset(prevIdx - thumbsPerPage + 1);
  }, [currentIndex, images.length, thumbOffset]);

  const nextThumbs = () => {
    if (thumbOffset + thumbsPerPage < images.length) setThumbOffset(prev => prev + 1);
  };

  const prevThumbs = () => {
    if (thumbOffset > 0) setThumbOffset(prev => prev - 1);
  };

  if (!images || images.length === 0) return null;

  const visibleThumbs = images.slice(thumbOffset, thumbOffset + thumbsPerPage);

  return (
    <div className="space-y-4">
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 group shadow-2xl">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
          {images.map((img, i) => (
            <img key={i} src={img} alt="" className="w-full h-full object-cover flex-shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }} />
          ))}
        </div>
        {images.length > 1 && (
          <>
            <button onClick={prevMain} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-zinc-950/40 hover:bg-emerald-600/80 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10 border border-white/10"><ChevronLeft size={24} /></button>
            <button onClick={nextMain} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-zinc-950/40 hover:bg-emerald-600/80 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all z-10 border border-white/10"><ChevronRight size={24} /></button>
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={prevThumbs} disabled={thumbOffset === 0} className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-emerald-400 disabled:opacity-20 transition-all border border-zinc-800 rounded-full hover:border-emerald-500/40 flex-shrink-0">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1 flex gap-3 overflow-hidden p-1.5 -m-1.5">
          {visibleThumbs.map((img, i) => {
            const absIndex = i + thumbOffset;
            return (
              <button key={absIndex} onClick={() => setCurrentIndex(absIndex)} className={`relative flex-1 aspect-video rounded-xl overflow-hidden border-2 transition-all ${currentIndex === absIndex ? 'border-emerald-500 scale-105 z-10 shadow-lg shadow-emerald-500/20' : 'border-zinc-800 opacity-40 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-cover" alt="" onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }} />
              </button>
            );
          })}
        </div>
        <button onClick={nextThumbs} disabled={thumbOffset + thumbsPerPage >= images.length} className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-emerald-400 disabled:opacity-20 transition-all border border-zinc-800 rounded-full hover:border-emerald-500/40 flex-shrink-0">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// Custom component to render code blocks with style and copy button
const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  
  // Detects language based on class (e.g., language-cpp)
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';

  // If inline code (e.g., `variable`), render simply
  if (inline || !match) {
    return (
      <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-sm border border-zinc-700" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-2xl group ring-1 ring-white/5">
      {/* "Terminal" Title Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/80 border-b border-zinc-800 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50"></div>
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold ml-1">{language}</span>
        </div>
        <button 
          onClick={handleCopy} 
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 rounded border border-transparent hover:border-zinc-700"
          title="Copy code"
        >
          {copied ? <span className="text-emerald-500">Copied!</span> : <span>Copy</span>}
          {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
        </button>
      </div>
      {/* Code Area */}
      <div className="overflow-x-auto bg-zinc-950/50">
        {/* We use 'block' in style to ensure <pre> occupies width */}
        <pre className="!bg-transparent !p-0 !m-0">
          <code className={`block p-6 font-mono text-sm leading-relaxed text-zinc-300 ${className}`} {...props}>
            {children}
          </code>
        </pre>
      </div>
    </div>
  );
};

const Hero = React.memo(() => (
  <section className="pt-24 pb-16 max-w-7xl mx-auto px-4 animate-in fade-in slide-in-from-top-4 duration-700">
    <div className="flex flex-col items-center text-center space-y-6">
      <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
        Electronic <span className="text-emerald-500">Engineer</span>
      </h1>
      <p className="max-w-2xl text-zinc-400 text-lg md:text-xl font-light leading-relaxed">
        Specialising in high-performance hardware architecture and integrated embedded systems.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 pt-6">
        <button onClick={() => document.getElementById('featured-projects')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-white text-zinc-950 font-bold rounded-full hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
          View Projects
        </button>
        <div className="flex items-center gap-4">
          <a href="#" className="group transition-all" aria-label="GitHub">
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-[#6e5494] transition-all">
              <Github size={20} className="text-white transition-colors" />
            </div>
          </a>
          <a href="#" className="group transition-all" aria-label="LinkedIn">
            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-[#0077b5] transition-all">
              <Linkedin size={20} className="text-white transition-colors" />
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
));

const CoreCompetencies = React.memo(() => {
  const competencies = [
    { title: 'Hardware & PCB', icon: <Layers className="text-blue-400" size={20} />, image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=40&w=400', items: ['High-Speed PCB Design', 'Multi-layer Stackup', 'Power Supply Design', 'EMI/EMC Optimisation'] },
    { title: 'Firmware & Software', icon: <Code className="text-amber-400" size={20} />, image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=40&w=400', items: ['C/C++ Bare Metal', 'Embedded Linux', 'RTOS Scheduling', 'DSP Implementation'] },
    { title: 'Protocols & IoT', icon: <Terminal className="text-purple-400" size={20} />, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=40&w=400', items: ['CAN / Modbus / HART', 'LoRaWAN & NB-IoT', 'Secure Bootloading', 'MQTT & Pub/Sub'] }
  ];
  return (
    <section className="py-16 max-w-7xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-white tracking-tight mb-4 text-center">Core Competencies</h2>
      <div className="w-full border-b border-zinc-900 mb-12"></div>
      <div className="grid md:grid-cols-3 gap-8">
        {competencies.map((cat, i) => (
          <div key={i} className="group relative bg-zinc-900/40 border border-zinc-800/60 p-8 rounded-3xl hover:bg-zinc-900/60 transition-all duration-300 overflow-hidden backdrop-blur-sm">
            <div 
              className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-500" 
              style={{ 
                backgroundImage: `url(${cat.image})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                maskImage: 'linear-gradient(225deg, black 0%, transparent 50%)',
                WebkitMaskImage: 'linear-gradient(225deg, black 0%, transparent 50%)'
              }} 
            />
            <div className="relative z-10">
              <div className="mb-6 p-3 bg-zinc-950/50 w-fit rounded-2xl border border-zinc-800 group-hover:border-emerald-500/50 transition-colors">{cat.icon}</div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((skill, j) => (
                  <li key={j} className="flex items-center gap-3 text-zinc-400 text-sm font-light"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></div>{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

interface SectionData {
  title: string;
  content: string;
}

const ProjectDetails = ({ project, onNavigate }: { project: Project; onNavigate: (path: string) => void }) => {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchContent = async () => {
      try {
        const res = await fetch(`projects/${project.id}/text/details.md`);
        
        if (res.ok) {
          const text = await res.text();
          const extractedSections: SectionData[] = [];
          
          // Split text using the ## headers Regex
          // The regex captures the group title (what comes after ##)
          // parts[0] will be everything before the first ##
          // parts[1] will be title 1, parts[2] content 1, parts[3] title 2, etc.
          const parts = text.split(/^##\s+(.+)$/gm);
          
          // 1. Process introductory content (before first ##)
          if (parts[0] && parts[0].trim()) {
            // Remove the H1 Title (# Title) if it exists, as we already show the project title at the top
            const introContent = parts[0].replace(/^#\s+.+$/m, '').trim();
            
            if (introContent) {
              extractedSections.push({
                title: 'Overview', // Default title for the initial block
                content: introContent
              });
            }
          }

          // 2. Process the remaining sections (title + content)
          for (let i = 1; i < parts.length; i += 2) {
            const title = parts[i].trim();
            const content = parts[i + 1] ? parts[i + 1].trim() : '';
            if (content) {
              extractedSections.push({ title, content });
            }
          }

          if (extractedSections.length > 0) {
            setSections(extractedSections);
          } else {
            setSections([{ title: 'Description', content: text }]);
          }
        } else {
          // Fallback to config.json if markdown is missing
          const fallbackSections: SectionData[] = [];
          if (project.description) fallbackSections.push({ title: 'Description', content: project.description });
          if (project.materials) fallbackSections.push({ title: 'Materials', content: project.materials });
          if (project.results) fallbackSections.push({ title: 'Results', content: project.results });
          setSections(fallbackSections);
        }
      } catch (err) {
        setSections([{ title: 'Error', content: 'Could not load documentation.' }]);
      } finally {
        setLoadingContent(false);
      }
    };
    fetchContent();
  }, [project]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <button onClick={() => onNavigate('/')} className="mb-10 text-zinc-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors group">
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Showcase
      </button>

      <div className="mb-16">
        <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-widest mb-6 inline-block ${getCategoryColor(project.category)}`}>
          {project.category}
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-white mb-10 tracking-tight leading-none">{project.title}</h1>
        
        <div className="grid lg:grid-cols-4 gap-12 items-start">
          <div className="lg:col-span-3">
            <ImageCarousel images={project.images} />
            <div className="w-full border-b border-zinc-900 my-12"></div>
            
            {loadingContent ? (
              <div className="flex items-center gap-3 text-zinc-500 font-mono text-xs uppercase tracking-widest py-12">
                <Loader2 className="animate-spin" size={16} /> Synchronising Documentation...
              </div>
            ) : (
              <div className="space-y-16">
                {sections.map((section, index) => (
                  <section key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h3 className="text-2xl font-black text-emerald-500 uppercase tracking-widest mb-6">{section.title}</h3>
                    <div className="prose prose-invert prose-emerald max-w-none prose-p:text-zinc-300 prose-p:text-lg prose-p:leading-relaxed prose-p:font-light prose-strong:text-emerald-500 prose-li:text-zinc-300">
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: CodeBlock
                        }}
                      >
                        {section.content}
                      </ReactMarkdown>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8 sticky top-8">
            <div className="bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 backdrop-blur-md shadow-xl">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Cpu size={14} className="text-emerald-500" /> Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => <span key={t} className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 text-[10px] font-mono rounded-md">{t}</span>)}
              </div>
            </div>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" className="flex items-center justify-between p-6 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800 rounded-3xl text-white text-sm font-bold transition-all group shadow-lg">
                <span className="flex items-center gap-3"><Github size={20} className="text-zinc-500 group-hover:text-white transition-colors" /> Repository</span>
                <ExternalLink size={16} className="text-zinc-700 group-hover:text-emerald-500 transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const manifestRes = await fetch('projects/manifest.json');
        if (!manifestRes.ok) throw new Error('manifest.json not found');
        const folders: string[] = await manifestRes.json();
        const loadedProjects = await Promise.all(folders.map(async (folder) => {
          const configRes = await fetch(`projects/${folder}/config.json`);
          const config: ProjectConfig = await configRes.json();
          const folderPath = `projects/${folder}`;
          const images = [resolveImagePath(folderPath, config.featuredImage), ...(config.otherImages?.map(img => resolveImagePath(folderPath, img)) || [])];
          return { ...config, id: folder, folderPath, imageUrl: images[0], images: images };
        }));
        setProjects(loadedProjects);
      } catch (err) {
        console.error(err instanceof Error ? err.message : 'Error loading projects');
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const uniqueCategories = useMemo(() => ['All', ...new Set(projects.map(p => p.category))], [projects]);
  const uniqueTags = useMemo(() => [...new Set(projects.flatMap(p => p.tech))].sort(), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const categoryMatch = activeCategory === 'All' || p.category === activeCategory;
      const tagMatch = !activeTag || p.tech.includes(activeTag);
      return categoryMatch && tagMatch;
    });
  }, [projects, activeCategory, activeTag]);

  const selectedProject = useMemo(() => {
    const id = currentPath.split('/').pop();
    return projects.find(p => p.id === id);
  }, [currentPath, projects]);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag(tag);
    const featuredSection = document.getElementById('featured-projects');
    if (featuredSection) window.scrollTo({ top: featuredSection.offsetTop - 100, behavior: 'smooth' });
  }, []);

  const clearFilters = () => { setActiveCategory('All'); setActiveTag(null); };

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-mono text-xs uppercase tracking-widest">
      <Loader2 className="animate-spin mb-4" size={32} /> Synchronising Systems...
    </div>
  );

  return (
    <div className="min-h-screen text-zinc-100 flex flex-col selection:bg-emerald-500/30">
      <CircuitBackground />
      <main className="flex-1">
        {currentPath === '/' ? (
          <>
            <Hero />
            <CoreCompetencies />
            <section id="featured-projects" className="py-12 max-w-7xl mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 border-b border-zinc-900 pb-12">
                <div className="w-full md:w-auto text-center md:text-left mb-8 md:mb-0">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Featured Projects</h2>
                </div>
                <div className="flex flex-nowrap items-center gap-2 md:gap-4 w-full md:flex-1 md:justify-end min-w-0">
                  <div className="flex flex-nowrap items-center gap-2 overflow-x-auto scrollbar-hide pb-1 md:pb-0 flex-1 md:flex-none">
                    <div className="relative group flex-1 md:flex-none min-w-[120px] md:min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1 text-[10px] font-black text-zinc-600 uppercase tracking-widest h-3">
                        <Filter size={12} /> <span>Category</span>
                      </div>
                      <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="w-full h-10 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold py-2 pl-3 pr-8 rounded-lg appearance-none focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer">
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat === 'All' ? 'All Categories' : cat}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 bottom-3 text-zinc-500 pointer-events-none" />
                    </div>
                    <div className="relative group flex-1 md:flex-none min-w-[120px] md:min-w-[180px]">
                      <div className="flex items-center gap-2 mb-1 text-[10px] font-black text-zinc-600 uppercase tracking-widest h-3">
                        <TagIcon size={12} /> <span>Tags</span>
                      </div>
                      <select value={activeTag || ''} onChange={(e) => setActiveTag(e.target.value || null)} className="w-full h-10 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-bold py-2 pl-3 pr-8 rounded-lg appearance-none focus:outline-none focus:border-emerald-500/50 transition-all cursor-pointer">
                        <option value="">All Tags</option>
                        {uniqueTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 bottom-3 text-zinc-500 pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex flex-col flex-shrink-0">
                    <div className="mb-1 text-[10px] font-black text-transparent uppercase tracking-widest h-3">.</div>
                    <button onClick={clearFilters} className="flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 text-zinc-500 hover:text-emerald-400 w-10 h-10 rounded-lg border border-zinc-800 hover:border-emerald-500/50 transition-all"><FilterX size={18} /></button>
                  </div>
                </div>
              </div>

              {filteredProjects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map(p => <ProjectCard key={p.id} project={p} onNavigate={setCurrentPath} onTagClick={handleTagClick} />)}
                </div>
              ) : (
                <div className="py-24 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
                  <AlertCircle size={48} className="mx-auto text-zinc-700 mb-4" />
                  <h3 className="text-xl font-bold text-zinc-400">No projects match your filters</h3>
                  <button onClick={clearFilters} className="mt-4 text-emerald-500 text-sm font-bold uppercase tracking-widest hover:underline">Clear all filters</button>
                </div>
              )}
            </section>
          </>
        ) : (
          selectedProject && <ProjectDetails project={selectedProject} onNavigate={setCurrentPath} />
        )}
      </main>

      <footer className="pt-2 pb-8 bg-zinc-950 flex flex-col items-center justify-center">
        <div className="w-full max-w-7xl px-4">
          <div className="border-t border-zinc-900 pt-8 flex flex-row items-center justify-center gap-8 md:gap-12">
            <a href="#" className="flex items-center gap-4 text-zinc-500 hover:text-white transition-all group">
              <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-[#6e5494] transition-all">
                <Github size={17} className="text-white transition-colors" />
              </div>
              <span className="text-sm font-bold">GitHub</span>
            </a>
            <a href="#" className="flex items-center gap-4 text-zinc-500 hover:text-white transition-all group">
              <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 group-hover:border-[#0077b5] transition-all">
                <Linkedin size={17} className="text-white transition-colors" />
              </div>
              <span className="text-sm font-bold">LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
