export interface User {
  id: number;
  username: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InsertUser {
  username: string;
  password: string;
} 