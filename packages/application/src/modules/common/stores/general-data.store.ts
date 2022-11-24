import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { CategoryEntity, ELibraryApi, UserModel } from '../api/e-library.client';
import { LoadStatus } from '../enums/load-status';
import { AuthStore } from './auth.store';

@injectable()
export class GeneralDataStore {
    @observable categories: CategoryEntity[] = [];
    @observable fetchCategoriesStatus = LoadStatus.None;
    @observable users: UserModel[] = [];
    @observable fetchUsersStatus = LoadStatus.None;

    @computed get categoryIds() {
        return this.categories.map(item => item.id);
    }

    @computed get categoriesMap() {
        return new Map(this.categories.map(item => [item.id, item]));
    }

    constructor(
        @inject(ELibraryApi) private readonly api: ELibraryApi,
        @inject(AuthStore) private readonly authStore: AuthStore
    ) {
        makeObservable(this);
    }

    init = () => {
        this.fetchCategories().catch();
        this.fetchUsers().catch();
    };

    fetchUsers = async () => {
        if (this.authStore.isAdmin) {
            this.setFetchUsersStatus(LoadStatus.Loading);
            try {
                const { data: responseDto } = await this.api.usersController_getUsers(
                    undefined,
                    undefined,
                    undefined
                );
                runInAction(
                    () =>
                        (this.users = responseDto.data.sort((item1, item2) => item2.id - item1.id))
                );

                this.setFetchUsersStatus(LoadStatus.Ok);
            } catch {
                this.setFetchUsersStatus(LoadStatus.Error);
            }
        }
    };

    fetchCategories = async () => {
        if (this.fetchCategoriesStatus === LoadStatus.None) {
            this.setFetchCategoriesStatus(LoadStatus.Loading);

            try {
                const { data } = await this.api.categoryController_getCategories(undefined);
                const categories = data.data;
                runInAction(() => {
                    this.categories = categories;
                });
                this.setFetchCategoriesStatus(LoadStatus.Ok);
            } catch {
                this.setFetchCategoriesStatus(LoadStatus.Error);
            }
        }
    };

    @action setFetchCategoriesStatus = (status: LoadStatus) =>
        (this.fetchCategoriesStatus = status);
    @action setFetchUsersStatus = (status: LoadStatus) => (this.fetchUsersStatus = status);
}
