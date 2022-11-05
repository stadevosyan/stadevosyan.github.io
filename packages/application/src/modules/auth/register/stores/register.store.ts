import { inject, injectable } from '@servicetitan/react-ioc';

import { FormState } from 'formstate';
import { formStateToJS, FormValidators, InputFieldState } from '@servicetitan/form';

import { AuthApi, UserRole } from '../../../common/api/auth.api';

@injectable()
export class RegisterStore {
    form: FormState<{
        fullName: InputFieldState<string>;
        password: InputFieldState<string>;
        email: InputFieldState<string>;
        phone: InputFieldState<string>;
    }>;

    constructor(@inject(AuthApi) private readonly authApi: AuthApi) {
        this.form = new FormState({
            fullName: new InputFieldState('')
                .validators((value: string) => FormValidators.required(value) && 'Դաշտը պարտադիր է')
                .disableAutoValidation(),

            email: new InputFieldState('').validators(
                (value: string) =>
                    !FormValidators.emailFormatIsValid(value) && 'Նշեք վավեր էլեկտրոնային հասցե'
            ),
            phone: new InputFieldState('').validators(
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
        (error = 'Անվավեր հեռաղոսահամար') =>
        (value: string) =>
            FormValidators.isMatchingRegex(
                /^(\+374|00374|0)?\d{8}$/,
                'Հեռախոսահամար'
            )(value.trim()) && error;

    async register() {
        const res = await this.form.validate();
        if (res.hasError) {
            return false;
        }

        const { fullName, phone, password, email } = formStateToJS(this.form);
        const user = await this.authApi.register({
            fullName,
            password,
            email,
            phone,
            id: 0,
            role: UserRole.Student,
        });

        return !!user;
    }
}
