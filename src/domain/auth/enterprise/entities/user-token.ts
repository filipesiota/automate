import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum UserTokenTypeEnum {
  REFRESH_TOKEN = 'refresh_token',
}

export interface UserTokenProps {
  userId: string
  type: UserTokenTypeEnum
  token: string
  createdAt: Date
  expiresAt: Date
}

export class UserToken extends Entity<UserTokenProps> {
  get userId() {
    return this.props.userId
  }

  get token() {
    return this.props.token
  }

  get createdAt() {
    return this.props.createdAt
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  static create(
    props: Optional<UserTokenProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const userToken = new UserToken(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return userToken
  }
}
