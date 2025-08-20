import { AsyncDomainEvent } from './domain-event'

export interface EventPublisher {
  publish(event: AsyncDomainEvent): Promise<void>
}
