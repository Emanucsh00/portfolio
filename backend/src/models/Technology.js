import { DataTypes, Model } from 'sequelize';

export class Technology extends Model {}

export function initTechnology(sequelize) {
  Technology.init(
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
      category: DataTypes.STRING,
      icon: DataTypes.STRING,
      level: DataTypes.STRING,
      color: DataTypes.STRING,
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
      modelName: 'Technology',
      tableName: 'technologies',
      underscored: true,
      paranoid: true
    }
  );

  return Technology;
}
