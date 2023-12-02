import * as yup from 'yup';
import { FollowingRelationshipSchemas } from './FollowingRelationship.schemas.js';
import { Entity, EntityValues } from '../../../core/entities/Entity/Entity.model.js';
import { PartialDeep } from 'type-fest';

export interface FollowingRelationshipValues {
  followerId: string
  followedId: string
}

export type FollowingRelationshipInstance = EntityValues & FollowingRelationshipValues;

export class FollowingRelationship extends Entity implements FollowingRelationshipInstance {
  followerId: string;
  followedId: string;

  static _updateValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    followerId: FollowingRelationshipSchemas.followerId,
    followedId: FollowingRelationshipSchemas.followedId,
  });

  static _createValueSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...FollowingRelationship._updateValueSchema.fields,
    followerId: FollowingRelationshipSchemas.followerId.required(),
    followedId: FollowingRelationshipSchemas.followedId.required(),
  });

  static _instanceSchema: yup.ObjectSchema<any> = yup.object().shape({
    ...Entity._instanceSchema.fields,
    ...FollowingRelationship._createValueSchema.fields,
  });

  constructor(params: PartialDeep<FollowingRelationshipInstance>) {
    super(params, FollowingRelationship._instanceSchema);
  }

  isValidUpdateValue(): boolean {
    return super._isValidValue(FollowingRelationship._updateValueSchema)
  }

  isValidCreateValue(): boolean {
    return super._isValidValue(FollowingRelationship._createValueSchema)
  }

  isValidInstance(): boolean {
    return super._isValidValue(FollowingRelationship._instanceSchema)
  }

  values<T = FollowingRelationshipValues>(): T {
    return super._values<T>(FollowingRelationship._createValueSchema);
  }

  instanceValues<T = FollowingRelationshipInstance>(): T {
    return super._values<T>(FollowingRelationship._instanceSchema);
  }
}