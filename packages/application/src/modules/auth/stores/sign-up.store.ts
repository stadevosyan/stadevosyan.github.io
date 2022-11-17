import { inject, injectable } from '@servicetitan/react-ioc';

import { FormState } from 'formstate';
import { formStateToJS, FormValidators, InputFieldState } from '@servicetitan/form';
import { CreateUserDto, ELibraryApi } from '../../common/api/e-library.client';
import { action, makeObservable, observable } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';

@injectable()
export class SignUpStore {
    @observable registerStatus = LoadStatus.None;

    form: FormState<{
        name: InputFieldState<string>;
        password: InputFieldState<string>;
        email: InputFieldState<string>;
        phoneNumber: InputFieldState<string>;
    }>;

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
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
        (error = 'Անվավեր հեռաղոսահամար') =>
        (value: string) =>
            FormValidators.isMatchingRegex(
                /^(\+374|00374|0)?\d{8}$/,
                'Հեռախոսահամար'
            )(value.trim()) && error;

    async register() {
        this.setRegisterStatus(LoadStatus.Loading);
        const res = await this.form.validate();
        if (res.hasError) {
            this.setRegisterStatus(LoadStatus.Ok);
            return false;
        }

        const { name, phoneNumber, password, email } = formStateToJS(this.form);

        try {
            await this.api.authController_signUpUser({
                name,
                password,
                email,
                phoneNumber,
            } as CreateUserDto);

            this.setRegisterStatus(LoadStatus.Ok);

            return true;
        } catch {
            this.setRegisterStatus(LoadStatus.Error);
        }
    }

    @action private setRegisterStatus = (status: LoadStatus) => (this.registerStatus = status);
}
