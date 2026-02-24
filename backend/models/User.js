import { DataTypes } from 'sequelize';
import bcryptjs from 'bcryptjs';
import { sequelize } from '../middleware/config/db.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    lowercase: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('student', 'admin'),
    defaultValue: 'student',
  },
  school: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
}, {
  tableName: 'edubuild_users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(user.password, salt);
      }
    },
  },
});

// Instance method to compare passwords
User.prototype.comparePassword = async function (plainPassword) {
  return await bcryptjs.compare(plainPassword, this.password);
};

export default User;

