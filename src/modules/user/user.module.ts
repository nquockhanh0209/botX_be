import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import RedisComponent from 'src/components/redis.component';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { MessageComponent } from 'src/components/message.component';
import { User } from 'src/entities/User';
import { CsvService } from '../csv/csv.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService,RedisComponent,MessageComponent,CsvService],
  exports: [UserService]
})
export class UserModule {}
