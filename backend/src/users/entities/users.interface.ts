import { IsEmail, Length } from 'class-validator';

export class CreateUserPayload {
  @IsEmail()
  email!: string;

  @Length(4)
  password!: string;
}
