import { rm } from 'fs/promises';
import { join } from 'path';
import { Report } from '../src/reports/report.entity';
import { User } from '../src/users/user.entity';
import { DataSource } from 'typeorm';

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'));
    } catch (error) {
    }
})

global.afterEach( async ()=> {
})