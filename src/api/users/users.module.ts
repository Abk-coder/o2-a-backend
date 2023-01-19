import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSchema } from './models/user.modele';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/services/file/file.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UsersModule,
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, FileService],
  exports: [UsersService, MongooseModule, FileService],
})
export class UsersModule {}
