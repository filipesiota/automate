import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { RegisterUserUseCase } from './register-user'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeUser } from '@/test/factories/make-user'
import { ResourceAlreadyExistsError } from '@/core/errors/resource-already-exists-error'

let inMemoryUserRepository: InMemoryUserRepository
let fakeHasher: FakeHasher
let sut: RegisterUserUseCase

describe('Register User', () => {
  const mockUser = makeUser()

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterUserUseCase(inMemoryUserRepository, fakeHasher)
  })

  it('should be able to register a new user', async () => {
    const result = await sut.execute({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      user: inMemoryUserRepository.items[0],
    })
  })

  it('should hash password upon registration', async () => {
    const result = await sut.execute({
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    })

    const hashedPassword = await fakeHasher.hash(mockUser.password)

    expect(result.isRight()).toBe(true)
    expect(inMemoryUserRepository.items[0].password).toBe(hashedPassword)
  })

  it('should return resource already exists error when provided email is in use by another user', async () => {
    const existentUser = makeUser()

    inMemoryUserRepository.items.push(existentUser)

    const result = await sut.execute({
      name: mockUser.name,
      email: existentUser.email,
      password: mockUser.password,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
