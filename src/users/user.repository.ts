import { Repository } from 'typeorm';
import { User } from './users.entity';

export class UserRepository extends Repository<User> {}
