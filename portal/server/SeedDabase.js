// server/seedDatabase.js
import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import UserModel from './models/User.js';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false,
  }
);

await sequelize.authenticate();
console.log('Connected to PostgreSQL');

const User = UserModel(sequelize);

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const seedUsers = async () => {
  const users = [
    {
      username: 'admin',
      password: await hashPassword('qwe123'),
      email: 'admin@visualdatacore.com',
      role: 'admin',
      isActive: true,
    },
  ];

  console.log('Clearing existing users...');
  await User.destroy({ where: {}, truncate: true });
  await User.bulkCreate(users);
  console.log('User data seeded successfully.');
};

const seedDatabase = async () => {
  console.log('Starting database seeding...');
  try {
    await seedUsers();
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await sequelize.close();
    console.log('Database seeding completed.');
  }
};

await seedDatabase();
