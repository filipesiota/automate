import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface OwnerProps {
  name: string
}

export class Owner extends Entity<OwnerProps> {
  get name() {
    return this.props.name
  }

  static create(props: OwnerProps, id?: UniqueEntityId) {
    const owner = new Owner(props, id)

    return owner
  }
}
