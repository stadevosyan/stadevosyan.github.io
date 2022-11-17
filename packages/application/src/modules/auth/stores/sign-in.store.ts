import { inject, injectable } from '@servicetitan/react-ioc';

import { action, computed, makeObservable, observable } from 'mobx';

import { FormState } from 'formstate';

import {
    commitFormState,
    formStateToJS,
    FormValidators,
    InputFieldState,
} from '@servicetitan/form';
import { AuthStore } from '../../common/stores/auth.store';
import { LoadStatus } from '../../common/enums/load-status';
import { ELibraryApi, LoginUserDto } from '../../common/api/e-library.client';

@injectable()
export class SignInStore {
    @observable error?: string;
    @observable loginStatus = LoadStatus.None;

    form = new FormState({
        email: new InputFieldState('').validators(FormValidators.required),
        password: new InputFieldState('').validators(FormValidators.required),
    });

    @computed
    get isDirty() {
        const {
            $: { email, password },
        } = this.form;
        return !!email.dirty || password.dirty;
    }

    constructor(
        @inject(ELibraryApi) private readonly api: ELibraryApi,
        @inject(AuthStore) private readonly authStore: AuthStore
    ) {
        makeObservable(this);
    }

    // TODO understand why to return is authenticated
    login = async () => {
        if (!this.isDirty) {
            return;
        }

        this.setError('');
        this.setLoginStatus(LoadStatus.Loading);
        const res = await this.form.validate();
        if (res.hasError) {
            this.setLoginStatus(LoadStatus.Error);
            return false;
        }
        commitFormState(this.form);

        const { password, email } = formStateToJS(this.form);
        const user = {
            email,
            password,
        } as LoginUserDto;

        try {
            await this.authStore.login(user);

            this.setLoginStatus(LoadStatus.Ok);
        } catch (e) {
            this.setLoginStatus(LoadStatus.Error);
            this.setError('Սխալ էլեկտրոնային հասցե կամ ծածկագիր');
        }
    };

    @action private setLoginStatus = (status: LoadStatus) => (this.loginStatus = status);

    @action private setError(error: string | undefined) {
        this.error = error;
    }
}
