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
    });

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
    };

    initDetails = async (id: number) => {
        const categories: CategoryEntity[] = (
            await this.eLibraryApi.categoryController_getCategories('')
        ).data as unknown as CategoryEntity[];
        // TODO replace with api call
        this.selectedBook = this.books.find(book => book.id === id);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        categories[0].forEach(item => {
            this.categories.set(item.id, item.name);
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const category of categories[0]) {
            this.bookForm.$.categoryIds.$.set(
                category.id,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                new CheckboxFieldState(category.id === 1)
            );
        }

        setFormStateValues(this.bookForm, {
            title: this.selectedBook?.title ?? '',
            description: this.selectedBook?.description ?? '',
            author: this.selectedBook?.author ?? '',
            pictureUrl: this.selectedBook?.pictureUrl ?? '',
        });

        commitFormState(this.bookForm);

        this.filePickerStore.setSavedImageUrl(`${baseUrl}${this.selectedBook?.pictureUrl}`);
    };
}
