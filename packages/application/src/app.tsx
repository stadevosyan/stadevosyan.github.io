import { FC, StrictMode } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';

import { BodyText, Stack } from '@servicetitan/design-system';

import * as Styles from './app.module.css';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { AuthApi } from './modules/common/api/auth.api';
import { AuthStore } from './modules/common/stores/auth.store';
import { observer } from 'mobx-react';
import { AuthRouter } from './modules/auth/components/auth-router';

export const App = provide({ singletons: [AuthApi, AuthStore] })(
    observer(() => {
        const [{ isAuthenticated }] = useDependencies(AuthStore);

        return (
            <StrictMode>
                <HashRouter>
                    <Stack className={Styles.app}>
                        {!isAuthenticated ? (
                            <AuthRouter />
                        ) : (
                            <Stack.Item fill className="d-f flex-column of-auto">
                                <Switch>
                                    <Route path="/users" component={ManageUsers} />
                                    <Route path="/news-feed" component={NewsFeed} />

                                    <Redirect from="/*" to="/users" />
                                </Switch>
                            </Stack.Item>
                        )}
                    </Stack>
                </HashRouter>
            </StrictMode>
        );
    })
);

const ManageUsers: FC = () => {
    return <BodyText>Manage Users</BodyText>;
};

const NewsFeed: FC = () => {
    return <BodyText>Manage Users</BodyText>;
};
