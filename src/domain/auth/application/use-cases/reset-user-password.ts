import { UserRepository } from '../repositories/user-repository'
import { UserTokenRepository } from '../repositories/user-token-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { User } from '../../enterprise/entities/user'

interface ResetUserPasswordUseCaseRequest {
  token: string
  password: string
}

type ResetUserPasswordUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    user: User
  }
>

export class ResetUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userTokenRepository: UserTokenRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    token,
    password,
  }: ResetUserPasswordUseCaseRequest): Promise<ResetUserPasswordUseCaseResponse> {
    const userToken = await this.userTokenRepository.findByToken(token)

    if (!userToken) {
      return left(
        new ResourceNotFoundError('User', {
          label: 'token',
          value: token,
        }),
      )
    }

    const user = await this.userRepository.findById(userToken.userId)

    if (!user) {
      return left(
        new ResourceNotFoundError('User', {
          label: 'id',
          value: userToken.userId,
        }),
      )
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    user.password = hashedPassword

    await this.userRepository.save(user)
    await this.userTokenRepository.delete(userToken)

    return right({
      user,
    })
  }
}
