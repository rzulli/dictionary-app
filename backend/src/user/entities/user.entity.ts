import { Dictionary } from 'src/dictionary/entities/dictionary.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserHistory } from './userHistory.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @ManyToMany(() => Dictionary, (dict) => dict.word)
  @JoinTable()
  favorites: Dictionary[];

  @OneToMany(() => UserHistory, (history) => history.user)
  history: UserHistory[];
}
