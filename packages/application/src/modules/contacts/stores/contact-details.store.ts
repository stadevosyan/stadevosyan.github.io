import { inject, injectable } from '@servicetitan/react-ioc';

import { ELibraryApi } from '../../common/api/e-library.client';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';

export interface IUserBook {
    id: number;
    author: string;
    title: string;
    bookingDate: Date;
    bookImageUrl?: string;
}

interface IUserData {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    books: IUserBook[];
    imageUrl?: string;
}

@injectable()
export class ContactDetailsStore {
    @observable fetchContactDataStatus = LoadStatus.None;
    @observable userData?: IUserData;

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);
    }

    init = async (id: number) => {
        if (!id) {
            return;
        }

        this.setFetchContactDataStatus(LoadStatus.Loading);
        try {
            const { data: userData } = await this.api.usersController_getUserById(id);
            // const { data: userBooksData } = await this.api.booksController_getBooksByUserId()
            const userBooksData = [
                {
                    id: 1,
                    author: 'author1',
                    title: 'title1',
                    bookingDate: new Date(1876, 3, 27),
                    bookImageUrl: 'https://picsum.photos/200/300',
                },
                {
                    id: 2,
                    author: 'author2',
                    title: 'title2',
                    bookingDate: new Date(1876, 3, 27),
                },
                {
                    id: 3,
                    author: 'author3',
                    title: 'title4',
                    bookingDate: new Date(1876, 3, 27),
                },
                {
                    id: 4,
                    author: 'author6',
                    title: 'title5',
                    bookingDate: new Date(1876, 3, 27),
                },
                {
                    id: 5,
                    author: 'author7',
                    title: 'title7',
                    bookingDate: new Date(1876, 3, 27),
                },
                {
                    id: 6,
                    author: 'author8',
                    title: 'title8',
                    bookingDate: new Date(1876, 3, 27),
                },
            ];

            runInAction(() => {
                this.userData = {
                    ...userData,
                    books: userBooksData,
                };
            });
            this.setFetchContactDataStatus(LoadStatus.Ok);
        } catch {
            this.setFetchContactDataStatus(LoadStatus.Error);
        }
    };

    @action private setFetchContactDataStatus = (status: LoadStatus) =>
        (this.fetchContactDataStatus = status);
}
