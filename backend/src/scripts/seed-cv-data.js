import 'dotenv/config';
import {
  PortfolioItem,
  Project,
  SoftSkill,
  Technology,
  syncModels
} from '../models/index.js';
import { connectDatabase } from '../config/database.js';

const technologies = [
  { name: 'Node.js', category: 'Backend', level: 'Especialización', color: '#345B63', is_public: true, display_order: 1 },
  { name: 'Vue 3', category: 'Frontend', level: 'Especialización', color: '#2C6E7F', is_public: true, display_order: 2 },
  { name: 'React', category: 'Frontend', level: 'Avanzado', color: '#4C7FA6', is_public: true, display_order: 3 },
  { name: 'Next.js', category: 'Frontend', level: 'Avanzado', color: '#112031', is_public: true, display_order: 4 },
  { name: 'TypeScript', category: 'Lenguaje', level: 'Avanzado', color: '#2C6E7F', is_public: true, display_order: 5 },
  { name: 'MySQL', category: 'Base de datos', level: 'Avanzado', color: '#345B63', is_public: true, display_order: 6 },
  { name: 'MariaDB', category: 'Base de datos', level: 'Avanzado', color: '#345B63', is_public: true, display_order: 7 },
  { name: 'PostgreSQL', category: 'Base de datos', level: 'Avanzado', color: '#345B63', is_public: true, display_order: 8 },
  { name: 'AWS', category: 'Cloud', level: 'Avanzado', color: '#152D35', is_public: true, display_order: 9 },
  { name: 'Docker', category: 'DevOps', level: 'Intermedio', color: '#2C6E7F', is_public: true, display_order: 10 },
  { name: 'Firebase', category: 'Servicios', level: 'Intermedio', color: '#A6DAB6', is_public: true, display_order: 11 },
  { name: 'Grafana', category: 'Observabilidad', level: 'Intermedio', color: '#FFF1DD', is_public: true, display_order: 12 },
  { name: 'Prometheus', category: 'Observabilidad', level: 'Intermedio', color: '#FFF1DD', is_public: true, display_order: 13 },
  { name: 'Loki', category: 'Observabilidad', level: 'Intermedio', color: '#FFF1DD', is_public: true, display_order: 14 },
  { name: 'NestJS', category: 'Backend', level: 'Intermedio', color: '#345B63', is_public: true, display_order: 15 }
];

const softSkills = [
  { name: 'Análisis de requerimientos', description: 'Participación directa en análisis funcional y definición de soluciones técnicas.', badge_color: '#345B63', is_public: true, display_order: 1 },
  { name: 'Arquitectura de soluciones', description: 'Diseño de aplicaciones administrativas, APIs REST y flujos de despliegue.', badge_color: '#2C6E7F', is_public: true, display_order: 2 },
  { name: 'Adaptación tecnológica rápida', description: 'Capacidad para integrarse a nuevos stacks y herramientas con poco tiempo de onboarding.', badge_color: '#A6DAB6', is_public: true, display_order: 3 },
  { name: 'Enfoque en resultados', description: 'Priorización de impacto operativo y entregables funcionales para negocio.', badge_color: '#FFF1DD', is_public: true, display_order: 4 },
  { name: 'Trabajo en entornos dinámicos', description: 'Experiencia combinando desarrollo, mantenimiento, soporte y despliegue productivo.', badge_color: '#152D35', is_public: true, display_order: 5 },
  { name: 'Comunicación con clientes', description: 'Implementación de soluciones freelance para distintos rubros con enfoque consultivo.', badge_color: '#345B63', is_public: true, display_order: 6 }
];

const projects = [
  {
    name: 'Sistema POS Fullstack',
    slug: 'sistema-pos-fullstack',
    summary: 'Sistema integral de ventas, usuarios e inventario desarrollado con Node.js y Vue 3, con autenticación JWT, roles y despliegue productivo en AWS.',
    repository_url: '',
    demo_url: '',
    image_url: '',
    technologies: ['Node.js', 'Vue 3', 'JWT', 'AWS', 'MariaDB'],
    status: 'published',
    is_public: true,
    display_order: 1
  },
  {
    name: 'Sistema de Gestión de Inventario para Bodegas',
    slug: 'gestion-inventario-bodegas',
    summary: 'Plataforma administrativa con control multi bodega, transferencias, solicitudes y stock en tiempo real con experiencia de usuario optimizada.',
    repository_url: '',
    demo_url: '',
    image_url: '',
    technologies: ['Node.js', 'Vue 3', 'MySQL', 'WebSockets'],
    status: 'published',
    is_public: true,
    display_order: 2
  },
  {
    name: 'Dashboards de Analítica y Observabilidad',
    slug: 'dashboards-analitica-observabilidad',
    summary: 'Visualización de métricas en tiempo real e integración con Grafana, Prometheus, Loki y Tempo para monitoreo y toma de decisiones.',
    repository_url: '',
    demo_url: '',
    image_url: '',
    technologies: ['Grafana', 'Prometheus', 'Loki', 'Node.js'],
    status: 'published',
    is_public: true,
    display_order: 3
  },
  {
    name: 'Landing Pages y Catálogos Digitales',
    slug: 'landing-pages-catalogos-digitales',
    summary: 'Implementaciones orientadas a marketing digital y conversión, adaptadas a clientes reales y despliegues productivos.',
    repository_url: '',
    demo_url: '',
    image_url: '',
    technologies: ['Vue 3', 'React', 'Cloudflare', 'AWS'],
    status: 'published',
    is_public: true,
    display_order: 4
  }
];

