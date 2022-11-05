import { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { BodyText, Link, Page, Stack } from '@servicetitan/design-system';

import * as Styles from './login.module.less';
import { LogoSection } from './logo-section';
import { LoginForm } from './login-form';
import { AuthPaths } from '../../../common/utils/paths';

export const Login: FC<RouteComponentProps> = () => {
    return (
        <Page maxWidth="default" className={Styles.loginPage}>
            <Stack direction="row" className="h-100">
                <div className={Styles.loginSectionContainer}>
                    <LogoSection />
                    <LoginForm />
                    <BodyText size="medium" className="m-t-6">
                        Եթե դեռ գրանցված չեք համակարգում,{' '}
                        <Link href={'#' + AuthPaths.register} className="fw-bold" primary text>
                            ստեղծեք նոր հաշիվ&nbsp;→
                        </Link>
                    </BodyText>
                </div>
                <div className={Styles.loginRightArea} />
            </Stack>
        </Page>
    );
};
