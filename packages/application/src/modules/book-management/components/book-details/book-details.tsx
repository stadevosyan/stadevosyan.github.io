import { BodyText, Headline, Stack, Tab, TabGroup } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';
import { BookHistory } from './book-history';
import { BookSummary } from './book-summary';

export const BookDetails = observer(() => {
    const [{ setActiveTab, activeTab }] = useDependencies(BooksStore);

    return (
        <Stack direction="column" className="filters p-b-3">
            <Stack direction="column" className="filters p-b-3">
                <Stack direction="column">
                    <Headline className="m-b-2 t-truncate" size="large">
                        Կլարան և արևը
                    </Headline>
                    <BodyText className="m-b-2 t-truncate" size="medium">
                        Կազուո Իշիգուրո
                    </BodyText>
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                    <TabGroup>
                        <Tab onClick={() => setActiveTab(0)} active={activeTab === 0}>
                            Գրքի տվյալներ
                        </Tab>
                        <Tab onClick={() => setActiveTab(1)} active={activeTab === 1}>
                            Հասանելիության պատմություն
                        </Tab>
                    </TabGroup>
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                    {activeTab === 0 && <BookSummary />}
                    {activeTab === 1 && <BookHistory />}
                </Stack>
            </Stack>
        </Stack>
    );
});
