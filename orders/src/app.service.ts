import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { randomUUID } from 'node:crypto';
import { OrderCreatedEvent, ORDER_CREATED_TOPIC } from '@app/kafka';

@Injectable()
export class AppService {
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafka: ClientKafka,
  ) {}

  getOrder() {
    return {
      id: randomUUID(),
      userId: 'user-123',
      amount: 100,
      currency: 'USD',
    };
  }

  createOrder() {
    // This should come from outside
    const order = this.getOrder();

    // creating an order...

    // and this must be moved somewhere in a separate module
    // and only call the method of the service
    const event: OrderCreatedEvent = {
      eventId: randomUUID(),
      eventType: ORDER_CREATED_TOPIC,
      occurredAt: new Date().toISOString(),

      data: {
        orderId: order.id,
        userId: order.userId,
        amount: order.amount,
        currency: order.currency,
      },
    };

    this.kafka.emit(ORDER_CREATED_TOPIC, event);

    return order;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
