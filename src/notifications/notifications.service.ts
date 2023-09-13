import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/entity/image.entity';
import { Notification } from 'src/entity/notification.entity';
import { User } from 'src/entity/user.entity';
import { sendMail } from 'src/helpers/emailSender.helper';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { emailLogger } from 'src/helpers/logger.helper';
import { MailDataT } from 'src/types/mail-data.type';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly mailerService: MailerService,
    @InjectRepository(Image)
    private readonly imagesRepository: Repository<Image>,
  ) {}

  async imageUploaded(image: Image) {
    try {
      await this.notificationRepository.save({
        type: 'image',
        user: image.user,
        message: '',
        meta: JSON.stringify({ imageId: image.id }),
      });
    } catch (err) {
      emailLogger.log({ level: 'error', message: err.message });
    }

    const emails = await this.usersRepository
      .createQueryBuilder('user')
      .select('user.email')
      .where('user.role = :role', { role: 'admin' })
      .getRawMany();
    emails.map(async (userEmail) => {
      const mailData: MailDataT = {
        email: userEmail,
        subject: 'Image Uploaded',
        template: 'image-uploaded',
        context: {
          displayName: image.user.displayName,
          imageId: image.id,
        },
        mailerService: this.mailerService,
      };
      if (await sendMail(mailData)) {
        return { status: 'Email sent.' };
      } else {
        return { status: 'Email not sent!' };
      }
    });
  }

    async imageApproved(imagesData: { id: number; isApproved: boolean }[]) {
      try {

    

        // const image = await this.imagesRepository
        //   .createQueryBuilder('images')
        //   .leftJoinAndSelect('images.users', 'users')
        //   .where('image = :id', { id  })
        //   .getOne();


        const user = await this.usersRepository
          .createQueryBuilder('user')
          .select('user.email')
          .where('user.id = :id', { id: image.user.id })
          .getOne();
        
       
        
        await this.notificationRepository.save({
          type: 'image',
          user: image.user,
          message: '',
          meta: JSON.stringify({ imageId: image.id }),
        });
      } catch (err) {
        emailLogger.log({ level: 'error', message: err.message });
      }

      if (
        await sendMail(
          user.email,
          'Image Approved',
          'image-approved',
          {
            name: image.user.displayName,
            image: image.id,
          },
          this.mailerService,
        )
      ) {
        return { status: 'Email sent.' };
      } else {
        return { status: 'Email not sent!' };
      }

    
    }
}
