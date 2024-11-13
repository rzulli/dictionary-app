import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity('dictionary')
export class Dictionary {
  @PrimaryColumn()
  word: string;
  @Column('jsonb', { nullable: true })
  wordMetadata?: object[];
}
