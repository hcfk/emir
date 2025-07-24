// models/DMessage.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class DMessage extends Model {}

  DMessage.init({
    messageType: {
      type: DataTypes.ENUM('urgent', 'alarm', 'status', 'health', 'coordinate', 'text'),
      allowNull: false
    },
    contentText: DataTypes.TEXT,
    originalVoiceUrl: DataTypes.STRING,
    convertedText: DataTypes.TEXT,
    locationGeometry: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'DMessage',
    timestamps: true
  });

  return DMessage;
};
