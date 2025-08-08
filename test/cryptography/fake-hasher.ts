import { HashComparer } from '@/domain/authentication/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/authentication/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const plainHashed = await this.hash(plain)
    return plainHashed === hash
  }
}
