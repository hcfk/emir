// models/Artifact.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Artifact extends Model {}

  Artifact.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    locationGeometry: {
      type: DataTypes.GEOMETRY('POINT', 4326),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Artifact',
    timestamps: true
  });

  return Artifact;
};