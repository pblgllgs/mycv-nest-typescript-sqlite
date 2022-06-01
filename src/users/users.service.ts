import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private repo: Repository<User>) { }

    create(email: string, password: string) {
        const user = this.repo.create({ email, password });
        return this.repo.save(user);
    }

    find(email: string): Promise<User[]> {
        return this.repo.find({
            where: {
                email: email
            }
        });
    }

    findAll(): Promise<User[]> {
        return this.repo.find();
    }

    findOne(id: number): Promise<User> {
        return this.repo.findOne({
            where: {
                id: id
            }
        });
    }

    async updateUser(id: number, attrs: Partial<User>): Promise<User> {
        const user = await this.repo.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        Object.assign(user, attrs);
        return this.repo.save(user);
    }

    async deleteUser(id: number) {
        const user = await this.repo.findOne({
            where: {
                id: id
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return this.repo.remove(user);
    }
}