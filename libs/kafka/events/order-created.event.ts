import { KafkaTopic } from '../kafka.constants';

export interface OrderCreatedEvent {
  eventId: string;
  eventType: KafkaTopic;
  occurredAt: string;

  data: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
  };
}