import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { OrderCreatedConsumer } from './order-create.consumer';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'notification-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'notification-service',
          },
        },
      },
    ]),
  ],
  controllers: [AppController, OrderCreatedConsumer],
  providers: [AppService],
})
export class AppModule {}
