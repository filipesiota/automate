import { UserTokenRepository } from '@/domain/auth/application/repositories/user-token-repository'
import { UserToken } from '@/domain/auth/enterprise/entities/user-token'

export class InMemoryUserTokenRepository implements UserTokenRepository {
  public items: UserToken[] = []

  async findByToken(token: string): Promise<UserToken | null> {
    const userToken = this.items.find((item) => item.token === token)

    if (!userToken) {
      return null
    }

    return userToken
  }

  async create(userToken: UserToken): Promise<void> {
    this.items.push(userToken)
  }

  async delete(userToken: UserToken): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === userToken.id.toString(),
    )

    this.items.splice(itemIndex, 1)
  }
}
