import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { FormState } from 'formstate';
import { debounce } from 'debounce';
import { CheckboxFieldState } from '@servicetitan/form-state';
import {
    BookModel,
    EditBookDto,
    ELibraryApi,
    HoldBookDto,
    Status,
    UserModel,
} from '../../common/api/e-library.client';
import {
    commitFormState,
    formStateToJS,
    FormValidators,
    InputFieldState,
    setFormStateValues,
} from '@servicetitan/form';
import { errorMessages, requiredWithCustomText } from './new-book.store';
import { LoadStatus } from '../../common/enums/load-status';
import { FilePickerStore } from '../../common/stores/file-picker.store';
import { baseUrl } from '../../../app';
import { GeneralDataStore } from '../../common/stores/general-data.store';
import { act } from 'react-dom/test-utils';

@injectable()
export class BooksStore {
    @observable bookUpdateLoadStatus: LoadStatus = LoadStatus.None;
    @observable bookDetailsReadyStatus: LoadStatus = LoadStatus.None;
    @observable activeTab = 0;
    @observable isFilterOpen = false;
    @observable books: BookModel[] = [];

    @observable holderUserId?: number;
    @observable count = 0;
    @observable categoriesData: any[] = [];

    @observable assignModal = false;
    @observable assignModalLoading = false;

    @observable users: Map<number, UserModel> = new Map();
    @observable usersIds: number[] = [];

    @observable categoriesIds: number[] = [];
    @observable selectedBook?: BookModel;

    filterForm = new FormState({
        all: new FormState<Map<number, CheckboxFieldState>>(new Map()),
        isAvailable: new CheckboxFieldState(false),
        isBooked: new CheckboxFieldState(false),
    });

    searchForm = new FormState({
        search: new InputFieldState(''),
    });

    bookForm = new FormState({
        title: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredTitle)
        ),
        author: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredAuthor),
            FormValidators.maxLength(124)
        ),
        description: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredDesc),
            FormValidators.maxLength(1024)
        ),
        categoryIds: new FormState<Map<number, CheckboxFieldState>>(new Map()),
        pictureUrl: new InputFieldState(''),
        isAvailable: new CheckboxFieldState(false),
        holdUser: new InputFieldState<number | undefined>(undefined),
    });

    userForm = new FormState<Map<number, CheckboxFieldState>>(new Map());

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

    @action setActiveTab = (tab: number) => {
        this.activeTab = tab;
    };

    @action resetForm = () => {
        this.categoriesIds = [];
        this.bookForm.reset();
        // Hide after merge
        // this.createCategories();
    };

    @action cleanBookEditState = () => {
        this.resetForm();
        this.setBookUpdateLoadStatus(LoadStatus.None);
        this.setBookDetailsReadyStatus(LoadStatus.None);
    };

    @action openAssignBookModal = async () => {
        this.assignModalLoading = false;
        this.assignModal = true;
        this.userForm = new FormState(new Map());
        this.users = new Map();
        this.usersIds = [];

        const holderUserId = this.selectedBook?.holdedUser?.id;

        const users = (await this.eLibraryApi.usersController_getUsers('', 1, 1000)).data;

        users.data.forEach(user => {
            this.userForm.$.set(user.id, new CheckboxFieldState(holderUserId === user.id));
            this.users.set(user.id, user);
            this.usersIds.push(user.id);
        });

        this.holderUserId = holderUserId;
        this.assignModalLoading = true;
    };

    @action closeAssignBookModal = () => {
        this.assignModal = false;
    };

    @action updateBook = async () => {
        const { hasError } = await this.bookForm.validate();

        if (hasError || this.filePickerStore.error || !this.selectedBook) {
            return false;
        }
        this.setBookUpdateLoadStatus(LoadStatus.Loading);

        const bookId: number = this.selectedBook.id!;
        const { title, description, author, holdUser } = formStateToJS(this.bookForm);
        const profilePictureUrl = this.filePickerStore.imageUrlToSave;
        const categoryIds: number[] = [];

        try {
            this.bookForm.$.categoryIds.$.forEach((category, id) => {
                if (category.value) {
                    categoryIds.push(id);
                }
            });

            const bookId: number = this.selectedBook.id!;

            await this.eLibraryApi.booksController_editBook(bookId, {
                title,
                description,
                author,
                pictureUrl: profilePictureUrl?.split('uploads')[1],
                categoryIds: [],
            } as unknown as EditBookDto);

            if (holdUser && this.bookForm.$.isAvailable.value) {
                this.eLibraryApi.booksController_holdBook({
                    bookId,
                    userId: holdUser,
                } as HoldBookDto);
            } else {
                if (this.selectedBook.holdUser && !holdUser) {
                    this.eLibraryApi.booksController_unHoldBook({
                        bookId,
                        userId: this.selectedBook.holdedUser.id,
                    } as HoldBookDto);
                    this.bookForm.$.holdUser.onChange(undefined);
                }
            }
            this.setBookUpdateLoadStatus(LoadStatus.Ok);
        } catch (e) {
            this.setBookUpdateLoadStatus(LoadStatus.Error);
        }
    };

    updateUserId = (id: number) => {
        if (this.holderUserId === id) {
            this.userForm.$.get(id)!.onChange(false);
        } else {
            this.userForm.$.get(id)!.onChange(true);
            this.holderUserId = id;
        }
    };

    @action setBookUpdateLoadStatus = (status: LoadStatus) => (this.bookUpdateLoadStatus = status);
    @action setBookDetailsReadyStatus = (status: LoadStatus) =>
        (this.bookDetailsReadyStatus = status);

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

    initDetails = async (id: number) => {
        this.setBookDetailsReadyStatus(LoadStatus.Loading);
        try {
            this.selectedBook = (await this.eLibraryApi.booksController_getBookById(id)).data;

            setFormStateValues(this.bookForm, {
                title: this.selectedBook?.title ?? '',
                description: this.selectedBook?.description ?? '',
                author: this.selectedBook?.author ?? '',
                pictureUrl: this.selectedBook?.pictureUrl ?? '',
                isAvailable: !!this.selectedBook?.holdedUser,
                categoryIds: [],
            });

            await when(() => this.generalDataStore.fetchCategoriesStatus !== LoadStatus.Loading);
            this.createCategories();

            commitFormState(this.bookForm);

            this.filePickerStore.setSavedImageUrl(`${baseUrl}${this.selectedBook?.pictureUrl}`);
            this.setBookDetailsReadyStatus(LoadStatus.Ok);
        } catch {
            this.setBookDetailsReadyStatus(LoadStatus.Error);
        }
    };

    createCategories = () => {
        this.categoriesIds = [];

        for (const category of this.categoriesData) {
            // this.categoriesMap.set(category.id, category);
            this.categoriesIds.push(category.id);
            this.bookForm.$.categoryIds.$.set(
                category.id,
                new CheckboxFieldState(category.id === 1)
            );
            this.filterForm.$.all.$.set(category.id, new CheckboxFieldState(false));
        }
    };

    assignToUser = () => {
        this.userForm.$.forEach((user, id) => {
            if (user.value) {
                this.bookForm.$.holdUser.onChange(id);
            } else {
                this.bookForm.$.holdUser.onChange(undefined);
            }
        });
        this.closeAssignBookModal();
    };

    resetAssignForm = () => {
        this.userForm.reset();
        this.closeAssignBookModal();
    };

    cancelFilter = () => {
        this.filterForm.reset();
        this.closeFilter();
    };

    applyFilter = () => {
        this.closeFilter();
    };

    handleSearch = () => {};
}

function myXOR(a: boolean, b: boolean) {
    return (a || b) && !(a && b);
}
