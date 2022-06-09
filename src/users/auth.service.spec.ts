import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe("AuthService", () => {
    let service: AuthService;

    beforeEach(async () => {
        //create a fake copy of userService
        const fakeUserService: Partial<UsersService> = {
            find: () => Promise.resolve([]),
            create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User)
        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUserService
                }
            ]
        }).compile();
        service = module.get(AuthService);
    });

    it('crear una instancia de authservice', async () => {

        expect(service).toBeDefined();
    });
});