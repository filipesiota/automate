import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface CarProps {
  ownerId: UniqueEntityId
  brand: string
  model: string
  year: number
  licensePlate?: string | null
  renavan?: string | null
  createdAt: Date
  updatedAt?: Date | null
  deletedAt?: Date | null
}

export class Car extends Entity<CarProps> {}
