import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailController } from './emails/email.controller';
import { EmailService } from './emails/email.service';

@Module({
  imports: [],
  controllers: [AppController, EmailController],
  providers: [AppService, EmailService],
})
export class AppModule {
}
