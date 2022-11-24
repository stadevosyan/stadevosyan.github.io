import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { BookDetailsStore } from './book-details.store';
import { GeneralDataStore } from '../../common/stores/general-data.store';
import { UserModel } from '../../common/api/e-library.client';

@injectable()
export class HoldBookDrawerStore {
    @observable drawerInitLoadStatus = LoadStatus.None;
    @observable holderUserId?: number;
    @observable users: Map<number, UserModel> = new Map();
    @observable usersIds: number[] = [];

    @computed get currentHolderUser() {
        return this.bookDetailsStore.selectedBook?.holdedUser;
    }

    constructor(
        @inject(BookDetailsStore) private readonly bookDetailsStore: BookDetailsStore,
        @inject(GeneralDataStore) private readonly generalDataStore: GeneralDataStore
    ) {
        makeObservable(this);
        this.init();
    }

    init = async () => {
        this.setDrawerInitLoadStatus(LoadStatus.Loading);

        await when(() => this.generalDataStore.fetchUsersStatus === LoadStatus.Ok);
        const holderUserId =
            this.bookDetailsStore.newHolder ?? this.bookDetailsStore.selectedBook?.holdedUser?.id;
        const users = this.generalDataStore.users;

        runInAction(() => {
            users.forEach(user => {
                this.users.set(user.id, user);
                this.usersIds.push(user.id);
                this.holderUserId = holderUserId;
            });
        });
    };

    onConfirm = () => {
        if (this.holderUserId) {
            runInAction(() => (this.bookDetailsStore.newHolder = this.holderUserId));
        }
        this.bookDetailsStore.closeAssignBookModal();
    };

    @action updateSelectedUser = (id: number) => {
        this.holderUserId = id;
    };

    @action setDrawerInitLoadStatus = (status: LoadStatus) => (this.drawerInitLoadStatus = status);
}
