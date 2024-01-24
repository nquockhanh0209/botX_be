import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, Reflector } from "@nestjs/core";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RedisModule } from "@svtslv/nestjs-ioredis";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MessageComponent } from "./components/message.component";
import RedisComponent from "./components/redis.component";
import appConfig from "./configs/app.config";
import databaseConfig from "./configs/database.config";
import { DatabaseModule } from "./database/database.module";
import { AllExceptionFilter } from "./filter/exception.filter";
import { LoggerModule } from "./logger/logger.module";
import { GlobalMiddleware } from "./middleware/global.middleware";

import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ServiceModule } from './modules/service/service.module';
import { CartModule } from './modules/cart/cart.module';
import { UserFavouriteModule } from './modules/user-favourite/user-favourite.module';
import { OrderHistoryModule } from './modules/order-history/order-history.module';
import { RabbitMQ } from "./modules/rabbitmq/rabbitmq.module";
import { NotiModule } from './modules/noti/noti.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { WithdrawnModule } from './modules/withdrawn/withdrawn.module';
import { CsvService } from "./modules/csv/csv.service";
import { CurrencyModule } from './modules/currency/currency.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
    }),
    ScheduleModule.forRoot(),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        console.log("Debug", configService.get("redisUri"));
        return {
          config: {
            url: configService.get("redisUri"),
          },
        };
      },
      inject: [ConfigService],
    }),

    LoggerModule,
    DatabaseModule,
    UserModule,
    AuthModule,
    ServiceModule,
    CartModule,
    UserFavouriteModule,
    OrderHistoryModule,
    RabbitMQ,
    NotiModule,
    PaymentModule,
    AffiliateModule,
    WithdrawnModule,
    CurrencyModule,
    CategoryModule,
    
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    MessageComponent,
    Reflector,
    RedisComponent,
    CsvService,
  ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(GlobalMiddleware).forRoutes('*');
    }
  }
