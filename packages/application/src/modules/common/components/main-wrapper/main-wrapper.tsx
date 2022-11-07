import {
    Avatar,
    BodyText,
    Icon,
    Layout,
    Page,
    Sidebar,
    SideNav,
    Stack,
} from '@servicetitan/design-system';
import { FC, useCallback } from 'react';
import { Link, matchPath, useHistory } from 'react-router-dom';

import * as Styles from './main-wrapper.module.less';

export const MainWrapper: FC = ({ children }) => {
    const history = useHistory();

    const isActive = useCallback(
        path => {
            return !!matchPath(history.location.pathname, { path, exact: true });
        },
        [history.location.pathname]
    );

    return (
        <Page
            maxWidth="wide"
            style={{ height: '100%' }}
            className={Styles.mainRoot}
            actionToolbar={{
                sticky: true,
                content: (
                    <Stack style={{ flex: 1 }} justifyContent="space-between">
                        <Stack.Item>{/*  */}</Stack.Item>
                        <Stack justifyContent="center" alignItems="center">
                            <Avatar name="ԹՀ" autoColor />
                            <BodyText className="p-l-1 t-truncate" size="medium">
                                Թամարա Հարությունյան
                            </BodyText>
                        </Stack>
                    </Stack>
                ),
            }}
            sidebar={
                <Sidebar localStorageKey="">
                    <Icon iconName="odometer" />
                    <Sidebar.Section>
                        <SideNav>
                            <Link to="/">
                                <SideNav.Item active={isActive('/')}>
                                    <Icon name="access_alarms" className="m-r-1" />
                                    Բոլոր գրքերը
                                </SideNav.Item>
                            </Link>
                            <Link to="/contacts">
                                {' '}
                                <SideNav.Item active={isActive('/contacts')}>
                                    <Icon name="library_books" className="m-r-1" />
                                    Կոնտակտներ{' '}
                                </SideNav.Item>
                            </Link>
                        </SideNav>
                    </Sidebar.Section>
                    <Sidebar.Section>
                        <SideNav>
                            <Link to="/account">
                                <SideNav.Item active={isActive('/account')}>
                                    <Icon name="person_outline" className="m-r-1" />
                                    Իմ հաշիվը
                                </SideNav.Item>
                            </Link>
                        </SideNav>
                    </Sidebar.Section>
                </Sidebar>
            }
        >
            <Layout>{children}</Layout>
        </Page>
    );
};
