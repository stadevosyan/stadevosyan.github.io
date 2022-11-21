import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { FormState } from 'formstate';
import { debounce } from 'debounce';
import { CheckboxFieldState } from '@servicetitan/form-state';
import { BookEntity, EditBookDto, ELibraryApi } from '../../common/api/e-library.client';
import {
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

            await this.eLibraryApi.booksController_editCategory(this.selectedBook?.id!, {
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

    initDetails = (id: number) => {
        this.selectedBook = this.books.find(book => book.id === id);
        setFormStateValues(this.bookForm, {
            title: this.selectedBook?.title ?? '',
            description: this.selectedBook?.description ?? '',
            author: this.selectedBook?.author ?? '',
            pictureUrl: this.selectedBook?.pictureUrl ?? '',
        });

        this.filePickerStore.setSavedImageUrl(`${baseUrl}${this.selectedBook?.pictureUrl}`);
    };
}
