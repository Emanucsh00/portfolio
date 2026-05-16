import { ExpositionTopic } from '../models/index.js';
import { fail, success } from '../utils/response.js';

export async function listExpositions(req, res) {
  const items = await ExpositionTopic.findAll({ order: [['updated_at', 'DESC']] });
  return success(res, items);
}

export async function getExposition(req, res) {
  const item = await ExpositionTopic.findByPk(req.params.id);
  if (!item) return fail(res, 'Exposition topic not found', 404);
  return success(res, item);
}

export async function createExposition(req, res) {
  const item = await ExpositionTopic.create(req.body);
  return success(res, item, 'Exposition topic created', 201);
}

export async function updateExposition(req, res) {
  const item = await ExpositionTopic.findByPk(req.params.id);
  if (!item) return fail(res, 'Exposition topic not found', 404);
  await item.update(req.body);
  return success(res, item, 'Exposition topic updated');
}

export async function deleteExposition(req, res) {
  const item = await ExpositionTopic.findByPk(req.params.id);
  if (!item) return fail(res, 'Exposition topic not found', 404);
  await item.destroy();
  return success(res, null, 'Exposition topic deleted');
}
