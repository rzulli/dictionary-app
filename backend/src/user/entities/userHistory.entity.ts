import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.history)
  user: User;

  @Column({ nullable: true })
  word: string;

  @CreateDateColumn({ nullable: true })
  added: Date;
}
