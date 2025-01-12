import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async saveResetToken(
    userId: string,
    resetToken: string,
    expiryDate: Date,
  ): Promise<void> {
    const user = await this.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    user.resetToken = resetToken;
    user.resetTokenExpiry = expiryDate;

    await this.save(user);
  }
}
