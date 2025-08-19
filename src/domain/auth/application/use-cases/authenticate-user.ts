import { Either, left, right } from '@/core/either'
import { UserRepository } from '../repositories/user-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  InvalidCredentialsError,
  {
    accessToken: string
    refreshToken: string
  }
>

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
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

    const refreshToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
    })

    return right({
      accessToken,
      refreshToken,
    })
  }
}
