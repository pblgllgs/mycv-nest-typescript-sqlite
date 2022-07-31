import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/user.entity';
import { Report } from '../reports/report.entity';


const dbConfig = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User, Report],
  synchronize: false,
  migrations: ['src/db/migrations/*.ts'],
} as DataSourceOptions);

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
    })
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;
  case 'production':
    break;
  default:
    throw new Error('unknown environment');
}

export default dbConfig;