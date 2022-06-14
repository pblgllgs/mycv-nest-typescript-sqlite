import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = [];
        fakeUsersService = {
            find: (email: string) => {
                const filterUsers = users.filter(user => user.email === email);
                return Promise.resolve(filterUsers);
            },
            create: (email: string, password: string) => {
                const user = {
                    id: Math.floor(Math.random() * 999999),
                    email,
                    password,
                } as User
                users.push(user);
                return Promise.resolve(user);
            }
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('crear una instancia de authService', async () => {
        expect(service).toBeDefined();
    });
    it('crear un usuario con la contraseña ya lista', async () => {
        const user = await service.register('asdf@asdf.com', 'asdf');
        expect(user.password).not.toEqual('asdf');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });
    it('lanza un error si el email esta en uso por otro usuario', async () => {
        await service.register('asdf@asdf.com', 'asdf');
        try {
            await service.register('asdf@asdf.com', 'asdf');
        } catch (error) {
            expect(error.message).toEqual('Email in use');
        }
    })

    it('lanza un error si el login falla', async () => {
        try {
            await service.login('asd@asd.com', 'asdf');
        } catch (error) {
            expect(error.message).toEqual('User not found');
        }
    })

    it('lanza un error si el email dado es invalido ', async () => {
        await service.register('asdf@asdf.com', 'asdf');
        try {
            await service.login('asdf@asdf.com', 'password')
        } catch (error) {
            expect(error.message).toEqual('Invalid password');
        }
    })

    it('crea un usuario y lo devuelve', async () => {
        await service.register('asdf@asdf.com', 'mypassword');
        const user = await service.login('asdf@asdf.com', 'mypassword');
        expect(user).toBeDefined();
    })


});