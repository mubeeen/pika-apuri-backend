import { User } from 'src/users/users.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
// import { Review } from 'src/reviews/review.entity'; // Assuming you have a separate Review entity

@Entity('buyer_profiles')
export class BuyerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.buyerProfile)
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

  @Column({ type: 'float', default: 0.0 })
  rating: number;

  //   @OneToMany(() => Review, (review) => review.buyer)
  //   reviews: Review[];

  @Column('text', { array: true, nullable: true })
  interests: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
