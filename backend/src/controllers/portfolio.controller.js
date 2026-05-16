import { Op } from 'sequelize';
import { PortfolioItem } from '../models/index.js';
import { fail, success } from '../utils/response.js';

function normalizeArrayField(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function buildPayload(body, userId) {
  return {
    ...body,
    secondary_technologies: normalizeArrayField(body.secondary_technologies),
    features: normalizeArrayField(body.features),
    updated_by: userId
  };
}

export async function listPortfolio(req, res) {
  const {
    page = 1,
    limit = 10,
    search = '',
    status,
    category,
    isPublic
  } = req.query;

  const where = {};

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { subtitle: { [Op.like]: `%${search}%` } },
      { summary: { [Op.like]: `%${search}%` } }
    ];
  }

  if (status) {
    where.status = status;
  }

  if (category) {
    where.category = category;
  }

  if (typeof isPublic !== 'undefined' && isPublic !== '') {
    where.is_public = isPublic === 'true';
  }

  const offset = (Number(page) - 1) * Number(limit);

  const result = await PortfolioItem.findAndCountAll({
    where,
    limit: Number(limit),
    offset,
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return success(res, {
    items: result.rows,
    pagination: {
      total: result.count,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(result.count / Number(limit))
    }
  });
}

export async function getPortfolioById(req, res) {
  const item = await PortfolioItem.findByPk(req.params.id);

  if (!item) {
    return fail(res, 'Portfolio item not found', 404);
  }

  return success(res, item);
}

export async function createPortfolio(req, res) {
  const payload = buildPayload(req.body, req.user.id);
  payload.created_by = req.user.id;

  const item = await PortfolioItem.create(payload);
  return success(res, item, 'Portfolio item created', 201);
}

export async function updatePortfolio(req, res) {
  const item = await PortfolioItem.findByPk(req.params.id);

  if (!item) {
    return fail(res, 'Portfolio item not found', 404);
  }

  await item.update(buildPayload(req.body, req.user.id));
  return success(res, item, 'Portfolio item updated');
}

export async function patchPortfolioStatus(req, res) {
  const item = await PortfolioItem.findByPk(req.params.id);

  if (!item) {
    return fail(res, 'Portfolio item not found', 404);
  }

  item.status = req.body.status || item.status;
  item.is_public = typeof req.body.is_public === 'boolean' ? req.body.is_public : item.is_public;
  item.updated_by = req.user.id;
  await item.save();

  return success(res, item, 'Portfolio item status updated');
}

export async function deletePortfolio(req, res) {
  const item = await PortfolioItem.findByPk(req.params.id);

  if (!item) {
    return fail(res, 'Portfolio item not found', 404);
  }

  item.deleted_by = req.user.id;
  await item.save();
  await item.destroy();

  return success(res, null, 'Portfolio item deleted');
}
