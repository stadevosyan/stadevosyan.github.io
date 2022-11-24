import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { BookModel, ELibraryApi } from '../../common/api/e-library.client';
import { FormState } from 'formstate';
import { InputFieldState } from '@servicetitan/form';

export interface IBookHistory {
    id: number;
    isReading: boolean;
    book: BookModel;
}

@injectable()
export class OwnBooksStore {
    @observable loadingOwnBooksStatus = LoadStatus.None;
    @observable booksHistory: IBookHistory[] = [];
    @observable count = 0;

    searchForm = new FormState({
        search: new InputFieldState(''),
    });

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
        this.init().catch();
    }

    @computed get booksToShow() {
        return this.booksHistory.filter(item =>
            item.book.title
                .toLowerCase()
                .includes(this.searchForm.$.search.value.trim().toLowerCase())
        );
    }

    init = async () => {
        this.setLoadingOwnBooksStatus(LoadStatus.Loading);
        try {
            const { data: books } =
                await this.eLibraryApi.booksController_getLoggedInUserRentHistory();
            const { data } = books;

            runInAction(() => {
                this.booksHistory = data
                    .sort((item1, item2) => item2.id - item1.id)
                    .map(item => ({
                        id: item.id,
                        isReading: !item.endDate,
                        startDate: item.createdDate,
                        book: item.book,
                    }));
            });

            this.setLoadingOwnBooksStatus(LoadStatus.Ok);
        } catch {
            this.setLoadingOwnBooksStatus(LoadStatus.Error);
        }
    };

    @action setLoadingOwnBooksStatus = (status: LoadStatus) =>
        (this.loadingOwnBooksStatus = status);
}
