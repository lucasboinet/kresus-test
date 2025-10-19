import { IsEmail, IsString, Length } from 'class-validator';

export class User {
  firstName!: string;
  lastName!: string;
  email!: string;
  password!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export class ProfileResponse {
  firstName!: string;
  lastName!: string;
  email!: string;

  constructor(firstName: string, lastName: string, email: string) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

export class RegisterPayload {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Length(4)
  password!: string;

  @IsString()
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

  @IsString()
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
