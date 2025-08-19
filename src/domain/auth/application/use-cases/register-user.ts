import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { InvalidPasswordConfirmationError } from './errors/invalid-password-confirmation-error'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

type RegisterUserUseCaseResponse = Either<
  UserAlreadyExistsError | InvalidPasswordConfirmationError,
  {
    user: User
  }
>

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    email,
    password,
    passwordConfirmation,
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    if (password !== passwordConfirmation) {
      return left(new InvalidPasswordConfirmationError())
    }

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError(email))
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.userRepository.create(user)

    return right({
      user,
    })
  }
}
