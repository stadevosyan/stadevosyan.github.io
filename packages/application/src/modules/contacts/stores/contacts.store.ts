import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, when } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { ELibraryApi } from '../../common/api/e-library.client';
import { InputFieldState } from '@servicetitan/form';
import { FormState } from 'formstate';
import { InMemoryDataSource, TableState } from '@servicetitan/table';
import { getFilterSet } from '../utils/table-utils';
import { debounce } from 'debounce';
import { GeneralDataStore } from '../../common/stores/general-data.store';

export interface Contact {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    profilePictureUrl?: string;
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

    @computed get usersData() {
        return this.generalDataStore.users.map(item => ({
            id: item.id,
            name: item.name,
            phoneNumber: item.phoneNumber,
            email: item.email,
            profilePictureUrl: item.profilePictureUrl,
        }));
    }

    searchDebounced: ((name: string) => void) & { clear(): void } & { flush(): void };

    constructor(
        @inject(ELibraryApi) private readonly api: ELibraryApi,
        @inject(GeneralDataStore) private readonly generalDataStore: GeneralDataStore
    ) {
        makeObservable(this);
        this.init().catch(null);
        this.searchDebounced = debounce(this.refresh, 300);
    }

    reSet = async () => {
        this.generalDataStore.fetchUsers().catch();
        await this.init();
    };

    init = async () => {
        this.setContactsLoadStatus(LoadStatus.Loading);

        try {
            await when(() => this.generalDataStore.fetchUsersStatus === LoadStatus.Ok);

            this.contactsTableState
                .setDataSource(new InMemoryDataSource(this.usersData ?? []))
                .catch();

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
