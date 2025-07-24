-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- User table
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(20) DEFAULT 'projectuser',
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Device table
CREATE TABLE "Devices" (
  id SERIAL PRIMARY KEY,
  "firebaseToken" TEXT NOT NULL UNIQUE,
  "appDeviceId" TEXT NOT NULL UNIQUE,
  "deviceType" VARCHAR(10) NOT NULL CHECK ("deviceType" IN ('mobile', 'watch', 'tablet')),
  "screenResolution" TEXT,
  "androidUsername" TEXT,
  "osVersion" TEXT,
  brand TEXT,
  model TEXT,
  "registeredAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "lastSeen" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- DMessage table
CREATE TABLE "DMessages" (
  id SERIAL PRIMARY KEY,
  "messageType" VARCHAR(20) NOT NULL CHECK ("messageType" IN ('urgent', 'alarm', 'status', 'health', 'coordinate', 'text')),
  "contentText" TEXT,
  "originalVoiceUrl" TEXT,
  "convertedText" TEXT,
  "locationGeometry" GEOMETRY(Point, 4326),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Personnel table
CREATE TABLE "Personnel" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  contact TEXT,
  "photoUrl" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Project table
CREATE TABLE "Projects" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "isActive" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Team table
CREATE TABLE "Teams" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "responsibilityType" VARCHAR(20) CHECK ("responsibilityType" IN ('bbox', 'city', 'ilce', 'district')),
  "responsibilityGeometry" GEOMETRY(Polygon, 4326),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Artifact table
CREATE TABLE "Artifacts" (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  "locationGeometry" GEOMETRY(Point, 4326),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);
