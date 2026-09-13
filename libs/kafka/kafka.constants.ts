export const ORDER_CREATED_TOPIC = 'order.created' as const;

export type KafkaTopic = typeof ORDER_CREATED_TOPIC;