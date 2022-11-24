import { inject, injectable } from '@servicetitan/react-ioc';

import { FormState } from 'formstate';
import { formStateToJS, FormValidators, InputFieldState } from '@servicetitan/form';
import { CreateUserDto, ELibraryApi } from '../../common/api/e-library.client';
import { action, computed, makeObservable, observable } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { FilePickerStore } from '../../common/stores/file-picker.store';
import { ContactsStore } from './contacts.store';

@injectable()
export class AddContactStore {
    @observable addContactStatus = LoadStatus.None;

    form: FormState<{
        name: InputFieldState<string>;
        password: InputFieldState<string>;
        email: InputFieldState<string>;
        phoneNumber: InputFieldState<string>;
    }>;

    @computed
    get isDirty() {
        const {
            $: { email, password, name, phoneNumber },
        } = this.form;
        return !!email.dirty || !!password.dirty || !!phoneNumber.dirty || name.dirty;
    }

    constructor(
        @inject(ELibraryApi) private readonly api: ELibraryApi,
        @inject(FilePickerStore) private readonly imageStore: FilePickerStore,
        @inject(ContactsStore) private readonly contactsStore: ContactsStore
    ) {
        makeObservable(this);
        this.form = new FormState({
            name: new InputFieldState('')
                .validators((value: string) => FormValidators.required(value) && 'Դաշտը պարտադիր է')
                .disableAutoValidation(),

            email: new InputFieldState('').validators(
                (value: string) =>
                    !FormValidators.emailFormatIsValid(value) && 'Նշեք վավեր էլեկտրոնային հասցե'
            ),
            phoneNumber: new InputFieldState('').validators(
                this.phoneValidator('Նշեք վավեր հեռախոսահամար')
            ),
            password: new InputFieldState('')
                .validators(
                    (value: string) =>
                        !FormValidators.passwordIsValidFormat(value) &&
                        'Ձեր գաղտնաբառը պիտի բաղկացած լինի նվազագույնը 8 սիմվոլից և պարունակի գոնե 1 թվանշան, փոքրատառ և մեծատառ'
                )
                .disableAutoValidation(),
        });
    }

    phoneValidator =
        (error = 'Անվավեր հեռախոսահամար') =>
        (value: string) =>
            FormValidators.isMatchingRegex(
                /^(\+374|00374|0)?\d{8}$/,
                'Հեռախոսահամար'
            )(value.trim()) && error;

    addContact = async () => {
        this.setAddContactStatus(LoadStatus.Loading);
        const res = await this.form.validate();
        if (res.hasError || this.imageStore.error) {
            this.setAddContactStatus(LoadStatus.Ok);
            return false;
        }

        const { name, phoneNumber, password, email } = formStateToJS(this.form);
        const profilePictureUrl = this.imageStore.imageUrlToSave;

        try {
            await this.api.authController_signUpUser({
                name,
                password,
                email,
                phoneNumber,
                profilePictureUrl,
            } as CreateUserDto);
            await this.contactsStore.reSet();

            this.setAddContactStatus(LoadStatus.Ok);
            this.contactsStore.hideTakeover();
        } catch {
            this.setAddContactStatus(LoadStatus.Error);
        }
    };

    @action private setAddContactStatus = (status: LoadStatus) => (this.addContactStatus = status);
}
