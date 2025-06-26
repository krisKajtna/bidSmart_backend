import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationService {
    async notifyWinner(email: string, auctionTitle: string) {
        // Tu bi sicer integriral pravi email/SMS sistem
        console.log(`📢 Notification sent to ${email}: You won the auction "${auctionTitle}"!`);
    }
}
