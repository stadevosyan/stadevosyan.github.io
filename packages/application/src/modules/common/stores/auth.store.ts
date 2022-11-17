import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { Storage } from '../utils/storage';
import { ELibraryApi, LoginUserDto, UserEntity } from '../api/e-library.client';

export const AUTHENTICATED_USER_KEY = 'AuthenticatedUser';

@injectable()
export class AuthStore {
    @observable user?: UserEntity;

    @computed get isAuthenticated() {
        return !!this.user;
    }

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);

        this.setAlreadyAuthenticatedUser();
    }

    async login(user: LoginUserDto) {
        // TODO: when backend implements return user data, will need to overwrite it
        const response = await this.api.authController_signInUser(user);
        console.log({ response });

        // TODO: might use this usersController_getUserById

        const userEntity = {
            ...user,
        } as UserEntity;

        Storage.setItem(AUTHENTICATED_USER_KEY, userEntity);

        runInAction(() => {
            this.user = userEntity;
        });
    }

    @action logout() {
        Storage.removeItem(AUTHENTICATED_USER_KEY);
        this.user = undefined;
    }

    @action setAlreadyAuthenticatedUser() {
        const userFromStorage = Storage.getItem(AUTHENTICATED_USER_KEY);
        if (userFromStorage) {
            this.user = userFromStorage;
        }
    }
}
