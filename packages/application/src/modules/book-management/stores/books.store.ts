import { injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class BooksStore {
    @observable loading: any;
    @observable activeTab = 0;

    constructor() {
        makeObservable(this);
    }

    @action handleSelect = async (_book: any) => {
        return Promise.resolve();
    };
    @action setActiveTab = (tab: number) => {
        this.activeTab = tab;
    };

    init = () => {};
}
