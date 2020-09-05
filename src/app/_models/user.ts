import { Roles } from './roles';
import { Topic } from './topic.model';

export class User {
    uid?: string;
    email: string;
    roles: Roles;
    topics?: Array<Topic>;
}