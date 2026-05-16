import { DataTypes, Model } from 'sequelize';

export class SoftSkill extends Model {}

export function initSoftSkill(sequelize) {
  SoftSkill.init(
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
      description: DataTypes.TEXT,
      badge_color: DataTypes.STRING,
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
      modelName: 'SoftSkill',
      tableName: 'soft_skills',
      underscored: true,
      paranoid: true
    }
  );

  return SoftSkill;
}
