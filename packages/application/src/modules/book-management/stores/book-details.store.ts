import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { GeneralDataStore } from '../../common/stores/general-data.store';
import {
    BookModel,
    EditBookDto,
    ELibraryApi,
    HoldBookDto,
    UserModel,
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
    @observable categoriesIds: number[] = [];
    @observable activeTab = 0; // REM
    @observable users: Map<number, UserModel> = new Map();
    @observable assignModal = false;
    @observable assignModalLoading = false;
    @observable usersIds: number[] = [];
    @observable holderUserId?: number;

    userForm = new FormState<Map<number, CheckboxFieldState>>(new Map());

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
    }

    @action closeAssignBookModal = () => (this.assignModal = false);

    @action cleanBookEditState = () => {
        this.resetForm();
        this.setBookUpdateLoadStatus(LoadStatus.None);
        this.setBookDetailsReadyStatus(LoadStatus.None);
    };

    @action resetForm = () => {
        this.categoriesIds = [];
        this.bookForm.reset();
        this.createCategories();
        // need to fix
        this.bookForm.$.pictureUrl.onChange(this.selectedBook?.pictureUrl ?? '');
    };

    handleAssignToUser = () => {
        this.closeAssignBookModal();
    };

    resetAssignForm = () => {
        this.userForm.reset();
        this.closeAssignBookModal();
    };

    updateUserId = (id: number) => {
        if (this.holderUserId === id) {
            this.userForm.$.get(id)!.onChange(false);
        } else {
            this.userForm.$.get(id)!.onChange(true);
            this.holderUserId = id;
        }
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
            this.updateBookHoldStatus(bookId);

            this.bookForm.$.categoryIds.$.forEach((category, id) => {
                if (category.value) {
                    categoryIds.push(id);
                }
            });

            await this.eLibraryApi.booksController_editBook(bookId, {
                title,
                description,
                author,
                pictureUrl: profilePictureUrl ?? '',
                categoryIds,
            } as unknown as EditBookDto);

            runInAction(() => {
                // this.selectedBook = savebook;
            });

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
            this.selectedBook = (await this.eLibraryApi.booksController_getBookById(id)).data;

            setFormStateValues(this.bookForm, {
                title: this.selectedBook?.title ?? '',
                description: this.selectedBook?.description ?? '',
                author: this.selectedBook?.author ?? '',
                pictureUrl: this.selectedBook?.pictureUrl ?? '',
                isAvailable: !!this.selectedBook?.holdedUser,
            });

            this.bookForm.$.holdUser.onChange(
                this.selectedBook?.holdedUser ? this.selectedBook?.holdedUser.id : undefined
            );

            await when(() => this.generalDataStore.fetchCategoriesStatus !== LoadStatus.Loading);
            this.createCategories();

            commitFormState(this.bookForm);

            // this.filePickerStore.setSavedImageUrl(`${baseUrl}${this.selectedBook?.pictureUrl}`);
            this.setBookDetailsReadyStatus(LoadStatus.Ok);
        } catch (e) {
            this.setBookDetailsReadyStatus(LoadStatus.Error);
        }
    };

    createCategories = () => {
        this.categoriesIds = [];
        const ids = this.selectedBook?.categories.map(c => c.id) ?? [];
        for (const category of this.categories) {
            this.categoriesIds.push(category.id);
            this.bookForm.$.categoryIds.$.set(
                category.id,
                new CheckboxFieldState(ids.includes(category.id))
            );
        }
    };

    updateBookHoldStatus = (bookId: number) => {
        const prevHolderUser = this.selectedBook?.holdedUser;
        let userId: number | undefined;

        this.userForm.$.forEach((user, id) => {
            if (user) {
                userId = id;
            }
        });

        // assign book
        if (userId && this.bookForm.$.isAvailable.value) {
            this.eLibraryApi.booksController_holdBook({
                bookId,
                userId,
            } as HoldBookDto);
        }

        // unassign book
        if (prevHolderUser && !this.bookForm.$.isAvailable.value && this.selectedBook?.holdedUser) {
            this.eLibraryApi.booksController_unHoldBook({
                bookId,
                userId: prevHolderUser.id,
            } as HoldBookDto);
            this.bookForm.$.holdUser.onChange(undefined);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.selectedBook.holdedUser = null;
        }
    };
}
