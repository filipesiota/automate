import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AsyncDomainEvent } from '@/core/events/domain-event'
import { User } from '../entities/user'

export class UserCreatedEvent implements AsyncDomainEvent {
  public eventName: string = UserCreatedEvent.name
  public ocurredAt: Date
  public user: User

  constructor(user: User) {
    this.ocurredAt = new Date()
    this.user = user
  }

  getAggregateId(): UniqueEntityId {
    return this.user.id
  }
}
