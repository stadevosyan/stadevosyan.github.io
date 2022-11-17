import { FC, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useDependencies, provide } from '@servicetitan/react-ioc';

import { observer } from 'mobx-react';

import { Form, ButtonGroup, Button, Banner, Headline, Mask } from '@servicetitan/design-system';

import { AuthPaths } from '../../../common/utils/paths';
import { SignInStore } from '../../stores/sign-in.store';
import { LoadStatus } from '../../../common/enums/load-status';
import * as Styles from './login.module.less';

export const LoginForm: FC = provide({ singletons: [SignInStore] })(
    observer(() => {
        const [{ form, error, loginStatus, login }] = useDependencies(SignInStore);

        const history = useHistory();

        const {
            $: { email, password },
        } = form;

        useEffect(() => {
            if (loginStatus === LoadStatus.Ok) {
                history.push('/');
            }
        }, [loginStatus, history]);

        return (
            <Mask active={loginStatus === LoadStatus.Loading}>
                <Form onSubmit={login} className="m-t-8">
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
