import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeUser } from '@/test/factories/make-user'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { User } from '../../enterprise/entities/user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  let mockUser: User

  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      fakeHasher,
      fakeEncrypter,
    )

    mockUser = makeUser({
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUserRepository.items.push(mockUser)
  })

  it('should be able to authenticate a user', async () => {
    const result = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    })
  })

  it('should return invalid credentials error when email was not found', async () => {
    const result = await sut.execute({
      email: mockUser.email + '.br',
      password: '123456',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })

  it('should return invalid credentials error when password is wrong', async () => {
    const result = await sut.execute({
      email: mockUser.email,
      password: '123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidCredentialsError)
  })
})
