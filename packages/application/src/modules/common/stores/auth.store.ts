import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { Storage } from '../utils/storage';
import { EditUserDto, ELibraryApi, LoginUserDto, UserEntity } from '../api/e-library.client';
import axios, { AxiosRequestConfig } from 'axios';

export const AUTHENTICATED_USER_KEY = 'AuthenticatedUser';
export const AUTHENTICATED_USER_TOKEN = 'AuthToken';

@injectable()
export class AuthStore {
    @observable user?: UserEntity;
    storedInterceptor?: number;

    @computed get isAuthenticated() {
        return !!this.user;
    }

    @computed get isAdmin() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.user?.role === 0;
    }

    @computed get isUser() {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return this.user?.role === 1;
    }

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);

        this.setAlreadyAuthenticatedUser();
        this.handle401();
    }

    updateUserData = async (updatedUserData: EditUserDto) => {
        const { data } = await this.api.usersController_editMyProfile(updatedUserData);
        if (data) {
            runInAction(() => (this.user = data));
            Storage.setItem(AUTHENTICATED_USER_KEY, data);
        }
    };

    login = async (user: LoginUserDto) => {
        let token;
        try {
            const { data: tokenData } = await this.api.authController_signInUser(user);
            token = tokenData.access_token;

            this.setupToken(token);
            const { data: userData } = await this.api.usersController_getMyProfile();
            runInAction(() => (this.user = userData));
            Storage.setItem(AUTHENTICATED_USER_TOKEN, token);
            Storage.setItem(AUTHENTICATED_USER_KEY, userData);
        } catch (e) {
            if (token) {
                this.resetToken();
                Storage.removeItem(AUTHENTICATED_USER_KEY);
                Storage.removeItem(AUTHENTICATED_USER_TOKEN);
            }
            throw e;
        }
    };

    @action logout = () => {
        Storage.removeItem(AUTHENTICATED_USER_KEY);
        Storage.removeItem(AUTHENTICATED_USER_TOKEN);
        this.resetToken();
        this.user = undefined;
    };

    @action setAlreadyAuthenticatedUser = () => {
        const authToken = Storage.getItem(AUTHENTICATED_USER_TOKEN);
        const user = Storage.getItem(AUTHENTICATED_USER_KEY);
        if (authToken && user) {
            this.setupToken(authToken);
            this.user = user;
        }
    };

    setupToken = (token: string) => {
        this.storedInterceptor = axios.interceptors.request.use((params: AxiosRequestConfig) => {
            if (params.headers) {
                params.headers.Authorization = `Bearer ${token}`;
            }

            return params;
        });
    };

    resetToken = () => {
        if (this.storedInterceptor) {
            axios.interceptors.request.eject(this.storedInterceptor);
            this.storedInterceptor = undefined;
        }
    };

    handle401 = () => {
        axios.interceptors.response.use(
            response => response,
            response => {
                if (response?.response?.data?.statusCode === 401) {
                    if (this.isAuthenticated) {
                        this.logout();
                    }
                }
                return response;
            }
        );
    };
}
