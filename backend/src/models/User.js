import { DataTypes, Model } from 'sequelize';

export class User extends Model {}

export function initUser(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      firebase_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: DataTypes.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'deleted'),
        allowNull: false,
        defaultValue: 'active'
      },
      totp_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      totp_secret_encrypted: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      pending_totp_secret_encrypted: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      pending_totp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      last_totp_step: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      paranoid: true
    }
  );

  return User;
}
