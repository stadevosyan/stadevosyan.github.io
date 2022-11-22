import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { FormState } from 'formstate';
import { debounce } from 'debounce';
import { CheckboxFieldState } from '@servicetitan/form-state';
import {
    BookEntity,
    CategoryEntity,
    EditBookDto,
    ELibraryApi,
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
    @observable books: BookEntity[] = [];

    @observable count = 0;
    @observable categories = new Map();

    @observable assignModal = false;
    @observable assignModalLoading = false;
    @observable users: Map<number, UserEntity> = new Map();
    @observable usersIds: number[] = [];
    @observable categoriesIds: number[] = [];

    @observable selectedBook?: Partial<BookEntity> = {
        title: '',
        author: '',
        description: '',
    };

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

    cancelFilter = () => {
        this.filterForm.reset();
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

    @action resetForm = () => {
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

        if (hasError || this.filePickerStore.error) {
            return false;
        }
        this.loading = LoadStatus.Loading;
        try {
            const { title, description, author } = formStateToJS(this.bookForm);
            const profilePictureUrl = this.filePickerStore.imageUrlToSave;
            const categoryIds: number[] = [];
            this.bookForm.$.categoryIds.$.forEach((category, id) => {
                if (category.value) {
                    categoryIds.push(id);
                }
            });
            // TODO fix issue with book id
            const bookId = this.selectedBook!.id!;
            await this.eLibraryApi.booksController_editCategory(bookId, {
                title,
                description,
                author,
                pictureUrl: profilePictureUrl!,
                categoryIds,
            } as unknown as EditBookDto);
        } catch (e) {
            //
        }
        this.loading = LoadStatus.Ok;
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
        this.getCategories().then();
    };

    initDetails = (id: number) => {
        // TODO replace with api call
        this.selectedBook = this.books.find(book => book.id === id);

        this.getCategories().then();

        setFormStateValues(this.bookForm, {
            title: this.selectedBook?.title ?? '',
            description: this.selectedBook?.description ?? '',
            author: this.selectedBook?.author ?? '',
            pictureUrl: this.selectedBook?.pictureUrl ?? '',
        });

        commitFormState(this.bookForm);

        this.filePickerStore.setSavedImageUrl(`${baseUrl}${this.selectedBook?.pictureUrl}`);
    };

    getCategories = async () => {
        const categories: CategoryEntity[] = (
            await this.eLibraryApi.categoryController_getCategories('')
        ).data as unknown as CategoryEntity[];
        this.categoriesIds = [];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        categories[0].forEach(item => {
            this.categories.set(item.id, item.name);
            this.categoriesIds.push(item.id);
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const category of categories[0]) {
            this.bookForm.$.categoryIds.$.set(
                category.id,
                new CheckboxFieldState(category.id === 1)
            );
            this.filterForm.$.all.$.set(category.id, new CheckboxFieldState(false));
        }
    };

    assignToUser = () => {
        this.closeAssignBookModal();
    };

    resetAssignForm = () => {
        this.userForm.reset();
        this.closeAssignBookModal();
    };
}
