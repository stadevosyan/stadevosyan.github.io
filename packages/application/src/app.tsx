import { StrictMode } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { Stack } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';

import { BASE_URL_TOKEN_ELibraryApi, ELibraryApi } from './modules/common/api/e-library.client';
import { AuthStore } from './modules/common/stores/auth.store';
import { AuthRouter } from './modules/auth/components/auth-router';
import { MainWrapper } from './modules/common/components/main-wrapper/main-wrapper';
import { BookManagement } from './modules/book-management/components/book-management';
import { BookDetails } from './modules/book-management/components/book-details/book-details';
import { BooksStore } from './modules/book-management/stores/books.store';
import { Account } from './modules/account/components/account';
import { Contacts } from './modules/contacts/components/contacts';

import * as Styles from './app.module.css';

const isProd = process.env.NODE_ENV === 'production';
const url = isProd ? 'https://mcm-qa-env-api.st.dev' : 'http://localhost:3000';

export const App = provide({
    singletons: [
        ELibraryApi,
        AuthStore,
        BooksStore,
        {
            provide: BASE_URL_TOKEN_ELibraryApi,
            useValue: url,
        },
    ],
})(
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
