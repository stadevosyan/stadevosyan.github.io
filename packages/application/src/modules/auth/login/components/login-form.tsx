import { FC } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useDependencies, provide } from '@servicetitan/react-ioc';

import { observer } from 'mobx-react';

import { Form, ButtonGroup, Button, Banner, Headline } from '@servicetitan/design-system';

import { LoginStore } from '../stores/login.store';

import * as Styles from './login.module.less';
import { AuthPaths } from '../../../common/utils/paths';

export const LoginForm: FC = provide({ singletons: [LoginStore] })(
    observer(() => {
        const [loginStore] = useDependencies(LoginStore);

        const history = useHistory();

        const { form, isDirty, error } = loginStore;
        const {
            $: { login, password },
        } = form;

        const handleSubmit = async () => {
            const isSuccessful = await loginStore.login();

            if (isSuccessful) {
                history.push('/');
            }
        };

        return (
            <Form onSubmit={handleSubmit} className="m-t-8">
                <Headline el="div" className="m-b-4" size="large">
                    Մուտք գործել
                </Headline>

                {error && <Banner status="critical" title={error} className="m-b-3" />}

                <Form.Input
                    label="Էլեկտրոնային հասցե"
                    value={login.value}
                    onChange={login.onChangeHandler}
                    error={login.hasError}
                />

                <Form.Input
                    label="Ծածկագիր"
                    value={password.value}
                    onChange={password.onChangeHandler}
                    error={password.hasError}
                    type="password"
                    className={Styles.passwordField}
                />
                <Link to={AuthPaths.forgotPassword} className="fw-bold">
                    Մոռացել եմ գաղտնաբառը
                </Link>

                <ButtonGroup fullWidth className="m-t-3">
                    <Button full primary type="submit" disabled={!isDirty || form.hasError}>
                        Մուտք գործել
                    </Button>
                </ButtonGroup>
            </Form>
        );
    })
);
