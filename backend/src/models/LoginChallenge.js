import { DataTypes, Model } from 'sequelize';

export class LoginChallenge extends Model {}

export function initLoginChallenge(sequelize) {
  LoginChallenge.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      challenge_token_hash: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email_otp_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email_otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      email_verified_step: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      totp_verified_step: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      attempts_email: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      attempts_totp: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      resend_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      last_resend_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: false
      },
      user_agent: {
        type: DataTypes.STRING(500),
        allowNull: false
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: 'LoginChallenge',
      tableName: 'login_challenges',
      underscored: true
    }
  );

  return LoginChallenge;
}
