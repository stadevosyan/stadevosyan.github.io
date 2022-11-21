import {
    BodyText,
    Button,
    ButtonGroup,
    Headline,
    Stack,
    Tab,
    TabGroup,
} from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';
import { BookHistory } from './book-history';
import { BookSummary } from './book-summary';
import { FilePickerStore } from '../../../common/stores/file-picker.store';
import { useHistory, useParams } from 'react-router-dom';
import { Fragment, useEffect } from 'react';
import { LoadStatus } from '../../../common/enums/load-status';

export const BookDetails = provide({ singletons: [FilePickerStore] })(
    observer(() => {
        const [
            { setActiveTab, activeTab, initDetails, selectedBook, updateBook, loading, resetForm },
        ] = useDependencies(BooksStore);
        const params = useParams<{ id: string }>();
        const history = useHistory();

        useEffect(() => {
            initDetails(+params.id);
        }, [initDetails, params.id]);

        return (
            <Stack direction="column" className="filters p-b-3">
                <Stack direction="column" className="p-b-3">
                    <Stack direction="column" className="bg-white p-3 p-b-0">
                        <Stack direction="column">
                            <BodyText onClick={history.goBack} className="cursor-pointer m-b-3">
                                ← Վերադառնալ նախորդ էջ
                            </BodyText>
                            <Stack justifyContent="space-between">
                                <Headline className="m-b-2 t-truncate" size="large">
                                    {selectedBook?.title}
                                </Headline>
                                <ButtonGroup>
                                    {activeTab === 0 && (
                                        <Fragment>
                                            <Button onClick={resetForm}>Չեղարկել</Button>
                                            <Button
                                                primary
                                                loading={loading === LoadStatus.Loading}
                                                onClick={updateBook}
                                            >
                                                Պահպանել
                                            </Button>
                                        </Fragment>
                                    )}
                                </ButtonGroup>
                            </Stack>

                            <BodyText className="m-b-2 t-truncate" size="medium">
                                {selectedBook?.author}
                            </BodyText>
                        </Stack>
                        <Stack alignItems="center">
                            <TabGroup className="w-100">
                                <Tab onClick={() => setActiveTab(0)} active={activeTab === 0}>
                                    Գրքի տվյալներ
                                </Tab>
                                <Tab onClick={() => setActiveTab(1)} active={activeTab === 1}>
                                    Հասանելիության պատմություն
                                </Tab>
                            </TabGroup>
                        </Stack>
                    </Stack>
                    <Stack className="p-3">
                        {activeTab === 0 && <BookSummary />}
                        {activeTab === 1 && <BookHistory />}
                    </Stack>
                </Stack>
            </Stack>
        );
    })
);
