import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { BookEntity, ELibraryApi } from '../../common/api/e-library.client';
import { FormState } from 'formstate';
import { InputFieldState } from '@servicetitan/form';
import { debounce } from 'debounce';

@injectable()
export class OwnBooksStore {
    @observable loadingOwnBooksStatus = LoadStatus.None;
    @observable books: BookEntity[] = [];
    @observable booksToShow: BookEntity[] = [];
    @observable count = 0;

    // @computed get booksToShow() {
    //     return this.books.filter(item =>
    //         item.title.toLowerCase().includes(this.searchForm.$.search.value.trim().toLowerCase())
    //     );
    // }

    searchDebounced: (() => void) & { clear(): void } & { flush(): void };

    searchForm = new FormState({
        search: new InputFieldState(''),
    });

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
        this.searchDebounced = debounce(this.filterBooks, 400);
    }

    filterBooks = () => {
        runInAction(() => {
            this.booksToShow = this.books.filter(item =>
                item.title
                    .toLowerCase()
                    .includes(this.searchForm.$.search.value.trim().toLowerCase())
            );
        });
    };

    init = async (id: number) => {
        this.setLoadingOwnBooksStatus(LoadStatus.Loading);
        try {
            // TODO should be by endpoint of user books
            const { data: books } = await this.eLibraryApi.booksController_getBooks('');
            runInAction(() => {
                this.books = books.data;
                this.booksToShow = books.data;
                this.count = books.count;
            });

            this.setLoadingOwnBooksStatus(LoadStatus.Ok);
        } catch {
            this.setLoadingOwnBooksStatus(LoadStatus.Error);
        }
    };

    @action setLoadingOwnBooksStatus = (status: LoadStatus) =>
        (this.loadingOwnBooksStatus = status);
}
