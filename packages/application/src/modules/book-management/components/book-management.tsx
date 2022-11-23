import { Button, Form, Headline, Stack } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { BookCard } from '../../common/components/book-card/book-card';
import { NewBookTakeover } from './new-book-takover/new-book-takeover';
import { NewBookStore } from '../stores/new-book.store';
import { BooksStore } from '../stores/books.store';
import { BookCardExpanded } from '../../common/components/book-card-expanded/book-card-expanded';
import { FilterDrawer } from './filter-drawer/filter-drawer';
import { AuthStore } from '../../common/stores/auth.store';
import { FilePickerStore } from '../../common/stores/file-picker.store';

import * as Styles from './book-managment.module.less';
import { SyntheticEvent, useEffect } from 'react';
import { LoadStatus } from '../../common/enums/load-status';
import { CenteredSpinner } from '../../common/components/centered-spinner/centered-spinner';

export const BookManagement = provide({ singletons: [NewBookStore, FilePickerStore] })(
    observer(() => {
        const [newBookStore, bookStore, authStore] = useDependencies(
            NewBookStore,
            BooksStore,
            AuthStore
        );
        const history = useHistory();

        useEffect(() => {
            bookStore.init();
        }, [bookStore, bookStore.init]);

        const handleSelectBook = async (data: any) => {
            if (authStore.isAdmin) {
                await bookStore.handleSelect(data); // process logic
                history.push(`/book/${data.id}`);
            }
            if (authStore.isUser) {
                await bookStore.handleSelect(data); // process logic
                history.push(`/user/${data.id}`);
            }
        };

        const handleCustomSearch = (
            event: SyntheticEvent<HTMLInputElement>,
            data: { value: string }
        ) => {
            bookStore.searchForm.$.search.onChangeHandler(event, data);
            bookStore.searchDebounced();
        };

        return (
            <Stack direction="column" className="p-3">
                <Stack direction="column" className="filters p-b-3">
                    <Stack>
                        <Headline className="m-b-2 t-truncate" size="large">
                            {`Բոլոր գրքերը (${bookStore.count})`}
                        </Headline>
                    </Stack>
                    <Stack
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ minWidth: '800px' }}
                    >
                        <Stack alignItems="center">
                            <Form.Input
                                style={{ width: '354px' }}
                                value={bookStore.searchForm.$.search.value}
                                onChange={handleCustomSearch}
                                className="m-b-0 p-r-2"
                                placeholder="Որոնել գրքեր"
                            />
                            <Button
                                iconName="funnel"
                                primary
                                outline
                                onClick={bookStore.openFilter}
                            >
                                Ֆիլտրել
                            </Button>
                        </Stack>

                        {authStore.isAdmin && (
                            <Button primary onClick={newBookStore.handleOpen}>
                                + Ավելացնել գիրք
                            </Button>
                        )}
                    </Stack>
                </Stack>
                {bookStore.fetchBooksLoadStatus === LoadStatus.Loading ? (
                    <CenteredSpinner />
                ) : authStore.isAdmin ? (
                    <Stack
                        className={Styles.bookList}
                        direction="column"
                        spacing={2}
                        style={{ minWidth: '800px' }}
                    >
                        {bookStore.booksToShow.map(book => (
                            <BookCardExpanded
                                id={book.id}
                                name={book.title}
                                author={book.author}
                                imgUrl={book.pictureUrl}
                                onClick={handleSelectBook}
                                status={!!book.holdedUser}
                                user={book.holdedUser}
                                key={book.id}
                            />
                        ))}
                    </Stack>
                ) : (
                    <Stack wrap="wrap" className={Styles.bookList} spacing={2}>
                        {bookStore.booksToShow.map(book => (
                            <Stack.Item key={book.id}>
                                <BookCard
                                    id={book.id}
                                    name={book.title}
                                    author={book.author}
                                    imgUrl={book.pictureUrl}
                                    status={!!book.holdedUser}
                                    onClick={handleSelectBook}
                                />
                            </Stack.Item>
                        ))}
                    </Stack>
                )}
                {newBookStore.open && <NewBookTakeover />}
                <FilterDrawer />
            </Stack>
        );
    })
);
