import { UserToken } from '../../enterprise/entities/user-token'

export interface UserTokenRepository {
  findByToken(token: string): Promise<UserToken | null>
  create(userToken: UserToken): Promise<void>
  delete(userToken: UserToken): Promise<void>
}
