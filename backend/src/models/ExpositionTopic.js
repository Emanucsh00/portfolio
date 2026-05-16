import { DataTypes, Model } from 'sequelize';

export class ExpositionTopic extends Model {}

export function initExpositionTopic(sequelize) {
  ExpositionTopic.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      summary: DataTypes.TEXT,
      content: DataTypes.TEXT('long'),
      presentation_url: DataTypes.STRING,
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: 'ExpositionTopic',
      tableName: 'exposition_topics',
      underscored: true,
      paranoid: true
    }
  );

  return ExpositionTopic;
}
