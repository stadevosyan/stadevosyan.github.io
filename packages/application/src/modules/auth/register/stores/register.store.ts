import { injectable, inject } from '@servicetitan/react-ioc';

import { FormState } from 'formstate';
import {
    InputFieldState,
    DropdownFieldState,
    formStateToJS,
    FormValidators,
} from '@servicetitan/form';

import { AuthApi, UserRole } from '../../../common/api/auth.api';

@injectable()
export class RegisterStore {
    form = new FormState({
        login: new InputFieldState('')
            .validators(
                (value: string) => FormValidators.required(value) && 'Login is required',
                async (value: string) => {
                    const isInUse = (await this.authApi.isLoginInUse(value)).data;

                    return isInUse && 'Login is already taken';
                }
            )
            .disableAutoValidation(),
        passwords: new FormState({
            password: new InputFieldState('')
                .validators(
                    (value: string) =>
                        !FormValidators.passwordIsValidFormat(value) &&
                        'Your password must be at least 8 characters long including a number, a lowercase letter and a uppercase letter.'
                )
                .disableAutoValidation(),
            passwordConfirmation: new InputFieldState(''),
        })
            .compose()
            .validators(
                ({ password, passwordConfirmation }) =>
                    password.value !== passwordConfirmation.value && 'Passwords must match'
            ),
        role: new DropdownFieldState(UserRole.Student),
    });

    constructor(@inject(AuthApi) private readonly authApi: AuthApi) {}

    async register() {
        const res = await this.form.validate();
        if (res.hasError) {
            return false;
        }

        const {
            login,
            passwords: { password },
            role,
        } = formStateToJS(this.form);
        const user = await this.authApi.register({
            login,
            password,
            role,
            id: 0,
        });

        return !!user;
    }
}
