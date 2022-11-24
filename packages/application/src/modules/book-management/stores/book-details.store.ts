import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { GeneralDataStore } from '../../common/stores/general-data.store';
import {
    BookModel,
    EditBookDto,
    ELibraryApi,
    HoldBookDto,
} from '../../common/api/e-library.client';
import { FormState } from 'formstate';
import {
    commitFormState,
    formStateToJS,
    FormValidators,
    InputFieldState,
    setFormStateValues,
} from '@servicetitan/form';
import { errorMessages, requiredWithCustomText } from './new-book.store';
import { CheckboxFieldState } from '@servicetitan/form-state';
import { LoadStatus } from '../../common/enums/load-status';
import { FilePickerStore } from '../../common/stores/file-picker.store';

@injectable()
export class BookDetailsStore {
    @observable bookUpdateLoadStatus: LoadStatus = LoadStatus.None;
    @observable bookDetailsReadyStatus: LoadStatus = LoadStatus.None;
    @observable selectedBook?: BookModel;
    @observable activeTab = 0; // REM
    @observable assignModal = false;
    @observable assignModalLoading = false;
    @observable newHolder?: number | null = undefined;

    bookForm = new FormState({
        title: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredTitle)
        ),
        author: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredAuthor),
            FormValidators.maxLength(124)
        ),
        description: new InputFieldState('').validators(
            FormValidators.maxLength(1024)
        ),
        categoryIds: new FormState<Map<number, CheckboxFieldState>>(new Map()),
        pictureUrl: new InputFieldState(''),
        isAvailable: new CheckboxFieldState(false),
    });

    @computed get holderUserId() {
        return this.selectedBook?.holdedUser?.id;
    }

    @computed get categories() {
        return this.generalDataStore.categories;
    }

    @computed get categoriesMap() {
        return this.generalDataStore.categoriesMap;
    }

    constructor(
        @inject(FilePickerStore) private readonly filePickerStore: FilePickerStore,
        @inject(GeneralDataStore) private readonly generalDataStore: GeneralDataStore,
        @inject(ELibraryApi) private eLibraryApi: ELibraryApi
    ) {
        makeObservable(this);
    }

    @action closeAssignBookModal = () => (this.assignModal = false);

    @action cleanBookEditState = () => {
        this.resetForm();
        this.setBookUpdateLoadStatus(LoadStatus.None);
        this.setBookDetailsReadyStatus(LoadStatus.None);
    };

    @action resetForm = () => {
        this.bookForm.reset();
        this.createCategories();
        this.bookForm.$.pictureUrl.onChange(this.selectedBook?.pictureUrl ?? '');
    };

    @action openAssignBookModal = () => {
        this.assignModal = true;
    };

    @action updateBook = async () => {
        const { hasError } = await this.bookForm.validate();

        if (hasError || this.filePickerStore.error || !this.selectedBook) {
            return false;
        }
        this.setBookUpdateLoadStatus(LoadStatus.Loading);

        const { title, description, author } = formStateToJS(this.bookForm);
        const profilePictureUrl = this.filePickerStore.imageUrlToSave;
        const categoryIds: number[] = [];
        const bookId: number = this.selectedBook.id!;

        try {
            // update
            await this.updateBookHoldStatus(bookId);

            this.bookForm.$.categoryIds.$.forEach((category, id) => {
                if (category.value) {
                    categoryIds.push(id);
                }
            });

            const response = await this.eLibraryApi.booksController_editBook(bookId, {
                title,
                description,
                author,
                pictureUrl: profilePictureUrl ?? '',
                categoryIds,
            } as unknown as EditBookDto);
            this.initState(response.data);

            this.setBookUpdateLoadStatus(LoadStatus.Ok);
        } catch (e) {
            this.setBookUpdateLoadStatus(LoadStatus.Error);
        }
    };

    @action setActiveTab = (tab: number) => (this.activeTab = tab);
    @action setBookUpdateLoadStatus = (status: LoadStatus) => (this.bookUpdateLoadStatus = status);
    @action setBookDetailsReadyStatus = (status: LoadStatus) =>
        (this.bookDetailsReadyStatus = status);

    initDetails = async (id: number) => {
        this.setBookDetailsReadyStatus(LoadStatus.Loading);
        try {
            const book = (await this.eLibraryApi.booksController_getBookById(id)).data;
            await when(() => this.generalDataStore.fetchCategoriesStatus === LoadStatus.Ok);
            this.createCategories();
            this.initState(book);
            this.setBookDetailsReadyStatus(LoadStatus.Ok);
        } catch (e) {
            this.setBookDetailsReadyStatus(LoadStatus.Error);
        }
    };

    @action initState = (book: BookModel) => {
        setFormStateValues(this.bookForm, {
            title: book?.title ?? '',
            description: book?.description ?? '',
            author: book?.author ?? '',
            pictureUrl: book?.pictureUrl ?? '',
            isAvailable: !!book?.holdedUser,
        });

        commitFormState(this.bookForm);
        this.selectedBook = book;
    };

    createCategories = () => {
        const ids = this.selectedBook?.categories.map(c => c.id) ?? [];
        for (const category of this.categories) {
            this.bookForm.$.categoryIds.$.set(
                category.id,
                new CheckboxFieldState(ids.includes(category.id))
            );
        }
    };

    updateBookHoldStatus = async (bookId: number) => {
        if (
            this.newHolder !== undefined &&
            this.holderUserId &&
            !this.bookForm.$.isAvailable.value
        ) {
            await this.eLibraryApi.booksController_unHoldBook({
                bookId,
                userId: this.holderUserId,
            } as HoldBookDto);
        }

        if (this.newHolder) {
            await this.eLibraryApi.booksController_holdBook({
                bookId,
                userId: this.newHolder,
            } as HoldBookDto);
        }

        runInAction(() => (this.newHolder = undefined));
    };

    @action unsetHolder = () => {
        this.newHolder = null;
    };
}
