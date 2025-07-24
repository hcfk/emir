// models/Team.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Team extends Model {}

  Team.init({
    name: { type: DataTypes.STRING, allowNull: false },
    responsibilityType: {
      type: DataTypes.ENUM('bbox', 'city', 'ilce', 'district'),
      allowNull: true
    },
    responsibilityGeometry: {
      type: DataTypes.GEOMETRY('POLYGON', 4326),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Team',
    timestamps: true
  });

  return Team;
};