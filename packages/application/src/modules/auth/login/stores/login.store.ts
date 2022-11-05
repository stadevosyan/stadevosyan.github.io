import { injectable, inject } from '@servicetitan/react-ioc';

import { makeObservable, observable, action, computed } from 'mobx';

import { FormState } from 'formstate';

import { AuthStore } from '../../../common/stores/auth.store';
import { formStateToJS, FormValidators, InputFieldState } from '@servicetitan/form';

@injectable()
export class LoginStore {
    @observable error?: string;

    form = new FormState({
        login: new InputFieldState('').validators(FormValidators.required),
        password: new InputFieldState('').validators(FormValidators.required),
    });

    @computed
    get isDirty() {
        const {
            $: { login, password },
        } = this.form;
        return login.dirty && password.dirty;
    }

    constructor(@inject(AuthStore) private readonly authStore: AuthStore) {
        makeObservable(this);
    }

    async login() {
        const res = await this.form.validate();
        if (res.hasError) {
            return false;
        }

        await this.authStore.login(formStateToJS(this.form));

        this.setError(
            !this.authStore.isAuthenticated ? 'Սխալ էլեկտրոնային հասցե կամ ծածկագիր' : undefined
        );

        return this.authStore.isAuthenticated;
    }

    @action
    private setError(error: string | undefined) {
        this.error = error;
    }
}
