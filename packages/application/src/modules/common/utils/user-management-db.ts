import cloneDeep from 'lodash/cloneDeep';

import { getRandomId } from './get-random-id';
import { UserEntity, UserEntityRole } from '../api/e-library.client';

export const John = {
    id: 1,
    name: 'john',
    email: 'sdfsa@jkhk.com',
    password: 'test',
    role: UserEntityRole.Admin,
} as UserEntity;

export const Mike = {
    id: 2,
    name: 'mike',
    email: 'sdfsa@jkhk.com',
    password: 'test',
    role: UserEntityRole.Admin,
} as UserEntity;

export const Sam = {
    id: 3,
    name: 'sam',
    email: 'sdfsa@jkhk.com',
    password: 'test',
    role: UserEntityRole.User,
} as UserEntity;

class UserManagementDB {
    private readonly users: UserEntity[];

    constructor() {
        this.users = [John, Mike, Sam];
    }

    getAll() {
        return cloneDeep(this.users);
    }

    getByLogin(email: string) {
        return cloneDeep(this.users.find(user => user.email === email));
    }

    create(data: UserEntity) {
        const user = {
            ...data,
            id: getRandomId(),
        } as UserEntity;

        this.users.push(user);

        return cloneDeep(user);
    }

    update(id: number, changes: Partial<UserEntity>) {
        const user = this.getById(id);

        if (user) {
            return cloneDeep(Object.assign(user, changes));
        }
    }

    delete(id: number) {
        const user = this.getById(id);

        if (user) {
            this.users.splice(this.users.indexOf(user), 1);
            return cloneDeep(user);
        }
    }

    private getById(id: number) {
        return this.users.find(user => user.id === id);
    }
}

const instance = new UserManagementDB();

export { instance as UserManagementDB };
