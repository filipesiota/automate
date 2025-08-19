import { Either, left, right } from '@/core/either'
import { UserRepository } from '../repositories/user-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { Encrypter } from '../cryptography/encrypter'
import { UserTokenRepository } from '../repositories/user-token-repository'
import {
  UserToken,
  UserTokenTypeEnum,
} from '../../enterprise/entities/user-token'
import { DateCalculator, TimeUnit } from '@/core/utils/date-calculator'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
    refreshToken: UserToken
  }
>

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly dateCalculator: DateCalculator,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      return left(new InvalidCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!isPasswordValid) {
      return left(new InvalidCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    const refreshToken = UserToken.create({
      userId: user.id.toString(),
      type: UserTokenTypeEnum.REFRESH_TOKEN,
      token: await this.encrypter.encrypt({
        sub: user.id.toString(),
      }),
      expiresAt: this.dateCalculator.add(new Date(), 30, TimeUnit.Day),
    })

    await this.userTokenRepository.create(refreshToken)

    return right({
      accessToken,
      refreshToken,
    })
  }
}
