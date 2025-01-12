import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('profile')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  address: { street: string; city: string; zip: string };

  @Column({ nullable: true })
  university: string;

  @Column({ type: 'text', array: true, nullable: true })
  skills: string[];

  @Column({ type: 'float', default: 0.0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
