import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import * as event from '@app/kafka';
import { ORDER_CREATED_TOPIC } from '@app/kafka';

@Controller()
export class OrderCreatedConsumer {
  private readonly logger = new Logger(OrderCreatedConsumer.name);

  @EventPattern(ORDER_CREATED_TOPIC)
  handleOrderCreated(@Payload() event: event.OrderCreatedEvent) {
    this.logger.log(`[ANALYTICS] Order created: ${event.data.orderId}`);

    // await this.analyticsService.sendOrderCreatedAnalytics(
    //   event.data.userId,
    //   event.data.orderId,
    // );
  }
}
