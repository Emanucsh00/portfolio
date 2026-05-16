import {
  ExpositionTopic,
  PortfolioItem,
  Project,
  SoftSkill,
  Technology
} from '../models/index.js';
import { getGithubHistory } from '../services/github.service.js';
import { success } from '../utils/response.js';

export async function publicPortfolio(req, res) {
  const items = await PortfolioItem.findAll({
    where: { is_public: true, status: 'published' },
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return success(res, items);
}

export async function publicProjects(req, res) {
  const items = await Project.findAll({
    where: { is_public: true },
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return success(res, items);
}

export async function publicTechnologies(req, res) {
  const items = await Technology.findAll({
    where: { is_public: true },
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return success(res, items);
}

export async function publicSkills(req, res) {
  const items = await SoftSkill.findAll({
    where: { is_public: true },
    order: [['display_order', 'ASC'], ['created_at', 'DESC']]
  });

  return success(res, items);
}

export async function publicGithubHistory(req, res) {
  const data = await getGithubHistory();
  return success(res, data);
}

export async function publicExposition(req, res) {
  const items = await ExpositionTopic.findAll({
    where: { is_public: true },
    order: [['updated_at', 'DESC']]
  });

  return success(res, items);
}
