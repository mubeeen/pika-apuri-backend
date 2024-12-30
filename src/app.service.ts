import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      // Check if the database is connected by executing a simple query
      await this.dataSource.query('SELECT 1');
      console.log('Database connected successfully!');
    } catch (error) {
      console.error('Database connection failed:', error);
      process.exit(1); // Exit the application with failure status
    }
  }

  getHello(): string {
    return 'Hello Mubeen App!';
  }
}
