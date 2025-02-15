import { Auth } from 'src/auth/auth.entities';
import { BuyerProfile } from 'src/buyer-profile/buyer-profile.entity';
import { SellerProfile } from 'src/seller-profile/seller-profile.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';


export enum UserRole {
  BUYER = 'buyer',
  SELLER = 'seller',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Auth, (auth) => auth.user)
  auth: Auth;

  @OneToOne(() => BuyerProfile, (buyerProfile) => buyerProfile.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  buyerProfile?: BuyerProfile;

  @OneToOne(() => SellerProfile, (sellerProfile) => sellerProfile.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  sellerProfile?: SellerProfile;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.BUYER, 
  })
  role: UserRole;

  @Column({ nullable: true })
  resetToken: string;

  @Column({ type: 'timestamp', nullable: true })
  resetTokenExpiry: Date;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
