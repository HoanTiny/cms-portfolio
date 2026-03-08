import PortfolioCrudPage from './PortfolioCrudPage';
import { skillsAPI, servicesAPI, experiencesAPI, projectsAPI, statsAPI, researchAPI } from '../services/api';

// ─── Skills Page ──────────────────────────
export const SkillsPage = () => (
  <PortfolioCrudPage
    title="Skills"
    subtitle="Manage technologies & tools"
    apiService={skillsAPI}
    queryKey="skills"
    dataKey="skills"
    fields={[
      { key: 'name', label: 'Name', required: true, showInTable: true, placeholder: 'e.g. React' },
      { key: 'group', label: 'Group', required: true, showInTable: true, type: 'select', options: ['Frontend Frameworks', 'Styling & UI', 'Tools & Other', 'Backend', 'Database', 'DevOps'] },
      { key: 'icon', label: 'Icon', placeholder: 'Icon name (optional)' },
      { key: 'order', label: 'Order', type: 'number', defaultValue: 0, placeholder: '0' },
    ]}
  />
);

// ─── Services Page ────────────────────────
export const ServicesPage = () => (
  <PortfolioCrudPage
    title="Services"
    subtitle="Manage what you offer"
    apiService={servicesAPI}
    queryKey="services"
    dataKey="services"
    fields={[
      { key: 'title', label: 'Title', required: true, showInTable: true, placeholder: 'e.g. Web Development' },
      { key: 'description', label: 'Description', type: 'textarea', showInTable: true, placeholder: 'Brief description' },
      { key: 'icon', label: 'Icon', placeholder: 'Icon name (optional)' },
      { key: 'order', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);

// ─── Experiences Page ─────────────────────
export const ExperiencesPage = () => (
  <PortfolioCrudPage
    title="Experiences"
    subtitle="Manage work & education timeline"
    apiService={experiencesAPI}
    queryKey="experiences"
    dataKey="experiences"
    fields={[
      { key: 'type', label: 'Type', required: true, showInTable: true, type: 'select', options: ['work', 'education'] },
      { key: 'title', label: 'Title', required: true, showInTable: true, placeholder: 'e.g. Frontend Developer' },
      { key: 'organization', label: 'Organization', required: true, showInTable: true, placeholder: 'e.g. FPT Software' },
      { key: 'location', label: 'Location', placeholder: 'e.g. Hanoi, Vietnam' },
      { key: 'startDate', label: 'Start Date', required: true, placeholder: 'e.g. 2023' },
      { key: 'endDate', label: 'End Date', placeholder: 'e.g. Present', defaultValue: 'Present' },
      { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Role description' },
      { key: 'order', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);

// ─── Projects Page ────────────────────────
export const ProjectsPage = () => (
  <PortfolioCrudPage
    title="Projects"
    subtitle="Manage portfolio projects"
    apiService={projectsAPI}
    queryKey="projects"
    dataKey="projects"
    fields={[
      { key: 'name', label: 'Name', required: true, showInTable: true, placeholder: 'e.g. my-portfolio' },
      { key: 'description', label: 'Description', type: 'textarea', showInTable: true, placeholder: 'Brief description' },
      { key: 'techStack', label: 'Tech Stack', showInTable: true, placeholder: 'React, Next.js, TailwindCSS (comma separated)' },
      { key: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/...' },
      { key: 'liveUrl', label: 'Live URL', placeholder: 'https://...' },
      { key: 'image', label: 'Image URL', placeholder: 'Project screenshot URL' },
      { key: 'date', label: 'Date', placeholder: 'e.g. 04 Feb' },
      { key: 'featured', label: 'Featured', type: 'checkbox', placeholder: 'Show on homepage' },
      { key: 'order', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);

// ─── Stats Page ───────────────────────────
export const StatsPage = () => (
  <PortfolioCrudPage
    title="Stats"
    subtitle="Manage homepage counters"
    apiService={statsAPI}
    queryKey="stats"
    dataKey="stats"
    fields={[
      { key: 'label', label: 'Label', required: true, showInTable: true, placeholder: 'e.g. Year Experience' },
      { key: 'value', label: 'Value', required: true, showInTable: true, placeholder: 'e.g. 2+' },
      { key: 'icon', label: 'Icon', placeholder: 'Icon name (optional)' },
      { key: 'order', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);

// ─── Research Page ────────────────────────
export const ResearchPage = () => (
  <PortfolioCrudPage
    title="Research"
    subtitle="Manage research topics"
    apiService={researchAPI}
    queryKey="research"
    dataKey="researchs"
    fields={[
      { key: 'title', label: 'Title', required: true, showInTable: true, placeholder: 'e.g. Real-Time Video Streaming' },
      { key: 'description', label: 'Description', type: 'textarea', showInTable: true, placeholder: 'Brief description' },
      { key: 'link', label: 'Link', placeholder: 'Reference URL (optional)' },
      { key: 'date', label: 'Date', placeholder: 'e.g. 2024' },
      { key: 'order', label: 'Order', type: 'number', defaultValue: 0 },
    ]}
  />
);
