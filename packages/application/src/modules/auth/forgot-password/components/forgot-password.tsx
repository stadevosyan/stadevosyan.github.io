import { BodyText, Button, ButtonGroup, Form, Headline, Page } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { Label } from '@servicetitan/form';
import { ForgotPasswordStore } from '../../stores/forgot-password.store';
import { AuthPaths } from '../../../common/utils/paths';
import { useHistory } from 'react-router-dom';
import * as Styles from './forgot-password.module.less';
import { BackTo } from '../../../common/components/back-to/back-to';

export const ForgotPassword = provide({ singletons: [ForgotPasswordStore] })(
    observer(() => {
        const [{ form, requestPasswordReset }] = useDependencies(ForgotPasswordStore);

        const {
            $: { email },
        } = form;

        const history = useHistory();
        const handleSubmit = async () => {
            const isSuccessful = await requestPasswordReset();

            if (isSuccessful) {
                history.push(AuthPaths.login);
            }
        };

        return (
            <Page maxWidth="narrow" className={Styles.page}>
                <div className={Styles.backToSection}>
                    <BackTo />
                </div>
                <Headline el="div" className="m-b-4" size="large">
                    Վերականգնել գաղտնաբառը
                </Headline>

                <Form>
                    <Form.Input
                        label={<Label label="Էլեկտրոնային հասցե" hasError={email.hasError} />}
                        value={email.value}
                        onChange={email.onChangeHandler}
                        error={email.error}
                    />
                </Form>
                <ButtonGroup fullWidth className="m-t-3">
                    <Button full primary onClick={handleSubmit}>
                        Մուտք գործել
                    </Button>
                </ButtonGroup>

                <BodyText italic size="large" className="m-t-5">
                    under construction...
                </BodyText>
                <BodyText italic size="large">
                    sorry for inconveniense
                </BodyText>
            </Page>
        );
    })
);
