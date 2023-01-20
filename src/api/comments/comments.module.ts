import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './models/comment.model';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    CommentsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, UsersService],
  exports: [UsersService, MongooseModule, CommentsService],

})
export class CommentsModule {}
