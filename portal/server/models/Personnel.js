// models/Personnel.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Personnel extends Model {}

  Personnel.init({
    name: { type: DataTypes.STRING, allowNull: false },
    role: DataTypes.STRING,
    contact: DataTypes.STRING,
    photoUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Personnel',
    timestamps: true
  });

  return Personnel;
};