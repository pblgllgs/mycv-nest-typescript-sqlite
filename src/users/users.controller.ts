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
    Session,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService, private authService:AuthService) { }

    // @Get('/whoami')
    // whoami(@Session() session:any) {
    //     return this.usersService.findOne(session.userId);
    // }

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoami(@CurrentUser() user:User) {
        return user;
    }

    @Post('/signout')
    sugnout(@Session() session) {
        session.userId = null;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.register(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.login(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.usersService.find(email);
    }

    @Get('/all')
    findAll() {
        return this.usersService.findAll();
    }

    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
        const user = await this.usersService.findOne(parseInt(id));
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }  

    @Patch(':id')
    updateUser(@Param('id') id: string, @Body() user: UpdateUserDto) {
        return this.usersService.updateUser(parseInt(id), user);
    }

    @Delete(':id')
    remoneUser(@Param('id') id: string) {
        return this.usersService.remove(parseInt(id));
    }

    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session:any){
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session:any){
    //     return session.color;
    // }

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

    // @Serialize(UserFullDto)
    // @Get('/admin/all')
    // findAllAdmin() {
    //     return this.usersService.findAll();
    // }

}
