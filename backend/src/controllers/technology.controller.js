import { Technology } from '../models/index.js';
import { fail, success } from '../utils/response.js';

export async function listTechnologies(req, res) {
  const items = await Technology.findAll({ order: [['display_order', 'ASC'], ['created_at', 'DESC']] });
  return success(res, items);
}

export async function getTechnology(req, res) {
  const item = await Technology.findByPk(req.params.id);
  if (!item) return fail(res, 'Technology not found', 404);
  return success(res, item);
}

export async function createTechnology(req, res) {
  const item = await Technology.create(req.body);
  return success(res, item, 'Technology created', 201);
}

export async function updateTechnology(req, res) {
  const item = await Technology.findByPk(req.params.id);
  if (!item) return fail(res, 'Technology not found', 404);
  await item.update(req.body);
  return success(res, item, 'Technology updated');
}

export async function deleteTechnology(req, res) {
  const item = await Technology.findByPk(req.params.id);
  if (!item) return fail(res, 'Technology not found', 404);
  await item.destroy();
  return success(res, null, 'Technology deleted');
}
