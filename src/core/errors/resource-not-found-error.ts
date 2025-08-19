import { ResourceIdentifier } from '../types/resource-identifier'

export class ResourceNotFoundError extends Error {
  resource: string
  identifier: ResourceIdentifier

  constructor(resource: string, identifier: ResourceIdentifier) {
    super(
      `Resource '${resource}' not found with ${identifier.label}: '${identifier.value}'.`,
    )

    this.resource = resource
    this.identifier = identifier
  }
}
