import { UniqueEntityId } from '../entities/unique-entity-id'

export abstract class DomainEvent {
  abstract ocurredAt: Date
  abstract getAggregateId(): UniqueEntityId
}

export abstract class AsyncDomainEvent extends DomainEvent {
  abstract eventName: string
}
