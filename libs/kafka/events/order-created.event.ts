export interface OrderCreatedEvent {
  eventId: string;
  eventType: 'order.created';
  occurredAt: string;

  data: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
  };
}