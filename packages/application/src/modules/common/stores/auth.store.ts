import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { AuthApi, LoginRequest, User } from '../api/auth.api';

@injectable()
export class AuthStore {
    @observable user?: User;

    /*
     * @observable user?: User = {
     *     id: 1,
     *     login: 'john',
     *     password: 'test',
     *     role: UserRole.Admin,
     * };
     */

    @computed
    get isAuthenticated() {
        return !!this.user;
    }

    constructor(@inject(AuthApi) private readonly authApi: AuthApi) {
        makeObservable(this);
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

    @action
    logout() {
        this.user = undefined;
    }
}
