export class UserDto {
    id: number;
    email: string;
    username: string;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.username = user.username;
    }
}
