import { ResourceIdentifier } from '../types/resource-identifier'

export class ResourceAlreadyExistsError extends Error {
  resource: string
  identifier: ResourceIdentifier

  constructor(resource: string, identifier: ResourceIdentifier) {
    super(
      `Resource '${resource}' already exists with ${identifier.label}: '${identifier.value}'.`,
    )

    this.resource = resource
    this.identifier = identifier
  }
}
