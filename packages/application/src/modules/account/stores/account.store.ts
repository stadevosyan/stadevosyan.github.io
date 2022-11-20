import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { AuthStore } from '../../common/stores/auth.store';
import { FormState } from 'formstate';
import {
    commitFormState,
    formStateToJS,
    FormValidators,
    InputFieldState,
    setFormStateValues,
} from '@servicetitan/form';
import { FilePickerStore } from '../../common/stores/file-picker.store';
import { EditUserDto } from '../../common/api/e-library.client';

@injectable()
export class AccountStore {
    @observable accountUpdateStatus = LoadStatus.None;
    @observable changePasswordStatus = LoadStatus.None;

    @computed get isDirty() {
        return (
            !!this.form.$.name.dirty ||
            !!this.form.$.email.dirty ||
            !!this.form.$.phoneNumber.dirty ||
            this.imageStore.isDirty
        );
    }

    @computed get user() {
        return this.authStore.user;
    }

    form: FormState<{
        name: InputFieldState<string>;
        email: InputFieldState<string>;
        phoneNumber: InputFieldState<string>;
        profilePictureUrl: InputFieldState<string>;
    }>;

    constructor(
        @inject(AuthStore) private readonly authStore: AuthStore,
        @inject(FilePickerStore) private readonly imageStore: FilePickerStore
    ) {
        makeObservable(this);

        this.form = new FormState({
            name: new InputFieldState(this.user?.name ?? '').validators(
                (value: string) => FormValidators.required(value) && 'Դաշտը պարտադիր է'
            ),
            email: new InputFieldState(this.user?.email ?? '').validators(
                (value: string) =>
                    !FormValidators.emailFormatIsValid(value) && 'Նշեք վավեր էլեկտրոնային հասցե'
            ),
            phoneNumber: new InputFieldState(this.user?.phoneNumber ?? '').validators(
                this.phoneValidator('Նշեք վավեր հեռախոսահամար')
            ),
            profilePictureUrl: new InputFieldState<string>(this.user?.profilePictureUrl ?? ''),
        });
    }

    handleAccountUpdate = async () => {
        if (!this.isDirty) {
            return false;
        }

        this.setAccountUpdateStatus(LoadStatus.Loading);
        const res = await this.form.validate();
        if (res.hasError) {
            this.setAccountUpdateStatus(LoadStatus.Ok);
            return false;
        }

        const { name, phoneNumber } = formStateToJS(this.form);
        const profilePictureUrl = this.imageStore.imageUrlToSave ?? '';
        try {
            await this.authStore.updateUserData({
                name,
                phoneNumber,
                profilePictureUrl,
            } as EditUserDto);
        } catch {
            this.setAccountUpdateStatus(LoadStatus.Error);
        }
        this.resetForm();
    };

    resetForm = () => {
        setFormStateValues(this.form, {
            email: this.user?.email,
            phoneNumber: this.user?.phoneNumber,
            name: this.user?.name,
            profilePictureUrl: this.user?.profilePictureUrl,
        });
        commitFormState(this.form);
        this.imageStore.reset();
    };

    phoneValidator =
        (error = 'Անվավեր հեռաղոսահամար') =>
        (value: string) =>
            FormValidators.isMatchingRegex(
                /^(\+374|00374|0)?\d{8}$/,
                'Հեռախոսահամար'
            )(value.trim()) && error;

    @action private setAccountUpdateStatus = (status: LoadStatus) =>
        (this.accountUpdateStatus = status);
    @action private setChangePasswordStatus = (status: LoadStatus) =>
        (this.changePasswordStatus = status);
}
