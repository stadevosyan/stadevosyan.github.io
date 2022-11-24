import { BodyText, Form, Headline, Stack, Tag } from '@servicetitan/design-system';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import * as Styles from '../../book-management/components/book-managment.module.less';
import { BookCardExpanded } from '../../common/components/book-card-expanded/book-card-expanded';
import { IBookHistory, OwnBooksStore } from '../stores/own-books.store';
import { LoadStatus } from '../../common/enums/load-status';
import { CenteredSpinner } from '../../common/components/centered-spinner/centered-spinner';
import { SomethingWentWrong } from '../../common/components/something-went-wrong/something-went-wrong';

export const OwnBooks = provide({ singletons: [OwnBooksStore] })(
    observer(() => {
        const [{ searchForm, count, booksToShow, booksHistory, loadingOwnBooksStatus }] =
            useDependencies(OwnBooksStore);
        const history = useHistory();

        const handleSelectBook = (data: any) => {
            history.push(`/user/${data.id}`);
        };

        const noBooks = booksHistory.length === 0 && loadingOwnBooksStatus === LoadStatus.Ok;

        if (loadingOwnBooksStatus === LoadStatus.Error) {
            return <SomethingWentWrong />;
        }

        return (
            <Stack direction="column" className="p-3" style={{ height: 'calc(100% - 80px)' }}>
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
                                onChange={searchForm.$.search.onChangeHandler}
                                className="m-b-0 p-r-2"
                                placeholder="Որոնել գրքեր"
                                disabled={loadingOwnBooksStatus === LoadStatus.Loading || noBooks}
                            />
                        </Stack>
                    </Stack>
                </Stack>
                {noBooks ? (
                    <EmptyBooksPlaceholder />
                ) : loadingOwnBooksStatus === LoadStatus.Loading ? (
                    <CenteredSpinner />
                ) : (
                    <Stack className={Styles.bookList} direction="column" spacing={2}>
                        {booksToShow.map((item: IBookHistory) => {
                            const tagToShow = item.isReading ? (
                                <Tag>Կարդում եմ</Tag>
                            ) : (
                                <Tag color="success" subtle>
                                    Կարդացել եմ
                                </Tag>
                            );

                            return (
                                <BookCardExpanded
                                    id={item.id}
                                    name={item.book.title}
                                    author={item.book.author}
                                    imgUrl={item.book.pictureUrl}
                                    onClick={handleSelectBook}
                                    key={item.id}
                                    tagToShow={tagToShow}
                                />
                            );
                        })}
                    </Stack>
                )}
            </Stack>
        );
    })
);

const EmptyBooksPlaceholder = () => (
    <Stack alignItems="center" justifyContent="center" className="h-100">
        <Stack
            direction="column"
            spacing={1}
            style={{ height: '400px', width: '300px' }}
            justifyContent="center"
        >
            <img src={require('../../common/assets/no-data-3.png')} />
            <BodyText className="ta-center m-t-2-i">Ես դեռ չունեմ վարձակալած գրքեր</BodyText>
        </Stack>
    </Stack>
);
