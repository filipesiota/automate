import { AsyncDomainEvent } from './domain-event'

export interface EventSubscriber {
  subscribe<T extends AsyncDomainEvent>(
    eventName: string,
    handler: (event: T) => Promise<void>,
  ): Promise<void>
}
