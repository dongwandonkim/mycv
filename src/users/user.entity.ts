import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class User {
  id: number;
  email: string;
  password: string;
}
