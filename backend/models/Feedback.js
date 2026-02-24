import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  projectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  schoolName: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
  },
  feedback: {
    type: DataTypes.TEXT,
  },
  rating: {
    type: DataTypes.INTEGER,
    min: 1,
    max: 5,
  },
}, {
  tableName: 'edubuild_feedbacks',
  timestamps: true,
});

export default Feedback;

