import { Form, Headline, Stack } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { useHistory, useParams } from 'react-router-dom';
import { SyntheticEvent, useEffect } from 'react';
import * as Styles from '../../book-management/components/book-managment.module.less';
import { BookCardExpanded } from '../../common/components/book-card-expanded/book-card-expanded';
import { OwnBooksStore } from '../stores/own-books.store';
import { BookModel } from '../../common/api/e-library.client';

export const OwnBooks = provide({ singletons: [OwnBooksStore] })(
    observer(() => {
        const [{ searchDebounced, searchForm, count, booksToShow, init }] =
            useDependencies(OwnBooksStore);
        const history = useHistory();

        const params = useParams<{ id: string }>();
        useEffect(() => {
            init(+params.id);
        }, [init, params]);

        const handleSelectBook = (data: any) => {
            history.push(`/user/${data.id}`);
        };

        const handleCustomSearch = (
            event: SyntheticEvent<HTMLInputElement>,
            data: { value: string }
        ) => {
            searchForm.$.search.onChangeHandler(event, data);
            searchDebounced();
        };

        return (
            <Stack direction="column" className="p-3">
                <Stack direction="column" className="filters p-b-3">
                    <Stack>
                        <Headline className="m-b-2 t-truncate" size="large">
                            {`Իմ գրքերը (${count})`}
                        </Headline>
                    </Stack>
                    <Stack justifyContent="space-between" alignItems="center">
                        <Stack alignItems="center">
                            <Form.Input
                                style={{ width: '354px' }}
                                value={searchForm.$.search.value}
                                onChange={handleCustomSearch}
                                className="m-b-0 p-r-2"
                                placeholder="Որոնել գրքեր"
                            />
                        </Stack>
                    </Stack>
                </Stack>
                <Stack className={Styles.bookList} direction="column" spacing={2}>
                    {booksToShow.map((book: BookModel) => (
                        <BookCardExpanded
                            id={book.id}
                            name={book.title}
                            author={book.author}
                            imgUrl={book.pictureUrl}
                            onClick={handleSelectBook}
                            key={book.id}
                        />
                    ))}
                </Stack>
            </Stack>
        );
    })
);
