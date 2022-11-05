import { FC } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { provide, useDependencies } from '@servicetitan/react-ioc';

import { Text, Form, Link, ButtonGroup, Button, Page } from '@servicetitan/design-system';

import { UserRole } from '../../../common/api/auth.api';

import { RegisterStore } from '../stores/register.store';

import { Label, enumToOptions } from '@servicetitan/form';
import { BackTo } from '../../components/back-to/back-to';
import { AuthPaths } from '../../../common/utils/paths';

const rolesOptions = enumToOptions(UserRole);

export const Register: FC<RouteComponentProps> = provide({ singletons: [RegisterStore] })(() => {
    const [registerStore] = useDependencies(RegisterStore);

    const {
        form: {
            $: { login, passwords, role },
        },
    } = registerStore;
    const {
        $: { password, passwordConfirmation },
    } = passwords;

    const history = useHistory();

    const handleSubmit = async () => {
        const isSuccessful = await registerStore.register();

        if (isSuccessful) {
            history.push(AuthPaths.login);
        }
    };

    return (
        <Page maxWidth="narrow">
            <BackTo />
            <Form onSubmit={handleSubmit}>
                <Text el="div" className="m-b-4 ta-center" size={4}>
                    Register
                </Text>

                <Form.Input
                    label={<Label label="Login" hasError={login.hasError} error={login.error} />}
                    value={login.value}
                    onChange={login.onChangeHandler}
                    error={login.hasError}
                />

                <Form.Input
                    label={
                        <Label
                            label="Password"
                            hasError={passwords.hasError}
                            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                            error={passwords.error || undefined}
                        />
                    }
                    value={password.value}
                    onChange={password.onChangeHandler}
                    error={passwords.hasError}
                    type="password"
                />

                <Form.Input
                    label={
                        <Label label="Password Confirmation" hasError={passwords.hasFormError} />
                    }
                    value={passwordConfirmation.value}
                    onChange={passwordConfirmation.onChangeHandler}
                    error={passwords.hasFormError}
                    type="password"
                />

                <Form.Select
                    label="Role"
                    value={role.value}
                    onChange={role.onChangeHandler}
                    options={rolesOptions}
                />

                <ButtonGroup fullWidth>
                    <Link href={'#' + AuthPaths.login} primary text className="align-self-center">
                        Sign In
                    </Link>

                    <Button full primary type="submit">
                        Create
                    </Button>
                </ButtonGroup>
            </Form>
        </Page>
    );
});
