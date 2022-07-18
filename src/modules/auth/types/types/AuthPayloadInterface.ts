import type { RoleType } from '../../../../constants';

export interface IAuthPayload {
  readonly email: string;
  readonly id: string;
  readonly role: RoleType;
}
