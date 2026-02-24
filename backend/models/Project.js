import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  budget: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  classLevel: {
    type: DataTypes.ENUM('6-8', '9-10', '11-12'),
    allowNull: false,
  },
  subject: {
    type: DataTypes.ENUM('Physics', 'Chemistry', 'Biology', 'Mathematics', 'Engineering'),
    allowNull: false,
  },
  materials: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  steps: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  learningOutcomes: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  difficulty: {
    type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
    defaultValue: 'Medium',
  },
  rating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    min: 0,
    max: 5,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  tableName: 'edubuild_projects',
  timestamps: true,
});

export default Project;

