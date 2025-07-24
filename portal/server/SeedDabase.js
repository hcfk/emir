// server/seedDatabase.js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from './models/User.js'; // ensure file extensions are included

dotenv.config();

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vdcDB';
await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('Connected to MongoDB');

const hashPassword = async (password) => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

const seedUsers = async () => {
  const users = [
    {
      username: 'admin',
      password: 'qwe123',
      email: 'admin@visualdatacore.com',
      role: 'admin',
    },
  ];

  console.log('Clearing existing users...');
  await User.deleteMany();

  for (const user of users) {
    user.password = await hashPassword(user.password);
  }

  await User.insertMany(users);
  console.log('User data seeded successfully.');
};

const seedDatabase = async () => {
  console.log('Starting database seeding...');
  try {
    await seedUsers();
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database seeding completed.');
  }
};

await seedDatabase();
