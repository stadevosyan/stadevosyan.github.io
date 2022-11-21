import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { FormState } from 'formstate';
import { FormValidators, InputFieldState } from '@servicetitan/form';
import { errorMessages, requiredWithCustomText } from './new-book.store';
import { LoadStatus } from '../../common/enums/load-status';
import { BookEntity, CategoryEntity, ELibraryApi } from '../../common/api/e-library.client';

@injectable()
export class UserBookDetailsStore {
    @observable loading: LoadStatus = LoadStatus.None;
    @observable open = false;
    @observable book?: BookEntity;
    @observable categories = new Map();

    commentForm = new FormState({
        review: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredDesc),
            FormValidators.maxLength(1024)
        ),
    });

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
    }

    @action openModal = () => (this.open = true);
    @action closeModal = () => {
        this.commentForm.reset();
        this.open = false;
    };

    getReviews = () => {
        //
    };

    saveReview = async () => {
        const { hasError } = await this.commentForm.validate();

        if (!hasError) {
            runInAction(() => (this.loading = LoadStatus.Loading));

            /*
             *  const form = formStateToJS(this.commentForm);
             *  saveReview
             *  getReviews
             */
        }

        runInAction(() => (this.loading = LoadStatus.Ok));
    };

    init = async (id: number) => {
        const categories: CategoryEntity[] = (
            await this.eLibraryApi.categoryController_getCategories('')
        ).data as unknown as CategoryEntity[];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        categories[0].forEach(item => {
            this.categories.set(item.id, item.name);
        });

        // getBookById
        this.book = {
            id,
            title: 'Designing Daya-Intensive Applications',
            description:
                'Data is at the center of many challenges in system design today. Difficult issues need to be figured out, such as scalability, consistency, reliability, efficiency, and maintainability. In addition, we have an overwhelming variety of tools, including relational databases, NoSQL datastores, stream or batch processors, and message brokers. What are the right choices for your application? How do you make sense of all these buzzwords?',
            author: 'Martin Kleppmann',
            count: 1,
            pictureUrl: '/uploads/file-1669020717207-894712844.00',
            holdCount: 0,
            categories: [1, 3],
        } as unknown as BookEntity;
    };
}
