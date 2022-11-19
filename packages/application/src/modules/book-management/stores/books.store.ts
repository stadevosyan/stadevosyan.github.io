import { injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class BooksStore {
    @observable loading: any;
    @observable activeTab = 0;
    @observable isFilterOpen = false;

    constructor() {
        makeObservable(this);
    }

    @action openFilter = () => {
        this.isFilterOpen = true;
    };

    @action closeFilter = () => {
        this.isFilterOpen = false;
    };

    @action handleSelect = async (_book: any) => {
        return Promise.resolve();
    };

    @action setActiveTab = (tab: number) => {
        this.activeTab = tab;
    };

    init = () => {};
}
