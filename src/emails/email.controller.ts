import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import ServerResponse from './ServerResponse';

@Controller('email')
export class EmailController {

  constructor(private readonly itemService: EmailService) {
  }

  @Post('/emails')
  async emailArrayValidator(@Body('emails') emails: string[]): Promise<ServerResponse[]> {
     return await this.itemService.verifyEmails(emails);
  }

  @Post()
  async emailValidator(@Body('email') email: string): Promise<ServerResponse> {
    return await this.itemService.verifyEmail(email);
  }
}
