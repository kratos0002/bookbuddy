import { Sequelize, DataTypes, Model } from 'sequelize';
import { config } from '../config';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.user,
  password: config.database.password,
  logging: config.nodeEnv === 'development' ? console.log : false,
});

// User Model
class User extends Model {
  public id!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
  },
}, {
  sequelize,
  tableName: 'users',
});

// Feedback Model
class Feedback extends Model {
  public id!: string;
  public userId!: string;
  public message!: string;
  public type!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Feedback.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('positive', 'negative', 'improvement'),
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'feedback',
});

// BookSuggestion Model
class BookSuggestion extends Model {
  public id!: string;
  public userId!: string;
  public title!: string;
  public author!: string;
  public votes!: number;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BookSuggestion.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  votes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  sequelize,
  tableName: 'book_suggestions',
});

// Set up associations
User.hasMany(Feedback);
Feedback.belongsTo(User);

User.hasMany(BookSuggestion);
BookSuggestion.belongsTo(User);

export { sequelize, User, Feedback, BookSuggestion }; 