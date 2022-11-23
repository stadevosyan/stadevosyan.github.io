import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { FormState } from 'formstate';
import { debounce } from 'debounce';
import { CheckboxFieldState } from '@servicetitan/form-state';
import { BookModel, ELibraryApi, Status } from '../../common/api/e-library.client';
import { InputFieldState } from '@servicetitan/form';
import { GeneralDataStore } from '../../common/stores/general-data.store';
import { LoadStatus } from '../../common/enums/load-status';

@injectable()
export class BooksStore {
    @observable fetchBooksLoadStatus = LoadStatus.None;
    @observable isFilterOpen = false;
    @observable books: BookModel[] = [];
    @observable count = 0;

    filterForm = new FormState({
        categories: new FormState<Map<number, CheckboxFieldState>>(new Map()),
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

    @computed get reservationFilterStatus() {
        const isAvailable = this.filterForm.$.isAvailable.value;
        const isBooked = this.filterForm.$.isBooked.value;

        let filterStatus: Status | undefined;
        if (myXOR(isAvailable, isBooked)) {
            filterStatus = isAvailable ? Status.Available : Status.Hold;
        }
        return filterStatus;
    }

    @computed get booksToShow() {
        let booksToShow = this.books;
        const { reservationFilterStatus, selectedCategoriesFromDrawer } = this;
        if (reservationFilterStatus !== undefined) {
            booksToShow = booksToShow.filter(item =>
                reservationFilterStatus === Status.Hold ? !!item.holdedUser : !item.holdedUser
            );
        }
        if (selectedCategoriesFromDrawer.length) {
            booksToShow = booksToShow.filter(item =>
                this.hasCommonItem(
                    selectedCategoriesFromDrawer,
                    item.categories.map(c => c.id)
                )
            );
        }
        return booksToShow;
    }

    @computed get selectedCategoriesFromDrawer() {
        return Array.from(this.filterForm.$.categories.$)
            .filter(([_, checkboxState]) => checkboxState.value)
            .map(([categoryId, _]) => categoryId);
    }

    constructor(
        @inject(GeneralDataStore) private readonly generalDataStore: GeneralDataStore,
        @inject(ELibraryApi) private eLibraryApi: ELibraryApi
    ) {
        makeObservable(this);
        this.init().catch(null);
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

    @action setFetchBookLoadStatus = (status: LoadStatus) => (this.fetchBooksLoadStatus = status);

    getBooksList = async () => {
        this.setFetchBookLoadStatus(LoadStatus.Loading);

        try {
            const { data: books } = await this.eLibraryApi.booksController_getBooks(
                this.reservationFilterStatus,
                this.searchForm.$.search.value || '',
                this.selectedCategoriesFromDrawer
            );

            runInAction(() => {
                this.books = books.data;
                this.count = books.count;
            });

            this.setFetchBookLoadStatus(LoadStatus.Ok);
        } catch {
            this.setFetchBookLoadStatus(LoadStatus.Error);
        }
    };

    init = async () => {
        await Promise.all([this.getBooksList(), this.initCategoryFilters()]);
    };

    initCategoryFilters = async () => {
        await when(() => this.generalDataStore.fetchCategoriesStatus === LoadStatus.Ok);

        this.categories.forEach(item => {
            this.filterForm.$.categories.$.set(item.id, new CheckboxFieldState(false));
        });
    };

    cancelFilter = () => {
        this.filterForm.reset();
        this.closeFilter();
    };

    applyFilter = () => {
        this.closeFilter();
    };

    hasCommonItem = (arr1: number[], arr2: number[]) => {
        return arr1.some(item => arr2.includes(item));
    };
}

function myXOR(a: boolean, b: boolean) {
    return (a || b) && !(a && b);
}
