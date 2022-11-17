import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { Storage } from '../utils/storage';
import { ELibraryApi, LoginUserDto, UserEntity } from '../api/e-library.client';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const AUTHENTICATED_USER_KEY = 'AuthenticatedUser';
export const AUTHENTICATED_USER_TOKEN = 'AuthToken';

@injectable()
export class AuthStore {
    @observable user?: UserEntity;

    @computed get isAuthenticated() {
        return !!this.user;
    }

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);

        this.setAlreadyAuthenticatedUser();
        this.handle401();
    }

    login = async (user: LoginUserDto) => {
        const { data } = await this.api.authController_signInUser(user);
        const token = data.access_token;

        // TODO: might use this usersController_getUserById
        const userEntity = {
            ...user,
        } as UserEntity;

        Storage.setItem(AUTHENTICATED_USER_KEY, userEntity);
        Storage.setItem(AUTHENTICATED_USER_TOKEN, token);
        this.setupOrResetToken(token);

        runInAction(() => {
            this.user = userEntity;
        });
    };

    @action logout = () => {
        Storage.removeItem(AUTHENTICATED_USER_KEY);
        Storage.removeItem(AUTHENTICATED_USER_TOKEN);
        this.setupOrResetToken();
        this.user = undefined;
    };

    @action setAlreadyAuthenticatedUser = () => {
        const authToken = Storage.getItem(AUTHENTICATED_USER_TOKEN);
        if (authToken) {
            this.setupOrResetToken(authToken);
            this.user = Storage.getItem(AUTHENTICATED_USER_KEY);
        }
    };

    setupOrResetToken = (token?: string) => {
        axios.interceptors.request.use((params: AxiosRequestConfig) => {
            if (params.headers) {
                if (token) {
                    params.headers.Authorization = `Bearer ${token}`;
                } else {
                    params.headers.Authorization = '';
                }
            }

            return params;
        });
    };

    handle401 = () => {
        axios.interceptors.response.use((params: AxiosResponse) => {
            if (params.status === 401) {
                if (this.isAuthenticated) {
                    this.logout();
                }
            }
            return params;
        });
    };
}
