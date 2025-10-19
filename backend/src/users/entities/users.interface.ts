import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserPayload {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(4)
  password!: string;
}