const portfolioItems = [
  {
    title: 'Sistema POS Fullstack',
    subtitle: 'Inventario, ventas, usuarios y despliegue productivo',
    slug: 'portfolio-sistema-pos-fullstack',
    summary: 'Implementación completa de un sistema POS con autenticación JWT, gestión de roles, inventario, ventas y despliegue en AWS.',
    description: 'Proyecto fullstack desarrollado desde el análisis de requerimientos hasta el despliegue. Incluye backend Node.js, frontend Vue 3, control de usuarios, flujos de venta, trazabilidad básica y experiencia administrativa enfocada en operación diaria.',
    category: 'Sistemas Administrativos',
    project_type: 'Aplicación web fullstack',
    main_technology: 'Node.js',
    secondary_technologies: ['Vue 3', 'MariaDB', 'AWS', 'JWT'],
    repository_url: '',
    demo_url: '',
    image_url: '',
    client_name: 'Cliente privado',
    role_performed: 'Fullstack Developer',
    difficulty_level: 'Alta',
    objective: 'Reducir tiempos operativos y centralizar procesos de ventas, inventario y usuarios en una sola plataforma.',
    result: 'Se consolidó un sistema usable en producción con backend robusto, frontend administrativo y despliegue cloud.',
    learnings: 'Fortalecimiento en arquitectura CRUD compleja, autenticación, despliegue y sincronización frontend-backend.',
    features: ['Autenticación JWT', 'Roles y permisos', 'Inventario', 'Ventas', 'Gestión de usuarios'],
    start_date: '2024-01-01',
    end_date: null,
    status: 'published',
    is_public: true,
    display_order: 1,
    internal_notes: 'Basado en experiencia profesional y freelance descrita en el CV.'
  },
  {
    title: 'Gestión de Inventario para Bodegas',
    subtitle: 'Multi bodega, transferencias y stock en tiempo real',
    slug: 'portfolio-gestion-inventario-bodegas',
    summary: 'Sistema de control de inventario con múltiples bodegas, solicitudes, transferencias y actualizaciones operativas en tiempo real.',
    description: 'Aplicación orientada a negocio para administrar bodegas y movimientos internos. Se enfocó en APIs REST escalables, UI administrativa optimizada y control continuo del stock.',
    category: 'Logística e Inventario',
    project_type: 'Sistema administrativo',
    main_technology: 'Node.js',
    secondary_technologies: ['Vue 3', 'MySQL', 'WebSockets'],
    repository_url: '',
    demo_url: '',
    image_url: '',
    client_name: 'Cliente privado',
    role_performed: 'Fullstack Developer',
    difficulty_level: 'Alta',
    objective: 'Tener visibilidad de stock, transferencias y solicitudes entre bodegas sin depender de procesos manuales.',
    result: 'Mejora del control operativo y trazabilidad del inventario con una UI administrativa más eficiente.',
    learnings: 'Diseño de flujos operativos complejos, actualizaciones en tiempo real y optimización de rendimiento.',
    features: ['Multi bodega', 'Transferencias', 'Solicitudes', 'Stock en tiempo real', 'UI administrativa'],
    start_date: '2024-03-01',
    end_date: null,
    status: 'published',
    is_public: true,
    display_order: 2,
    internal_notes: 'Proyecto destacado citado en el CV.'
  },
  {
    title: 'Dashboards de Analítica',
    subtitle: 'Monitoreo, métricas y observabilidad',
    slug: 'portfolio-dashboards-analitica',
    summary: 'Dashboards con métricas en tiempo real e integración con herramientas de observabilidad para monitoreo técnico y operativo.',
    description: 'Construcción de tableros con foco en visualización de datos, integración con Grafana, Prometheus y Loki, y optimización de consultas para mejorar lectura de métricas.',
    category: 'Analítica y Observabilidad',
    project_type: 'Dashboard administrativo',
    main_technology: 'Grafana',
    secondary_technologies: ['Prometheus', 'Loki', 'Node.js'],
    repository_url: '',
    demo_url: '',
    image_url: '',
    client_name: 'Uso interno / cliente',
    role_performed: 'Developer',
    difficulty_level: 'Media-Alta',
    objective: 'Facilitar visualización de métricas y estado de sistemas en tiempo real.',
    result: 'Mejor visibilidad operativa y soporte a decisiones técnicas con datos centralizados.',
    learnings: 'Integración de observabilidad y optimización de consultas para rendimiento.',
    features: ['Métricas en tiempo real', 'Observabilidad', 'Monitoreo', 'Optimización de consultas'],
    start_date: '2024-05-01',
    end_date: null,
    status: 'published',
    is_public: true,
    display_order: 3,
    internal_notes: 'Basado en la sección de proyectos y logros del CV.'
  }
];

async function upsertByField(Model, field, payload) {
  const existing = await Model.findOne({ where: { [field]: payload[field] } });
  if (existing) {
    await existing.update(payload);
    return existing;
  }

  return Model.create(payload);
}

async function run() {
  await connectDatabase();
  await syncModels();

  for (const tech of technologies) {
    await upsertByField(Technology, 'name', tech);
  }

  for (const skill of softSkills) {
    await upsertByField(SoftSkill, 'name', skill);
  }

  for (const project of projects) {
    await upsertByField(Project, 'slug', project);
  }

  for (const item of portfolioItems) {
    await upsertByField(PortfolioItem, 'slug', item);
  }

  console.log('CV data seeded successfully');
  process.exit(0);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
