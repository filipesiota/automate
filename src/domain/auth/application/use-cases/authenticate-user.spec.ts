import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { FakeHasher } from '@/test/cryptography/fake-hasher'
import { makeUser } from '@/test/factories/make-user'
import { FakeEncrypter } from '@/test/cryptography/fake-encrypter'
import { AuthenticateUserUseCase } from './authenticate-user'
import { User } from '../../enterprise/entities/user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { InMemoryUserTokenRepository } from '@/test/repositories/in-memory-user-token-repository'
import { DayjsDateCalculator } from '@/infra/utils/dayjs-date-calculator'
import { UserTokenTypeEnum } from '../../enterprise/entities/user-token'
import { TimeUnit } from '@/core/utils/date-calculator'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryUserTokenRepository: InMemoryUserTokenRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let dateCalculator: DayjsDateCalculator
let sut: AuthenticateUserUseCase

describe('Authenticate User', () => {
  let mockUser: User

  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository()
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    dateCalculator = new DayjsDateCalculator()
    sut = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      inMemoryUserTokenRepository,
      fakeHasher,
      fakeEncrypter,
      dateCalculator,
    )

    mockUser = makeUser({
      password: await fakeHasher.hash('123456'),
    })

    inMemoryUserRepository.items.push(mockUser)
  })

  it('should be able to authenticate a user', async () => {
    vi.spyOn(dateCalculator, 'add')

    const result = await sut.execute({
      email: mockUser.email,
      password: '123456',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.objectContaining({
        props: expect.objectContaining({
          token: expect.any(String),
          type: UserTokenTypeEnum.REFRESH_TOKEN,
          expiresAt: expect.any(Date),
        }),
      }),
    })

    expect(dateCalculator.add).toHaveBeenCalledExactlyOnceWith(
      expect.any(Date),
      30,
      TimeUnit.Day,
    )
    expect(inMemoryUserTokenRepository.items[0]).toMatchObject({
      props: expect.objectContaining({
        token: expect.any(String),
        type: UserTokenTypeEnum.REFRESH_TOKEN,
        expiresAt: expect.any(Date),
      }),
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
