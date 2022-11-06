import { inject, injectable } from '@servicetitan/react-ioc';
import { FormState } from 'formstate';
import { formStateToJS, FormValidators, InputFieldState } from '@servicetitan/form';
import { AuthApi } from '../../common/api/auth.api';

@injectable()
export class ForgotPasswordStore {
    form: FormState<{
        email: InputFieldState<string>;
    }>;

    constructor(@inject(AuthApi) private readonly authApi: AuthApi) {
        this.form = new FormState({
            email: new InputFieldState('').validators(
                (value: string) =>
                    !FormValidators.emailFormatIsValid(value) && 'Նշեք վավեր էլեկտրոնային հասցե'
            ),
        }).compose();
        this.form.disableAutoValidation();
    }

    requestPasswordReset = async () => {
        const res = await this.form.enableAutoValidationAndValidate();

        if (res.hasError) {
            return false;
        }

        const { email } = formStateToJS(this.form);
        const response = await this.authApi.passwordResetRequest(email);

        return !!response;
    };
}
