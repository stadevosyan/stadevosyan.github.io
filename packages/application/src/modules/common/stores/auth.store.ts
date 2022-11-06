import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { AuthApi, LoginRequest, User } from '../api/auth.api';
import { Storage } from '../utils/storage';

export const AUTHENTICATED_USER_KEY = 'AuthenticatedUser';

@injectable()
export class AuthStore {
    @observable user?: User;

    @computed get isAuthenticated() {
        return !!this.user;
    }

    constructor(@inject(AuthApi) private readonly authApi: AuthApi) {
        makeObservable(this);

        this.setAlreadyAuthenticatedUser();
    }

    async login(request: LoginRequest) {
        try {
            const user = (await this.authApi.login(request)).data;

            runInAction(() => {
                this.user = user;
            });
        } catch {
            runInAction(() => {
                this.user = undefined;
            });
        }
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
