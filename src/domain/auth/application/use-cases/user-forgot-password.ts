import { randomUUID } from 'node:crypto'

import { UserRepository } from '../repositories/user-repository'
import { UserTokenRepository } from '../repositories/user-token-repository'
import { DateCalculator, TimeUnit } from '@/core/utils/date-calculator'
import {
  UserToken,
  UserTokenTypeEnum,
} from '../../enterprise/entities/user-token'
import { DomainEvents } from '@/core/events/domain-events'

interface UserForgotPasswordUseCaseRequest {
  email: string
}

export class UserForgotPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly dateCalculator: DateCalculator,
  ) {}

  async execute({ email }: UserForgotPasswordUseCaseRequest): Promise<void> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return
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
  }
}
