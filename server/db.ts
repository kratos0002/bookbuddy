import { Sequelize } from 'sequelize';
import { config } from './config';

// Create Sequelize instance based on environment
export const sequelize = config.db.url && config.env === 'production'
  ? new Sequelize(config.db.url, {
      dialect: 'postgres',
      dialectModule: require('pg'),
      ssl: true,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  : new Sequelize({
      dialect: 'postgres',
      host: config.db.host,
      port: config.db.port,
      database: config.db.name,
      username: config.db.user,
      password: config.db.password,
      logging: config.env === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });

// Test the connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};
