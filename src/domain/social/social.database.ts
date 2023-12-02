import { Paginated } from '../core/types/Paginated.js';
import {Result} from '../core/types/Result.js';
import {Operation} from '../operations/types.js';
import { FollowingRelationshipInstance, FollowingRelationshipValues } from './entities/FollowingRelationship/FollowingRelationship.model.js';

export abstract class SocialDatabase {
  // ----------- //
  // FOLLOWING RELATIONSHIP
  // ----------- //
  abstract findFollowingRelationship<T extends FollowingRelationshipInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<FollowingRelationshipInstance, undefined>>;
  abstract findFollowingRelationships<T extends FollowingRelationshipInstance>(filters: Partial<Record<keyof T, Operation>>): Promise<Result<FollowingRelationshipInstance[], undefined>>;
  abstract findFollowingRelationshipsPaginated<T extends FollowingRelationshipInstance>(filters: Partial<Record<keyof T, Operation>>, page: number, pageSize: number): Promise<Result<Paginated<FollowingRelationshipInstance>, undefined>>;
  abstract addFollowingRelationship<T extends FollowingRelationshipInstance, K extends FollowingRelationshipValues>(instance: Partial<T> & K): Promise<Result<FollowingRelationshipInstance, undefined>>
  abstract removeFollowingRelationship<T extends FollowingRelationshipInstance>(criteria: Partial<Record<keyof T, Operation>>): Promise<Result<FollowingRelationshipInstance, undefined>>;
}
