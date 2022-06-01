import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private usersService:UsersService) {}

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        this.usersService.create(body.email, body.password);
    }

    @Get()
    findAllUsers(@Query('email')email:string) {
        return this.usersService.find(email);
    }

    @Get('/all')
    findAll() {
        return this.usersService.findAll();
    }

    @Get('/:id')
    findUser(@Param('id')id: string) {
        return this.usersService.findOne(parseInt(id));
    }

    @Put(':id')
    updateUser(@Param('id')id: number, @Body() user: CreateUserDto) {
        return this.usersService.updateUser(id, user);
    }

    @Delete(':id')
    deleteUser(@Param('id')id: number) {
        return this.usersService.deleteUser(id);
    }

}
