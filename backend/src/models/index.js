import { sequelize } from '../config/database.js';
import { initExpositionTopic, ExpositionTopic } from './ExpositionTopic.js';
import { initLoginChallenge, LoginChallenge } from './LoginChallenge.js';
import { initPortfolioItem, PortfolioItem } from './PortfolioItem.js';
import { initProject, Project } from './Project.js';
import { initSoftSkill, SoftSkill } from './SoftSkill.js';
import { initTechnology, Technology } from './Technology.js';
import { initUser, User } from './User.js';

initUser(sequelize);
initLoginChallenge(sequelize);
initPortfolioItem(sequelize);
initProject(sequelize);
initTechnology(sequelize);
initSoftSkill(sequelize);
initExpositionTopic(sequelize);

User.hasMany(LoginChallenge, { foreignKey: 'user_id', as: 'loginChallenges' });
LoginChallenge.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
  sequelize,
  User,
  LoginChallenge,
  PortfolioItem,
  Project,
  Technology,
  SoftSkill,
  ExpositionTopic
};

export async function syncModels() {
  await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
}
