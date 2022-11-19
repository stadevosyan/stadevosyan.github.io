import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { AuthStore } from '../../common/stores/auth.store';
import { FormState } from 'formstate';
import {
    commitFormState,
    FormValidators,
    InputFieldState,
    setFormStateValues,
} from '@servicetitan/form';

@injectable()
export class AccountStore {
    @observable accountUpdateStatus = LoadStatus.None;
    @observable changePasswordStatus = LoadStatus.None;

    @computed get isDirty() {
        return (
            !!this.form.$.name.dirty || !!this.form.$.email.dirty || !!this.form.$.phoneNumber.dirty
        );
    }

    @computed get user() {
        return this.authStore.user;
    }

    form: FormState<{
        name: InputFieldState<string>;
        email: InputFieldState<string>;
        phoneNumber: InputFieldState<string>;
    }>;

    constructor(@inject(AuthStore) private readonly authStore: AuthStore) {
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
        });
    }

    resetForm = () => {
        setFormStateValues(this.form, {
            email: this.user?.email,
            phoneNumber: this.user?.phoneNumber,
            name: this.user?.name,
        });
        commitFormState(this.form);
    };

    handleAccountUpdate = () => {};

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
