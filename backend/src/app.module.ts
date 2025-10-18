import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaModule } from 'nestjs-prisma';
import config from 'src/common/configs/config';
import { LocalStrategy } from './auth/jwt.strategy';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { TodosModule } from './todos/todos.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: async () => ({
        secret: 'secret',
        signOptions: { expiresIn: '3600s' },
      }),
    }),
    AuthModule,
    TodosModule,
    UsersModule,
  ],
  controllers: [],
  providers: [PrismaService, LocalStrategy],
})
export class AppModule {}
