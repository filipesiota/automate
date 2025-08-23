import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { UserCreatedEvent } from '../events/user-created-event'
import { VerifyUserEmailEvent } from '../events/verify-user-email-event'
import { ForgetUserPasswordEvent } from '../events/user-forgot-password-event'

export interface UserProps {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export class User extends AggregateRoot<UserProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  set password(password: string) {
    this.props.password = password
  }

  get password() {
    return this.props.password
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get deletedAt() {
    return this.props.deletedAt
  }

  forgotPassword(token: string) {
    this.addDomainEvent(new ForgetUserPasswordEvent(this, token))
  }

  verifyEmail(token: string) {
    this.addDomainEvent(new VerifyUserEmailEvent(this, token))
  }

  static create(
    props: Optional<UserProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityId,
  ) {
    const user = new User(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )

    const isNewUser = !id

    if (isNewUser) {
      user.addDomainEvent(new UserCreatedEvent(user))
    }

    return user
  }
}
