import { injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class NewBookStore {
    @observable loading: any;
    @observable open = false;

    constructor() {
        makeObservable(this);
    }

    @action setLoading = (loading: any) => (this.loading = loading);

    @action setOpen = (state: boolean) => (this.open = state);

    @action handleClose = () => this.setOpen(false);

    @action handleOpen = () => this.setOpen(true);

    init = () => {};
}
