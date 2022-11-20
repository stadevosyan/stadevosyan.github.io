import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { FormState } from 'formstate';
import { commitFormState, FormValidators, InputFieldState } from '@servicetitan/form';
import { ELibraryApi } from '../../common/api/e-library.client';
import { AccountStore } from './account.store';

@injectable()
export class ChangePasswordStore {
    @observable changePasswordStatus = LoadStatus.None;

    @computed get isDirty() {
        return (
            !!this.form.$.oldPassword.dirty ||
            !!this.form.$.newPasswordForm.$.passwordConfirmation.dirty ||
            this.form.$.newPasswordForm.$.newPassword.dirty
        );
    }

    form: FormState<{
        oldPassword: InputFieldState<string>;
        newPasswordForm: FormState<{
            newPassword: InputFieldState<string>;
            passwordConfirmation: InputFieldState<string>;
        }>;
    }>;

    constructor(
        @inject(ELibraryApi) private readonly api: ELibraryApi,
        @inject(AccountStore) private readonly accountStore: AccountStore
    ) {
        makeObservable(this);

        this.form = new FormState({
            oldPassword: new InputFieldState('').validators(
                (value: string) => FormValidators.required(value) && 'Դաշտը պարտադիր է'
            ),
            newPasswordForm: new FormState({
                newPassword: new InputFieldState('').validators(
                    (value: string) => FormValidators.required(value) && 'Դաշտը պարտադիր է',
                    (value: string) =>
                        !FormValidators.passwordIsValidFormat(value) &&
                        'Ձեր գաղտնաբառը պիտի բաղկացած լինի նվազագույնը 8 սիմվոլից և պարունակի գոնե 1 թվանշան, փոքրատառ և մեծատառ'
                ),
                passwordConfirmation: new InputFieldState('').validators(
                    (value: string) => FormValidators.required(value) && 'Դաշտը պարտադիր է',
                    (value: string) =>
                        !FormValidators.passwordIsValidFormat(value) &&
                        'Ձեր գաղտնաբառը պիտի բաղկացած լինի նվազագույնը 8 սիմվոլից և պարունակի գոնե 1 թվանշան, փոքրատառ և մեծատառ'
                ),
            })
                .compose()
                .validators(
                    ({ newPassword, passwordConfirmation }) =>
                        newPassword.value !== passwordConfirmation.value &&
                        'Գաղտնաբառերը տարբերվում են'
                ),
        }).compose();
        this.form.disableAutoValidation();
    }

    handleChangePassword = async () => {
        if (!this.isDirty) {
            return false;
        }

        this.setChangePasswordStatus(LoadStatus.Loading);
        const res = await this.form.enableAutoValidationAndValidate();
        this.form.$.newPasswordForm.enableAutoValidation();
        if (res.hasError) {
            this.setChangePasswordStatus(LoadStatus.Ok);
            return false;
        }

        // const newPassword = this.form.$.newPasswordForm.$.newPassword.value;
        try {
            // await this.api.changePassword(newPassword);
            this.setChangePasswordStatus(LoadStatus.Ok);
            this.accountStore.setModalOpen(false);
        } catch {
            this.setChangePasswordStatus(LoadStatus.Error);
            commitFormState(this.form);
        }
    };

    @action private setChangePasswordStatus = (status: LoadStatus) =>
        (this.changePasswordStatus = status);
}
