import { randomUUID } from 'node:crypto'

import { UserRepository } from '../repositories/user-repository'
import { UserTokenRepository } from '../repositories/user-token-repository'
import { DateCalculator, TimeUnit } from '@/core/utils/date-calculator'
import {
  UserToken,
  UserTokenTypeEnum,
} from '../../enterprise/entities/user-token'
import { DomainEvents } from '@/core/events/domain-events'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'

interface ForgetUserPasswordUseCaseRequest {
  email: string
}

type ForgetUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class ForgetUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly dateCalculator: DateCalculator,
  ) {}

  async execute({
    email,
  }: ForgetUserPasswordUseCaseRequest): Promise<ForgetUserPasswordUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(
        new ResourceNotFoundError('User', {
          label: 'email',
          value: email,
        }),
      )
    }

    const passwordResetToken = UserToken.create({
      userId: user.id.toString(),
      type: UserTokenTypeEnum.PASSWORD_RESET,
      token: randomUUID(),
      expiresAt: this.dateCalculator.add(new Date(), 10, TimeUnit.Minute),
    })

    await this.userTokenRepository.create(passwordResetToken)

    user.forgotPassword(passwordResetToken.token)

    DomainEvents.dispatchEventsForAggregate(user.id)

    return right({
      user,
    })
  }
}
