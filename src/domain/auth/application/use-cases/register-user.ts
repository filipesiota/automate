import { Either, left, right } from '@/core/either'
import { User } from '../../enterprise/entities/user'
import { UserRepository } from '../repositories/user-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

interface RegisterUserUseCaseRequest {
  name: string
  email: string
  password: string
}

type RegisterUserUseCaseResponse = Either<
  ResourceAlreadyExistsError,
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
  }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      return left(
        new ResourceAlreadyExistsError('user', {
          label: 'email',
          value: email,
        }),
      )
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
