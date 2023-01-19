import { Module } from '@nestjs/common';
import { PostService } from './posts.service';
import { PostController } from './posts.controller';
import { PostsSchema } from './models/post.model';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/services/file/file.service';
import { AllergiesFileModule } from '../allergies-file/allergies-file.module';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Post', schema: PostsSchema }]),
    PostsModule,
    UsersModule,
    AuthModule,
    AllergiesFileModule,
  ],
  controllers: [PostController],
  providers: [PostService, FileService, UsersService],
  exports: [PostService, MongooseModule, FileService],
})
export class PostsModule {}
