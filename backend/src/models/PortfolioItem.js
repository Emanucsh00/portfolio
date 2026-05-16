import { DataTypes, Model } from 'sequelize';

export class PortfolioItem extends Model {}

export function initPortfolioItem(sequelize) {
  PortfolioItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: DataTypes.STRING,
      subtitle: DataTypes.STRING,
      slug: {
        type: DataTypes.STRING,
        unique: true
      },
      summary: DataTypes.TEXT,
      description: DataTypes.TEXT('long'),
      category: DataTypes.STRING,
      project_type: DataTypes.STRING,
      main_technology: DataTypes.STRING,
      secondary_technologies: {
        type: DataTypes.JSON
      },
      repository_url: DataTypes.STRING,
      demo_url: DataTypes.STRING,
      image_url: DataTypes.STRING,
      client_name: DataTypes.STRING,
      role_performed: DataTypes.STRING,
      difficulty_level: DataTypes.STRING,
      objective: DataTypes.TEXT,
      result: DataTypes.TEXT,
      learnings: DataTypes.TEXT,
      features: {
        type: DataTypes.JSON
      },
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      status: {
        type: DataTypes.ENUM('draft', 'published', 'archived'),
        defaultValue: 'draft'
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      internal_notes: DataTypes.TEXT,
      created_by: DataTypes.UUID,
      updated_by: DataTypes.UUID,
      deleted_by: DataTypes.UUID
    },
    {
      sequelize,
      modelName: 'PortfolioItem',
      tableName: 'portfolio_items',
      underscored: true,
      paranoid: true
    }
  );

  return PortfolioItem;
}
