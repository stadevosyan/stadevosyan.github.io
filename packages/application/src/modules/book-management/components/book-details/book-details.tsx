import { BodyText, Headline, Stack, Tab, TabGroup } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';
import { BookHistory } from './book-history';
import { BookSummary } from './book-summary';
import { FilePickerStore } from '../../../common/stores/file-picker.store';

export const BookDetails = provide({ singletons: [FilePickerStore] })(
    observer(() => {
        const [{ setActiveTab, activeTab }] = useDependencies(BooksStore);

        return (
            <Stack direction="column" className="filters p-b-3">
                <Stack direction="column" className="p-b-3">
                    <Stack direction="column" className="bg-white p-3 p-b-0">
                        <Stack direction="column">
                            <Headline className="m-b-2 t-truncate" size="large">
                                Կլարան և արևը
                            </Headline>
                            <BodyText className="m-b-2 t-truncate" size="medium">
                                Կազուո Իշիգուրո
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
                    <Stack justifyContent="space-between" className="p-3" alignItems="center">
                        {activeTab === 0 && <BookSummary />}
                        {activeTab === 1 && <BookHistory />}
                    </Stack>
                </Stack>
            </Stack>
        );
    })
);
