import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class UserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  user: User;

  @OneToOne(() => Dictionary, (word) => word.word)
  word: string;

  @CreateDateColumn({ nullable: true })
  added: Date;
}
