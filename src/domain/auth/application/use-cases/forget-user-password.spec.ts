import { InMemoryUserRepository } from '@/test/repositories/in-memory-user-repository'
import { makeUser } from '@/test/factories/make-user'
import { User } from '../../enterprise/entities/user'
import { InMemoryUserTokenRepository } from '@/test/repositories/in-memory-user-token-repository'
import { DayjsDateCalculator } from '@/infra/utils/dayjs-date-calculator'
import { UserTokenTypeEnum } from '../../enterprise/entities/user-token'
import { TimeUnit } from '@/core/utils/date-calculator'
import { ForgetUserPasswordUseCase } from './forget-user-password'

let inMemoryUserRepository: InMemoryUserRepository
let inMemoryUserTokenRepository: InMemoryUserTokenRepository
let dateCalculator: DayjsDateCalculator
let sut: ForgetUserPasswordUseCase

describe('User Forgot Password', () => {
  let mockUser: User

  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository()
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository()
    dateCalculator = new DayjsDateCalculator()
    sut = new ForgetUserPasswordUseCase(
      inMemoryUserRepository,
      inMemoryUserTokenRepository,
      dateCalculator,
    )

    mockUser = makeUser()

    inMemoryUserRepository.items.push(mockUser)
  })

  it('should be able to start forget password process', async () => {
    vi.spyOn(dateCalculator, 'add')

    await sut.execute({
      email: mockUser.email,
    })

    expect(dateCalculator.add).toHaveBeenCalledExactlyOnceWith(
      expect.any(Date),
      10,
      TimeUnit.Minute,
    )
    expect(inMemoryUserTokenRepository.items[0]).toMatchObject({
      props: expect.objectContaining({
        token: expect.any(String),
        type: UserTokenTypeEnum.PASSWORD_RESET,
        expiresAt: expect.any(Date),
      }),
    })
  })
})
