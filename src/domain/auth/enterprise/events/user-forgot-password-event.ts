import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { User } from '../entities/user'

export class ForgetUserPasswordEvent implements DomainEvent {
  public ocurredAt: Date
  public user: User
  public token: string

  constructor(user: User, token: string) {
    this.ocurredAt = new Date()
    this.user = user
    this.token = token
  }

  getAggregateId(): UniqueEntityId {
    return this.user.id
  }
}
