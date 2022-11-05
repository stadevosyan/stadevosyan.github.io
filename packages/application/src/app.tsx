import { StrictMode } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Stack } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';

import { AuthApi } from './modules/common/api/auth.api';
import { AuthStore } from './modules/common/stores/auth.store';
import { AuthRouter } from './modules/auth/components/auth-router';
import { MainWrapper } from './modules/common/components/main-wrapper/main-wrapper';
import { BookManagement } from './modules/book-management/components/book-management';
import { BookDetails } from './modules/book-management/components/book-details/book-details';
import { BooksStore } from './modules/book-management/stores/books.store';
import { Account } from './modules/account/components/account';
import { Contacts } from './modules/contacts/components/contacts';

import * as Styles from './app.module.css';

export const App = provide({ singletons: [AuthApi, AuthStore, BooksStore] })(
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
                                    <Route path="/" exact component={BookManagement} />
                                    <Route path="/book/:id" exact component={BookDetails} />
                                    <Route path="/account" exact component={Account} />
                                    <Route path="/contacts" exact component={Contacts} />

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
