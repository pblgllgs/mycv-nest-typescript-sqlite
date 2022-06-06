import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService, private authService:AuthService) { }

    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authService.register(body.email, body.password);
    }

    @Post('/signin')
    signin(@Body() body: CreateUserDto) {
        return this.authService.login(body.email, body.password);
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Get('/all')
    findAll() {
        return this.usersService.findAll();
    }

    // @Serialize(UserFullDto)
    // @Get('/admin/all')
    // findAllAdmin() {
    //     return this.usersService.findAll();
    // }

    @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    // @Serialize(UserFullDto)
    // @Get('/admin/:id')
    // async findUserAdmin(@Param('id') id: string) {
    //     console.log('handler is running');
    //     const user = await this.usersService.findOne(parseInt(id));
    //     if (!user) {
    //         throw new NotFoundException('User not found');
    //     }
    //     return user;
    // }

    @Serialize(UserDto)
    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
        return this.usersService.updateUser(parseInt(id), user);
    }

    @Serialize(UserDto)
    @Delete(':id')
    remoneUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

}
