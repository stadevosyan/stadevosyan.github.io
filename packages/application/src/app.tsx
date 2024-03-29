import { StrictMode } from 'react';
import { observer } from 'mobx-react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
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

import * as Styles from './app.module.css';
import { OwnBooks } from './modules/own-books/components/own-books';
import { ContactsStore } from './modules/contacts/stores/contacts.store';
import { Contacts } from './modules/contacts/components/contacts/contacts';
import { ContactDetails } from './modules/contacts/components/contact-details/contact-details';
import { UserBookDetails } from './modules/book-management/components/user-book-details/user-book-details';

const isProd = process.env.NODE_ENV === 'production';
export const baseUrl = isProd ? 'https://api.talinlibrary.am' : 'http://localhost:3000';

export const App = provide({
    singletons: [
        ELibraryApi,
        AuthStore,
        BooksStore,
        ContactsStore,
        {
            provide: BASE_URL_TOKEN_ELibraryApi,
            useValue: baseUrl,
        },
    ],
})(
    observer(() => {
        const [{ isAuthenticated, isAdmin, isUser }] = useDependencies(AuthStore);

        return (
            <StrictMode>
                <HashRouter>
                    <Stack className={Styles.app}>
                        {!isAuthenticated ? (
                            <AuthRouter />
                        ) : (
                            <MainWrapper>
                                <Switch>
                                    <Route path="/" exact component={BookManagement} />
                                    <Route path="/book/:id" exact component={BookDetails} />
                                    <Route path="/account" exact component={Account} />
                                    {isUser && (
                                        <Route path="/my-books" exact component={OwnBooks} />
                                    )}
                                    {isUser && (
                                        <Route path="/user/:id" exact component={UserBookDetails} />
                                    )}
                                    {isAdmin && (
                                        <Route path="/contacts" exact component={Contacts} />
                                    )}
                                    {isAdmin && (
                                        <Route
                                            path="/contacts/:id"
                                            exact
                                            component={ContactDetails}
                                        />
                                    )}
                                    <Redirect from="/*" to="/" />
                                </Switch>
                            </MainWrapper>
                        )}
                    </Stack>
                </HashRouter>
            </StrictMode>
        );
    })
);
