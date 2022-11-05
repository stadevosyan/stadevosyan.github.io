import { StrictMode } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';

import { Stack } from '@servicetitan/design-system';

import { provide, useDependencies } from '@servicetitan/react-ioc';
import { AuthApi } from './modules/common/api/auth.api';
import { AuthStore } from './modules/common/stores/auth.store';
import { observer } from 'mobx-react';
import { AuthRouter } from './modules/auth/components/auth-router';
import { MainWrapper } from './modules/common/components/main-wrapper/main-wrapper';
import { User } from './modules/sections/user/user';
import { Admin } from './modules/sections/admin/admin';

import * as Styles from './app.module.css';
import { BookDetails } from './modules/sections/book-details/book-details';

export const App = provide({ singletons: [AuthApi, AuthStore] })(
    observer(() => {
        const [{ isAuthenticated }] = useDependencies(AuthStore);

        return (
            <StrictMode>
                <BrowserRouter>
                    <Stack className={Styles.app}>
                        {!isAuthenticated ? (
                            <AuthRouter />
                        ) : (
                            <MainWrapper>
                                <Switch>
                                    <Route path="/users" component={User} />
                                    <Route path="/admin" component={Admin} />
                                    <Route path="/book/:id" exact component={BookDetails} />

                                    <Redirect from="/*" to="/users" />
                                </Switch>
                            </MainWrapper>
                        )}
                    </Stack>
                </BrowserRouter>
            </StrictMode>
        );
    })
);
