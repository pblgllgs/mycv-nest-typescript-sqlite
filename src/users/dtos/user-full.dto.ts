import { Expose } from "class-transformer";

export class UserFullDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    password: string;
}