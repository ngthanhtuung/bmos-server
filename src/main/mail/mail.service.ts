import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';

@Injectable()
export class MailService {
    constructor(
        private readonly configService: ConfigService
    ) {
    }

    async getConnection(): Promise<any | undefined> {
        const mailgunKey = this.configService.get<string>('MAILGUN_API_PRIVATE_KEY');
        const mailGunBaseUrl = this.configService.get<string>('MAILGUN_API_BASE_URL');
        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({ username: 'api', key: mailgunKey });
        return mg;
    }

    async sendEmail(toUser: string, subject: string, html?: string): Promise<any | undefined> {
        try {
            const mg = await this.getConnection();
            const data = {
                from: "Bird Meal Order System <tungnt16092001@gmail.com>",
                to: [toUser],
                subject: subject,
                html: html
            }
            const response = await mg.messages.create(this.configService.get<string>('MAILGUN_API_BASE_URL'), data);
            return response;
        } catch (err) {
            console.log(err);
        }
    }
}



