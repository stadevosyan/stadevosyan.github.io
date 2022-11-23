import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { FormState } from 'formstate';
import { debounce } from 'debounce';
import { CheckboxFieldState } from '@servicetitan/form-state';
import {
    BookModel,
    CategoryEntity,
    EditBookDto,
    ELibraryApi,
    HoldBookDto,
    UserEntity,
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

@injectable()
export class BooksStore {
    @observable loading: any;
    @observable activeTab = 0;
    @observable isFilterOpen = false;
    @observable books: BookModel[] = [];

    @observable count = 0;
    @observable categories = new Map();
    @observable categoriesData: CategoryEntity[] = [];

    @observable assignModal = false;
    @observable assignModalLoading = false;

    @observable users: Map<number, UserEntity> = new Map();
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

    constructor(
        @inject(FilePickerStore) private readonly filePickerStore: FilePickerStore,
        @inject(ELibraryApi) private eLibraryApi: ELibraryApi
    ) {
        makeObservable(this);
        this.init();
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
    };

    @action cleanBookEditState = () => {
        this.resetForm();
    };

    @action openAssignBookModal = async () => {
        this.assignModalLoading = false;
        this.assignModal = true;
        this.userForm = new FormState(new Map());
        this.users = new Map();
        this.usersIds = [];

        const users = (await this.eLibraryApi.usersController_getUsers('', 1, 1000)).data;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        users.data.forEach(user => {
            this.userForm.$.set(user.id, new CheckboxFieldState(false));
            this.users.set(user.id, user);
            this.usersIds.push(user.id);
        });

        this.assignModalLoading = true;
    };

    @action closeAssignBookModal = () => {
        this.assignModal = false;
    };

    updateBook = async () => {
        const { hasError } = await this.bookForm.validate();

        if (hasError || this.filePickerStore.error || !this.selectedBook) {
            return false;
        }
        this.loading = LoadStatus.Loading;
        try {
            const { title, description, author, holdUser } = formStateToJS(this.bookForm);
            const profilePictureUrl = this.filePickerStore.imageUrlToSave;
            const categoryIds: number[] = [];
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
                pictureUrl: profilePictureUrl!,
                categoryIds,
            } as unknown as EditBookDto);

            if (holdUser) {
                this.eLibraryApi.booksController_holdBook({
                    bookId,
                    userId: holdUser,
                } as HoldBookDto);
            } else {
                if (this.selectedBook.holdUser && !holdUser) {
                    this.eLibraryApi.booksController_unHoldBook({
                        bookId,
                        userId: this.selectedBook.holdUser,
                    } as HoldBookDto);
                }
            }
        } catch (e) {
            //
        }
        this.loading = LoadStatus.Ok;
    };

    getBooksList = async () => {
        const { data: books } = await this.eLibraryApi.booksController_getBooks(
            this.searchForm.$.search.value || ''
        );
        runInAction(() => {
            this.books = books.data;
            this.count = books.count;
        });
    };

    init = async () => {
        await this.getBooksList();
        this.getCategories().then();
    };

    initDetails = async (id: number) => {
        this.selectedBook = (await this.eLibraryApi.booksController_getBookById(id)).data;

        setFormStateValues(this.bookForm, {
            title: this.selectedBook?.title ?? '',
            description: this.selectedBook?.description ?? '',
            author: this.selectedBook?.author ?? '',
            pictureUrl: this.selectedBook?.pictureUrl ?? '',
            isAvailable: !!this.selectedBook?.holdedUser,
            categoryIds: [],
        });

        if (!this.categoriesData.length) {
            await this.getCategories();
            this.createCategories();
        } else {
            this.createCategories();
        }

        commitFormState(this.bookForm);

        this.filePickerStore.setSavedImageUrl(`${baseUrl}${this.selectedBook?.pictureUrl}`);
    };

    getCategories = async () => {
        runInAction(() => {
            this.categoriesIds = [];
        });

        const categories: CategoryEntity[] = (
            await this.eLibraryApi.categoryController_getCategories('')
        ).data as unknown as CategoryEntity[];

        runInAction(() => {
            this.categoriesData = categories[0] as unknown as CategoryEntity[];
        });
    };

    createCategories = () => {
        this.categoriesData.forEach(item => {
            this.categories.set(item.id, item.name);
            this.categoriesIds.push(item.id);
        });

        for (const category of this.categoriesData) {
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
