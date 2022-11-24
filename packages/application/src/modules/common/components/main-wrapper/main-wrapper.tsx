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
import { FC, useCallback, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import * as Styles from './main-wrapper.module.less';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { AuthStore } from '../../stores/auth.store';
import { observer } from 'mobx-react';
import { getAvatarFirstLetters, urlToShow } from '../../utils/url-helpers';
import { GeneralDataStore } from '../../stores/general-data.store';

export const MainWrapper: FC = provide({ singletons: [GeneralDataStore] })(
    observer(({ children }) => {
        const [{ user }, { init: initGeneralDataStore }] = useDependencies(
            AuthStore,
            GeneralDataStore
        );
        useEffect(() => {
            initGeneralDataStore();
        }, [initGeneralDataStore]);

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
                                {!!user && (
                                    <Avatar
                                        name={getAvatarFirstLetters(user?.name)}
                                        autoColor
                                        image={urlToShow(user?.profilePictureUrl)}
                                    />
                                )}
                                <BodyText className="p-l-1 t-truncate" size="medium">
                                    {user?.name}
                                </BodyText>
                            </Stack>
                        </Stack>
                    ),
                }}
                sidebar={<MySideBar />}
            >
                <Layout>{children}</Layout>
            </Page>
        );
    })
);

const MySideBar: FC = observer(() => {
    const [{ isAdmin, isUser, logout }] = useDependencies(AuthStore);
    const [activeRoute, setActiveRoute] = useState(0);

    const history = useHistory();
    useEffect(() => {
        switch (history.location.pathname) {
            case '/':
                setActiveRoute(1);
                break;
            case '/my-books':
                setActiveRoute(2);
                break;
            case '/contacts':
                setActiveRoute(3);
                break;
            case '/account':
                setActiveRoute(4);
                break;
        }
    }, [history.location.pathname]);

    const isActive = useCallback(
        route => {
            return route === activeRoute;
        },
        [activeRoute]
    );

    return (
        <Sidebar localStorageKey="" className={Styles.sidebar}>
            <Icon iconName="odometer" />
            <Sidebar.Section>
                <SideNav>
                    <Link
                        onClick={() => {
                            setActiveRoute(1);
                        }}
                        to="/"
                    >
                        <SideNav.Item active={isActive(1)}>
                            <Icon name="import_contacts" className="m-r-1 m-b-half" />
                            Բոլոր գրքերը
                        </SideNav.Item>
                    </Link>
                    {isUser && (
                        <Link
                            to="/my-books"
                            onClick={() => {
                                setActiveRoute(2);
                            }}
                        >
                            <SideNav.Item active={isActive(2)}>
                                <Icon name="library_books" className="m-r-1 m-b-half" />
                                Իմ գրքերը
                            </SideNav.Item>
                        </Link>
                    )}
                    {isAdmin && (
                        <Link
                            to="/contacts"
                            onClick={() => {
                                setActiveRoute(3);
                            }}
                        >
                            <SideNav.Item active={isActive(3)}>
                                <Icon name="library_books" className="m-r-1" />
                                Կոնտակտներ{' '}
                            </SideNav.Item>
                        </Link>
                    )}
                </SideNav>
            </Sidebar.Section>
            <Sidebar.Section className={Styles.sidebarMainSection}>
                <SideNav className={Styles.myAccountNav}>
                    <Link
                        to="/account"
                        onClick={() => {
                            setActiveRoute(4);
                        }}
                    >
                        <SideNav.Item active={isActive(4)}>
                            <Icon name="face" className="m-r-1 m-b-half" />
                            Իմ հաշիվը
                        </SideNav.Item>
                    </Link>
                </SideNav>
                <SideNav>
                    <div onClick={logout}>
                        <SideNav.Item active>
                            <Icon name="call_missed_outgoing" className="m-r-1 m-b-half" />
                            Դուրս գալ
                        </SideNav.Item>
                    </div>
                </SideNav>
            </Sidebar.Section>
        </Sidebar>
    );
});
