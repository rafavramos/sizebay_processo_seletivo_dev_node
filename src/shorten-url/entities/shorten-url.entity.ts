import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('shortened_urls')
export class ShortenUrl {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'original_url' })
  originalUrl: string;

  @Index({ unique: true })
  @Column({ name: 'short_code', length: 10 })
  shortCode: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'access_count', default: 0 })
  accessCount: number;
}
