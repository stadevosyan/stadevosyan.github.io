import { FC } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import { BodyText, Page, Stack } from '@servicetitan/design-system';

import { LogoSection } from './logo-section';
import { LoginForm } from './login-form';
import { AuthPaths } from '../../../common/utils/paths';
import * as Styles from './login.module.less';

export const Login: FC<RouteComponentProps> = () => {
    return (
        <Page maxWidth="default" className={Styles.loginPage}>
            <Stack direction="row" className="h-100">
                <div className={Styles.loginSectionContainer}>
                    <LogoSection />
                    <LoginForm />
                    <BodyText size="medium" className="m-t-6">
                        Եթե դեռ գրանցված չեք համակարգում,{' '}
                        <Link to={AuthPaths.register} className="fw-bold">
                            ստեղծեք նոր հաշիվ&nbsp;→
                        </Link>
                    </BodyText>
                </div>
                <div className={Styles.loginRightArea} />
            </Stack>
        </Page>
    );
};
