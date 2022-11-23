import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { FormState } from 'formstate';
import { debounce } from 'debounce';
import { CheckboxFieldState } from '@servicetitan/form-state';
import { BookModel, ELibraryApi, Status } from '../../common/api/e-library.client';
import { InputFieldState } from '@servicetitan/form';
import { FilePickerStore } from '../../common/stores/file-picker.store';
import { GeneralDataStore } from '../../common/stores/general-data.store';

@injectable()
export class BooksStore {
    @observable isFilterOpen = false;
    @observable books: BookModel[] = [];
    @observable count = 0;

    filterForm = new FormState({
        all: new FormState<Map<number, CheckboxFieldState>>(new Map()),
        isAvailable: new CheckboxFieldState(false),
        isBooked: new CheckboxFieldState(false),
    });

    searchForm = new FormState({
        search: new InputFieldState(''),
    });

    searchDebounced: (() => Promise<void>) & { clear(): void } & { flush(): void };

    @computed get categories() {
        return this.generalDataStore.categories;
    }

    @computed get categoriesMap() {
        return new Map(this.categories.map(item => [item.id, item]));
    }

    constructor(
        @inject(FilePickerStore) private readonly filePickerStore: FilePickerStore,
        @inject(GeneralDataStore) private readonly generalDataStore: GeneralDataStore,
        @inject(ELibraryApi) private eLibraryApi: ELibraryApi
    ) {
        makeObservable(this);
        this.searchDebounced = debounce(this.getBooksList, 300);
    }

    @action openFilter = () => {
        this.isFilterOpen = true;
    };

    @action closeFilter = () => {
        this.isFilterOpen = false;
    };

    @action handleSelect = async (_book: any) => {
        return Promise.resolve();
    };

    getBooksList = async () => {
        const isAvailable = this.filterForm.$.isAvailable.value;
        const isBooked = this.filterForm.$.isBooked.value;

        let filterStatus: Status | undefined;
        if (myXOR(isAvailable, isBooked)) {
            filterStatus = isAvailable ? Status.Available : Status.Hold;
        }

        const { data: books } = await this.eLibraryApi.booksController_getBooks(
            filterStatus,
            this.searchForm.$.search.value || '',
            undefined
        );
        runInAction(() => {
            this.books = books.data;
            this.count = books.count;
        });
    };

    init = async () => {
        await this.getBooksList();
    };

    cancelFilter = () => {
        this.filterForm.reset();
        this.closeFilter();
    };

    applyFilter = () => {
        this.closeFilter();
    };
}

function myXOR(a: boolean, b: boolean) {
    return (a || b) && !(a && b);
}
