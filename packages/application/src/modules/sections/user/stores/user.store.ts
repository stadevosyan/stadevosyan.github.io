import { injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';

@injectable()
export class UserStore {
    @observable loading: any;

    constructor() {
        makeObservable(this);
    }

    @action handleSelect = (cardBody: any) => {
        console.log('cardBody', cardBody);
    };

    init = () => {};
}
