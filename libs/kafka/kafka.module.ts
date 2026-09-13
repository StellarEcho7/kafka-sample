import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_CLIENT',
        transport: Transport.KAFKA,

        options: {
          client: {
            clientId: 'transaction-api',
            brokers: ['localhost:9092'],
          },

          consumer: {
            groupId: 'transaction-api-consumer',
          },
        },
      },
    ]),
  ],

  exports: [ClientsModule],
})
export class KafkaModule {}