import { Project } from '../models/index.js';
import { fail, success } from '../utils/response.js';

export async function listProjects(req, res) {
  const items = await Project.findAll({ order: [['display_order', 'ASC'], ['created_at', 'DESC']] });
  return success(res, items);
}

export async function getProject(req, res) {
  const item = await Project.findByPk(req.params.id);
  if (!item) return fail(res, 'Project not found', 404);
  return success(res, item);
}

export async function createProject(req, res) {
  const item = await Project.create(req.body);
  return success(res, item, 'Project created', 201);
}

export async function updateProject(req, res) {
  const item = await Project.findByPk(req.params.id);
  if (!item) return fail(res, 'Project not found', 404);
  await item.update(req.body);
  return success(res, item, 'Project updated');
}

export async function deleteProject(req, res) {
  const item = await Project.findByPk(req.params.id);
  if (!item) return fail(res, 'Project not found', 404);
  await item.destroy();
  return success(res, null, 'Project deleted');
}
