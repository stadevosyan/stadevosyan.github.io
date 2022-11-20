import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { FormState } from 'formstate';
import { formStateToJS, FormValidators, InputFieldState } from '@servicetitan/form';
import { CheckboxFieldState } from '@servicetitan/form-state';
import { CategoryEntity, CreateBookDto, ELibraryApi } from '../../common/api/e-library.client';
import { FilePickerStore } from '../../common/stores/file-picker.store';

export const requiredWithCustomText = (error: string) => (value: any) =>
    FormValidators.required(value) && error;

export const errorMessages = {
    RequiredTitle: 'Մուտքագրեք վերնագիրը',
};

@injectable()
export class NewBookStore {
    @observable loading: any;
    @observable open = false;
    @observable categories = new Map();

    newBookForm = new FormState({
        title: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredTitle)
        ),
        description: new InputFieldState('').validators(FormValidators.maxLength(1024)),
        author: new InputFieldState('').validators(FormValidators.maxLength(124)),
        categoryIds: new FormState<Map<number, CheckboxFieldState>>(new Map()),
        pictureUrl: new InputFieldState(''),
    });

    constructor(
        @inject(FilePickerStore) private readonly filePickerStore: FilePickerStore,
        @inject(ELibraryApi) private readonly eLibraryApi: ELibraryApi
    ) {
        makeObservable(this);
        this.init().catch();
    }

    @action setLoading = (loading: any) => (this.loading = loading);

    @action setOpen = (state: boolean) => (this.open = state);

    @action handleClose = () => this.setOpen(false);

    @action handleOpen = () => this.setOpen(true);

    init = async () => {
        const categories: CategoryEntity[] = (
            await this.eLibraryApi.categoryController_getCategories('')
        ).data as unknown as CategoryEntity[];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        categories[0].forEach(item => {
            this.categories.set(item.id, item.name);
        });
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        for (const category of categories[0]) {
            this.newBookForm.$.categoryIds.$.set(category.id, new CheckboxFieldState(false));
        }
    };

    createBook = async () => {
        const { hasError } = await this.newBookForm.validate();

        if (hasError || this.filePickerStore.error) {
            return false;
        }

        const { title, description, author } = formStateToJS(this.newBookForm);
        const profilePictureUrl = this.filePickerStore.imageUrlToSave;
        const categoryIds: number[] = [];
        this.newBookForm.$.categoryIds.$.forEach((category, id) => {
            if (category.value) {
                categoryIds.push(id);
            }
        });
        try {
            await this.eLibraryApi.booksController_addBook({
                title,
                description,
                author,
                pictureUrl: profilePictureUrl!,
                categoryIds,
            } as unknown as CreateBookDto);
        } catch {
            //
        }
    };

    cancel = () => {};
}
