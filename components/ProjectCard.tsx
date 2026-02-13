
import React from 'react';
import { Project } from '../types';
import { Github } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onNavigate: (path: string) => void;
  onTagClick?: (tag: string) => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1581092921461-7d63503f56d6?auto=format&fit=crop&q=80&w=1000';

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  if (target.src !== FALLBACK_IMAGE) {
    target.src = FALLBACK_IMAGE;
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Embedded Systems':
      return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
    case 'Hardware Design':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
    case 'Sensors':
      return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    case 'Mechanical Design':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
    default:
      return 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20';
  }
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onNavigate, onTagClick }) => {
  const projectPath = `/project/${project.id}`;
  const colorClass = getCategoryColor(project.category);

  return (
    <div className="group relative bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-sm flex flex-col h-full shadow-lg">
      <button 
        onClick={() => onNavigate(projectPath)}
        className="aspect-video overflow-hidden block w-full text-left bg-zinc-950"
      >
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100"
          width="400"
          height="225"
        />
      </button>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span className={`px-2 py-0.5 text-[9px] font-bold rounded border uppercase tracking-widest ${colorClass}`}>
            {project.category}
          </span>
        </div>
        
        <button 
          onClick={() => onNavigate(projectPath)}
          className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors block text-left w-full leading-tight"
        >
          {project.title}
        </button>
        
        <p className="text-zinc-400 text-sm mb-4 line-clamp-2 font-light text-justify">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tech.slice(0, 6).map(t => (
            <button 
              key={t} 
              onClick={(e) => {
                e.stopPropagation();
                onTagClick?.(t);
              }}
              className="mono text-[9px] bg-zinc-950/50 text-zinc-500 px-2 py-0.5 rounded border border-zinc-800/50 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors"
            >
              {t}
            </button>
          ))}
        </div>
        
        <div className="mt-auto flex items-center gap-4 pt-4 border-t border-zinc-800/30">
          <button 
            onClick={() => onNavigate(projectPath)}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2 rounded border border-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            View Details
          </button>
          <a 
            href={project.githubUrl || "#"} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-zinc-500 hover:text-white transition-colors" 
          >
            <Github size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
