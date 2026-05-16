import { DataTypes, Model } from 'sequelize';

export class Project extends Model {}

export function initProject(sequelize) {
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      summary: DataTypes.TEXT,
      repository_url: DataTypes.STRING,
      demo_url: DataTypes.STRING,
      image_url: DataTypes.STRING,
      technologies: {
        type: DataTypes.JSON,
        defaultValue: []
      },
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      sequelize,
      modelName: 'Project',
      tableName: 'projects',
      underscored: true,
      paranoid: true
    }
  );

  return Project;
}
