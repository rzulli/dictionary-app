import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  ManyToMany,
} from 'typeorm';

@Entity('dictionary')
export class Dictionary {
  @PrimaryColumn()
  word: string;
  @Column('jsonb', { nullable: true })
  wordMetadata?: object[];
}
