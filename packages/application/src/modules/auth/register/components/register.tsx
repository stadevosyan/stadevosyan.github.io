import { FC } from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import { provide, useDependencies } from '@servicetitan/react-ioc';

import { Form, ButtonGroup, Button, Page, Headline, Divider } from '@servicetitan/design-system';

import { Label } from '@servicetitan/form';
import { BackTo } from '../../components/back-to/back-to';
import { AuthPaths } from '../../../common/utils/paths';
import { observer } from 'mobx-react';
import * as Styles from './register.module.less';
import { RegisterStore } from '../../stores/register.store';

export const Register: FC<RouteComponentProps> = provide({ singletons: [RegisterStore] })(
    observer(() => {
        const [registerStore] = useDependencies(RegisterStore);

        const {
            form: {
                $: { fullName, email, password, phone },
            },
        } = registerStore;

        return (
            <Page maxWidth="narrow" footer={<Footer />}>
                <div className={Styles.backToSection}>
                    <BackTo />
                </div>
                <Headline el="div" className="m-b-4" size="large">
                    Ստեղծել նոր հաշիվ
                </Headline>

                <Divider spacing="5" />

                <Form className={Styles.form}>
                    {/* image upload here*/}

                    <Form.Input
                        label={<Label label="Անուն Ազգանուն" hasError={fullName.hasError} />}
                        value={fullName.value}
                        onChange={fullName.onChangeHandler}
                        error={fullName.error}
                    />

                    <Form.Input
                        label={<Label label="Էլեկտրոնային հասցե" hasError={email.hasError} />}
                        value={email.value}
                        onChange={email.onChangeHandler}
                        error={email.error}
                    />

                    <Form.Input
                        label={<Label label="Հեռախոսահամար" hasError={phone.hasError} />}
                        value={phone.value}
                        onChange={phone.onChangeHandler}
                        error={phone.error}
                    />

                    <Form.Input
                        label={<Label label="Ստեղծել գաղտնաբառ" hasError={password.hasError} />}
                        value={password.value}
                        onChange={password.onChangeHandler}
                        error={password.error}
                        type="password"
                    />
                </Form>
            </Page>
        );
    })
);

const Footer = () => {
    const [registerStore] = useDependencies(RegisterStore);

    const history = useHistory();

    const handleSubmit = async () => {
        const isSuccessful = await registerStore.register();

        if (isSuccessful) {
            history.push(AuthPaths.login);
        }
    };

    return (
        <div className="m-l-auto">
            <ButtonGroup>
                <Button small color="grey" href={AuthPaths.login}>
                    Չեղարկել
                </Button>
                <Button small primary onClick={handleSubmit}>
                    Ստեղծել հաշիվ
                </Button>
            </ButtonGroup>
        </div>
    );
};
