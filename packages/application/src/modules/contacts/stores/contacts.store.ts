import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { ELibraryApi } from '../../common/api/e-library.client';
import { InputFieldState } from '@servicetitan/form';
import { FormState } from 'formstate';
import { InMemoryDataSource, TableState } from '@servicetitan/table';
import { getFilterSet } from '../utils/table-utils';
import { debounce } from 'debounce';

interface Contact {
    name: string;
    phoneNumber: string;
    email: string;
}

export const pageSize = 10;

@injectable()
export class ContactsStore {
    @observable contactsLoadStatus = LoadStatus.None;
    @observable takeoverVisibility = false;

    @observable contactsTableState: TableState<Contact, number> = new TableState<Contact, number>({
        pageSize,
    });

    @observable filterFormState = new FormState({
        searchField: new InputFieldState(''),
    });

    searchDebounced: ((name: string) => void) & { clear(): void } & { flush(): void };

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);
        this.fetchContactsData().catch(null);
        this.searchDebounced = debounce(this.refresh, 300);
    }

    fetchContactsData = async (name?: string, pageNumber?: number, pageSize?: number) => {
        this.setContactsLoadStatus(LoadStatus.Loading);

        try {
            const { data: response } = await this.api.usersController_getUsers(
                name ?? '',
                pageNumber,
                pageSize
            );

            const myData = [
                ...response.data,
                ...response.data.map(item => ({
                    ...item,
                    name: 'blo',
                })),
            ];
            console.log({ myData });

            this.contactsTableState.setDataSource(new InMemoryDataSource(myData || [])).catch();
            this.setContactsLoadStatus(LoadStatus.Ok);
        } catch {
            this.setContactsLoadStatus(LoadStatus.Error);
        }
    };

    @action refresh = (name: string) => {
        const filter = getFilterSet([{ column: 'name', value: name }]);

        this.contactsTableState.fetchData({ newFilter: filter }).catch(() => null);
    };

    @action showTakeover = () => (this.takeoverVisibility = true);
    @action hideTakeover = () => (this.takeoverVisibility = false);

    @action private setContactsLoadStatus = (status: LoadStatus) =>
        (this.contactsLoadStatus = status);
}