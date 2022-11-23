import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { ELibraryApi } from '../../common/api/e-library.client';
import { InMemoryDataSource, TableState } from '@servicetitan/table';
import { pageSize } from '../../contacts/stores/contacts.store';
import { LoadStatus } from '../../common/enums/load-status';
import { getFilterSet } from '../../contacts/utils/table-utils';
import moment from 'moment';

export interface HisRecord {
    id: number;
    profilePictureUrl: string;
    startDate: string;
    endDate: string;
    name: string;
}

@injectable()
export class BookHistoryStore {
    @observable historyTableLoadStatus = LoadStatus.None;

    @observable historyTableState: TableState<HisRecord, number> = new TableState<
        HisRecord,
        number
    >({
        pageSize,
    });

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
    }

    @action setHistoryLoadStatus = (status: LoadStatus) => (this.historyTableLoadStatus = status);

    @action refresh = (name: string) => {
        const filter = getFilterSet([{ column: 'name', value: name }]);

        this.historyTableState.fetchData({ newFilter: filter }).catch(() => null);
    };

    init = async (bookId: number) => {
        this.setHistoryLoadStatus(LoadStatus.Loading);
        const {
            data: { data },
        } = await this.eLibraryApi.booksController_getBookHistory(bookId);

        const currentData = data
            .sort((item1, item2) => item1.id - item2.id)
            .map(record => ({
                id: record.id,
                name: record.user.name,
                profilePictureUrl: record.user.profilePictureUrl ?? '',
                startDate: moment(record.createdDate).format('l'),
                endDate: moment(record.endDate).format('l'),
            }));

        await this.historyTableState.setDataSource(new InMemoryDataSource(currentData));
        this.setHistoryLoadStatus(LoadStatus.Ok);
    };
}
