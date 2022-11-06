import { injectable } from '@servicetitan/react-ioc';

import { AxiosPromise } from 'axios';

import { UserManagementDB } from '../utils/user-management-db';

@injectable()
export class AuthApi {
    login({ login, password }: LoginRequest): AxiosPromise<User> {
        const user = UserManagementDB.getByLogin(login);

        if (user && user.password === password) {
            return this.resolve(user);
        }

        return this.reject();
    }

    register(data: User): AxiosPromise<User> {
        const user = UserManagementDB.create(data);

        return this.resolve(user);
    }

    // requests password reset for the email, backend generates email with redirect url, having some validation key and the email
    passwordResetRequest(email: string): AxiosPromise<boolean> {
        return this.resolve(!!email);
    }

    passwordReset(email: string, validationKey: string, newPassword: string) {
        return this.resolve(email + validationKey + newPassword);
    }

    private resolve<T = void>(data?: T) {
        return Promise.resolve({
            data,
        }) as AxiosPromise<T>;
    }

    private reject() {
        return Promise.reject({
            code: '500',
        });
    }
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface User {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
}

export enum UserRole {
    Student = 'Student',
    Admin = 'Admin',
}
