import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { FormState } from 'formstate';
import { FormValidators, InputFieldState } from '@servicetitan/form';
import { errorMessages, requiredWithCustomText } from './new-book.store';
import { LoadStatus } from '../../common/enums/load-status';
import { BookModel, CategoryEntity, ELibraryApi } from '../../common/api/e-library.client';

@injectable()
export class UserBookDetailsStore {
    @observable loading: LoadStatus = LoadStatus.None;
    @observable open = false;
    @observable book?: BookModel;
    @observable categories = new Map();
    @observable bookReviews = {};

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

        this.book = (await this.eLibraryApi.booksController_getBookById(id)).data;
    };
}
