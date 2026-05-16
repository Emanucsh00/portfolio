import { SoftSkill } from '../models/index.js';
import { fail, success } from '../utils/response.js';

export async function listSkills(req, res) {
  const items = await SoftSkill.findAll({ order: [['display_order', 'ASC'], ['created_at', 'DESC']] });
  return success(res, items);
}

export async function getSkill(req, res) {
  const item = await SoftSkill.findByPk(req.params.id);
  if (!item) return fail(res, 'Soft skill not found', 404);
  return success(res, item);
}

export async function createSkill(req, res) {
  const item = await SoftSkill.create(req.body);
  return success(res, item, 'Soft skill created', 201);
}

export async function updateSkill(req, res) {
  const item = await SoftSkill.findByPk(req.params.id);
  if (!item) return fail(res, 'Soft skill not found', 404);
  await item.update(req.body);
  return success(res, item, 'Soft skill updated');
}

export async function deleteSkill(req, res) {
  const item = await SoftSkill.findByPk(req.params.id);
  if (!item) return fail(res, 'Soft skill not found', 404);
  await item.destroy();
  return success(res, null, 'Soft skill deleted');
}
