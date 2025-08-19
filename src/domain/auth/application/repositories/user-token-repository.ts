import { UserToken } from '../../enterprise/entities/user-token'

export interface UserTokenRepository {
  findByToken(token: string): Promise<UserToken | null>
  create(token: UserToken): Promise<void>
}
