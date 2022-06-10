import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        fakeUsersService = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
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
        fakeUsersService.find = () => Promise.resolve(
            [
                {
                    id: 1,
                    email: 'a',
                    password: '1'
                } as User
            ]
        );
        try {
            await service.register('asdf@asdf.com', 'asdf');
        } catch (error) {
            expect(error.message).toEqual('Email in use');
        }
    })
});