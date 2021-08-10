import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('after insert', this.email);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('after update', this.email);
  }

  @AfterRemove()
  logRemove() {
    console.log('after remove', this.id);
  }
}
