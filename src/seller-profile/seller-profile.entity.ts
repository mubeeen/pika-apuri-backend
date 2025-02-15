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
// import { Review } from 'src/reviews/review.entity'; // Assuming the Review entity is the same

@Entity('seller_profiles')
export class SellerProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, (user) => user.sellerProfile)
  @JoinColumn()
  user: User;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  address: { street: string; city: string; zip: string };

  @Column({ type: 'text', array: true, nullable: true })
  skills: string[];

  @Column({ type: 'float', default: 0.0 })
  rating: number;

  //   @OneToMany(() => Review, (review) => review.seller)
  //   reviews: Review[]; // Array of reviews from buyers

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
