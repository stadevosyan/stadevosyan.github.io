import { Button, Form, Headline, Stack, ToggleSwitch } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';

import { BookCard } from '../../common/components/book-card/book-card';
import { NewBookTakeover } from './new-book-takeover';
import { NewBookStore } from '../stores/new-book.store';
import { BooksStore } from '../stores/books.store';

import * as Styles from './book-managment.module.less';

export const BookManagement = provide({ singletons: [NewBookStore] })(
    observer(() => {
        const [newBookStore, bookStore] = useDependencies(NewBookStore, BooksStore);
        const history = useHistory();

        const handleSelectBook = async (data: any) => {
            await bookStore.handleSelect(data); // process logic
            history.push(`/book/${3}`);
        };

        return (
            <Stack direction="column" className="p-3">
                <Stack direction="column" className="filters p-b-3">
                    <Stack>
                        <Headline className="m-b-2 t-truncate" size="large">
                            Բոլոր գրքերը (120)
                        </Headline>
                    </Stack>
                    <Stack justifyContent="space-between" alignItems="center">
                        <Stack alignItems="center">
                            <Form.Input
                                style={{ width: '354px' }}
                                className="m-b-0 p-r-2"
                                placeholder="Որոնել գրքեր"
                            />
                            <ToggleSwitch
                                checked
                                label="Տեսնել միայն հասանելի գրքերը"
                                name="Toggle1"
                                onChange={() => {}}
                            />
                        </Stack>

                        <Button primary onClick={newBookStore.handleOpen}>
                            + Ավելացնել գիրք
                        </Button>
                    </Stack>
                </Stack>
                {/* <Placeholder text="Բարի գալուստ " />*/}
                <Stack wrap="wrap" className={Styles.bookList} spacing={2}>
                    {[...Array.from(Array(30).keys())].map(e => (
                        <Stack.Item key={e}>
                            <BookCard onClick={handleSelectBook} />
                        </Stack.Item>
                    ))}
                </Stack>
                <NewBookTakeover />
            </Stack>
        );
    })
);
