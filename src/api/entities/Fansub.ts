import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { User } from './User';

@Entity({ name: 'fansub' })
export class Fansub {

  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'date' })
  // tslint:disable-next-line: variable-name
  born: Date;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'text' })
  urls: string;

  @Column({ type: 'text', nullable: true })
  tags: string;

  @Column({ type: 'text', nullable: true })
  // tslint:disable-next-line: variable-name
  image_url: string;

  @Column({ type: 'int', default: 0 })
  // tslint:disable-next-line: variable-name
  view_count: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  created_at: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  // tslint:disable-next-line: variable-name
  updated_at: number;

  @ManyToOne(type => User)
  // tslint:disable-next-line: variable-name
  user_: User;
}
