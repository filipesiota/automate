import { DomainEvent } from './domain-event'

type EventConstructor<T extends DomainEvent = DomainEvent> = {
  new (...args: unknown[]): T
}

export class DomainEventRegistry {
  private static map = new Map<string, EventConstructor>()

  static register<T extends DomainEvent>(
    eventName: string,
    constructor: EventConstructor<T>,
  ) {
    this.map.set(eventName, constructor)
  }

  static create<T extends DomainEvent>(
    eventName: string,
    ...args: ConstructorParameters<EventConstructor<T>>
  ): T {
    const Constructor = this.map.get(eventName) as
      | EventConstructor<T>
      | undefined

    if (!Constructor) {
      throw new Error(`No event registered for ${eventName}`)
    }

    return new Constructor(...args)
  }
}
