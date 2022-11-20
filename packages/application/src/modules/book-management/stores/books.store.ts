import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { FormState } from 'formstate';
import { CheckboxFieldState } from '@servicetitan/form-state';
import { BookEntity, ELibraryApi } from '../../common/api/e-library.client';
import { InputFieldState } from '@servicetitan/form';
import { debounce } from 'debounce';

@injectable()
export class BooksStore {
    @observable loading: any;
    @observable activeTab = 0;
    @observable isFilterOpen = false;
    @observable books: BookEntity[] = [];
    @observable count = 0;
    @observable selectedBook?: Partial<BookEntity> = {
        title: '',
        author: '',
        description: '',
    };

    filterForm = new FormState({
        all: new CheckboxFieldState(false),
        isAvailable: new CheckboxFieldState(false),
    });

    searchForm = new FormState({
        search: new InputFieldState(''),
    });

    searchDebounced: (() => Promise<void>) & { clear(): void } & { flush(): void };

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
        this.init();
        this.searchDebounced = debounce(this.getBooksList, 300);
    }

    cancelFilter = () => {
        this.closeFilter();
    };

    applyFilter = () => {
        this.closeFilter();
    };

    handleSearch = () => {};

    @action openFilter = () => {
        this.isFilterOpen = true;
    };

    @action closeFilter = () => {
        this.isFilterOpen = false;
    };

    @action handleSelect = async (_book: any) => {
        return Promise.resolve();
    };

    @action setActiveTab = (tab: number) => {
        this.activeTab = tab;
    };

    getBooksList = async () => {
        const { data: books } = await this.eLibraryApi.booksController_getBooks(
            this.searchForm.$.search.value || ''
        );
        this.books = books.data;
        this.count = books.count;
    };

    init = async () => {
        await this.getBooksList();
    };

    initDetails = (id: number) => {
        this.selectedBook = this.books.find(book => book.id === id);
    };
}
