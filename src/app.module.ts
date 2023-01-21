import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UsersModule } from './api/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { AuthModule } from './api/auth/auth.module';
import { FileService } from './services/file/file.service';
import { PostsModule } from './api/posts/posts.module';
import { CommentsModule } from './api/comments/comments.module';
import { SendgridService } from './sendgrid/sendgrid.service';
import { MailController } from './mail/mail.controller';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db.uri'),
        user: process.env.DB_USER,
        pass: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, MailController],
  providers: [AppService, FileService, SendgridService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/auth/signin', method: RequestMethod.POST },
        { path: 'api/auth/signup', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
