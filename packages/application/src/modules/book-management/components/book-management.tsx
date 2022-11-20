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
import { SyntheticEvent } from 'react';

export const BookManagement = provide({ singletons: [NewBookStore, FilePickerStore] })(
    observer(() => {
        const [newBookStore, bookStore, authStore] = useDependencies(
            NewBookStore,
            BooksStore,
            AuthStore
        );
        const history = useHistory();

        const handleSelectBook = async (data: any) => {
            await bookStore.handleSelect(data); // process logic
            history.push(`/book/${3}`);
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
                    <Stack justifyContent="space-between" alignItems="center">
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

                        <Button primary onClick={newBookStore.handleOpen}>
                            + Ավելացնել գիրք
                        </Button>
                    </Stack>
                </Stack>
                {authStore.isAdmin && (
                    <Stack className={Styles.bookList} direction="column" spacing={2}>
                        {bookStore.books.map(book => (
                            <BookCardExpanded
                                name={book.title}
                                author={book.author}
                                imgUrl={book.pictureUrl}
                                onClick={handleSelectBook}
                                key={book.id}
                            />
                        ))}
                    </Stack>
                )}
                {authStore.isUser && (
                    <Stack wrap="wrap" className={Styles.bookList} spacing={2}>
                        {bookStore.books.map(book => (
                            <Stack.Item key={book.id}>
                                <BookCard
                                    name={book.title}
                                    author={book.author}
                                    imgUrl={book.pictureUrl}
                                    onClick={handleSelectBook}
                                />
                            </Stack.Item>
                        ))}
                    </Stack>
                )}
                <NewBookTakeover />
                <FilterDrawer />
            </Stack>
        );
    })
);
