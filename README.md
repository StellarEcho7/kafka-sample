# Kafka Sample — Event-Driven Microservices with NestJS & Apache Kafka

A reference implementation of an event-driven architecture using **NestJS** and **Apache Kafka**. Demonstrates a producer-consumer pattern with fan-out, shared event contracts, and a clean monorepo structure.

## Architecture

```
┌─────────────────┐
│  POST /orders   │
│  (HTTP :3000)   │
└────────┬────────┘
         │  emit('order.created')
         ▼
   ┌───────────┐
   │   Kafka   │
   │  Broker   │
   │ :9092     │
   └─────┬─────┘
         │
    ┌────┴────────────────────┐
    │                         │
    ▼                         ▼
┌──────────────────┐  ┌──────────────────┐
│  notification-   │  │  analytics-      │
│  worker :3001    │  │  worker :3002    │
│  (Consumer)      │  │  (Consumer)      │
└──────────────────┘  └──────────────────┘
```

A single `order.created` event published by the **orders** service is consumed independently by two separate worker services, each with its own consumer group — demonstrating a classic **fan-out** pattern.

## Services

| Service | Role | Kafka Identity | Port |
|---------|------|----------------|------|
| `orders` | Event producer | client: `order-service` | 3000 |
| `notification-worker` | Event consumer | client: `notification-service`, group: `notification-service` | 3001 |
| `analytics-worker` | Event consumer | client: `analytics-service`, group: `analytics-service` | 3002 |

### `orders` — Producer

Exposes an HTTP API. A `POST /` request creates an order, builds a typed `OrderCreatedEvent` envelope, and emits it to the `order.created` Kafka topic via `ClientKafka.emit()`.

### `notification-worker` — Consumer

Subscribes to the `order.created` topic as a Kafka microservice. Processes events through the `@EventPattern` decorator. Currently logs incoming events; designed as a placeholder for notification dispatch (email, push, SMS).

### `analytics-worker` — Consumer

Subscribes to the `order.created` topic with a **separate consumer group**, ensuring it receives every event independently from the notification worker. Designed as a placeholder for analytics processing and event aggregation.

## Shared Library

`libs/kafka` (`@app/kafka`) — a workspace package that provides:

- **Topic constants** — single source of truth for Kafka topic names
- **Event type definitions** — strongly typed event envelopes (`OrderCreatedEvent`)
- **Reusable Kafka module** — pre-configured `ClientsModule` registration

All services consume event types and topic constants from `@app/kafka`, ensuring consistency across producers and consumers.

## Event Contract

```typescript
type OrderCreatedEvent = {
  eventId: string;          // UUID — unique event identifier
  eventType: 'order.created';
  occurredAt: string;       // ISO 8601 timestamp
  data: {
    orderId: string;        // UUID — unique order identifier
    userId: string;
    amount: number;
    currency: string;
  };
};
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | NestJS 11 |
| Message Broker | Apache Kafka 4.0 (KRaft mode, no Zookeeper) |
| Kafka Client | KafkaJS 2.2 |
| Language | TypeScript 5.7 |
| Package Manager | npm workspaces (monorepo) |
| Containerization | Docker Compose |

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose

### 1. Start Kafka

```bash
docker compose up -d
```

This starts a single-node Kafka broker in KRaft mode on `localhost:9092`. No Zookeeper required.

### 2. Install dependencies

```bash
npm install
```

### 3. Start services

In separate terminals:

```bash
# Producer
cd orders && npm run start:dev

# Consumer 1
cd notification-worker && npm run start:dev

# Consumer 2
cd analytics-worker && npm run start:dev
```

### 4. Produce an event

```bash
curl -X POST http://localhost:3000
```

Both consumers will log the event with their respective prefixes:

```
[NOTIFICATION] Order created: <orderId>
[ANALYTICS] Order created: <orderId>
```

## Key Patterns

- **Event-driven decoupling** — services communicate through Kafka topics, not direct HTTP calls
- **Fan-out via consumer groups** — multiple consumers on the same topic with different `groupId` values each receive every event
- **Shared type contracts** — `@app/kafka` ensures producers and consumers agree on event structure at compile time
- **Microservice bootstrap** — consumers use `NestFactory.create()` + `app.connectMicroservice()` + `app.startAllMicroservices()` to run HTTP and Kafka transport simultaneously

## Project Structure

```
kafka-sample/
├── docker-compose.yml          # Kafka broker (KRaft)
├── package.json                # npm workspaces root
├── libs/
│   └── kafka/                  # @app/kafka — shared types & constants
├── orders/                     # Producer service
│   └── src/
│       ├── app.service.ts      # Business logic + Kafka emit
│       └── app.controller.ts   # HTTP endpoints
├── notification-worker/        # Consumer service
│   └── src/
│       ├── main.ts             # Microservice bootstrap
│       └── order-create.consumer.ts  # @EventPattern handler
└── analytics-worker/           # Consumer service
    └── src/
        ├── main.ts             # Microservice bootstrap
        └── order-create.consumer.ts  # @EventPattern handler
```

## License

UNLICENSED
