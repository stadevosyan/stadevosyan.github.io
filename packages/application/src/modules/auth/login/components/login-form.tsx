import { FC } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useDependencies, provide } from '@servicetitan/react-ioc';

import { observer } from 'mobx-react';

import { Form, ButtonGroup, Button, Banner, Headline, Mask } from '@servicetitan/design-system';

import * as Styles from './login.module.less';
import { AuthPaths } from '../../../common/utils/paths';
import { SignInStore } from '../../stores/sign-in.store';
import { LoadStatus } from '../../../common/enums/load-status';

export const LoginForm: FC = provide({ singletons: [SignInStore] })(
    observer(() => {
        const [signInStore] = useDependencies(SignInStore);

        const history = useHistory();

        const { form, error, loginStatus } = signInStore;
        const {
            $: { email, password },
        } = form;

        const handleSubmit = async () => {
            const isSuccessful = await signInStore.login();

            if (isSuccessful) {
                history.push('/');
            }
        };

        return (
            <Mask active={loginStatus === LoadStatus.Loading}>
                <Form onSubmit={handleSubmit} className="m-t-8">
                    <Headline el="div" className="m-b-4" size="large">
                        Մուտք գործել
                    </Headline>

                    {error && <Banner status="critical" title={error} className="m-b-3" />}

                    <Form.Input
                        label="Էլեկտրոնային հասցե"
                        value={email.value}
                        onChange={email.onChangeHandler}
                        error={email.hasError}
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
                        <Button full primary type="submit">
                            Մուտք գործել
                        </Button>
                    </ButtonGroup>
                </Form>
            </Mask>
        );
    })
);
