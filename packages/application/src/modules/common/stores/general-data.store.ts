import { inject, injectable } from '@servicetitan/react-ioc';

import { action, makeObservable, observable, runInAction } from 'mobx';
import { CategoryEntity, ELibraryApi } from '../api/e-library.client';
import { LoadStatus } from '../enums/load-status';

@injectable()
export class GeneralDataStore {
    @observable categories: CategoryEntity[] = [];
    @observable fetchCategoriesStatus = LoadStatus.None;

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);
    }

    init = async () => {
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
}
