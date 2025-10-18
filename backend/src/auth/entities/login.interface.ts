import { IsEmail, Length } from 'class-validator';

export class User {
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt?: Date;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export class ProfileResponse {
  email!: string;

  constructor(email: string) {
    this.email = email;
  }
}

export class RegisterPayload {
  @IsEmail()
  email!: string;

  @Length(4)
  password!: string;

  @Length(4)
  confirmPassword!: string;
}

export class RegisterResponse {
  access_token!: string;
  user!: Omit<User, 'password'>;

  constructor(access_token: string, user: Omit<User, 'password'>) {
    this.access_token = access_token;
    this.user = user;
  }
}

export class LoginPayload {
  @IsEmail()
  email!: string;

  @Length(4)
  password!: string;
}

export class LoginResponse {
  access_token!: string;
  user!: Omit<User, 'password'>;

  constructor(access_token: string, user: Omit<User, 'password'>) {
    this.access_token = access_token;
    this.user = user;
  }
}
