
export interface ProjectConfig {
  title: string;
  category: string;
  description: string;
  materials?: string;
  results?: string;
  tech: string[];
  featuredImage: string;
  otherImages?: string[];
  githubUrl?: string;
}

export interface Project extends ProjectConfig {
  id: string;
  folderPath: string;
  imageUrl: string;
  images: string[];
}

export interface Skill {
  name: string;
  level: number;
  category: 'Hardware' | 'Software' | 'Tools';
}
