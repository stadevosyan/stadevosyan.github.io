import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { FormState } from 'formstate';
import { FormValidators, InputFieldState, setFormStateValues } from '@servicetitan/form';
import { errorMessages, requiredWithCustomText } from './new-book.store';
import { LoadStatus } from '../../common/enums/load-status';
import { CreateReviewDto, ELibraryApi, ReviewModel } from '../../common/api/e-library.client';
import { UserBookDetailsStore } from './user-book-details.store';

@injectable()
export class CreateNewReviewStore {
    @observable saveBookReviewLoadStatus: LoadStatus = LoadStatus.None;

    commentForm = new FormState({
        review: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredDesc),
            FormValidators.maxLength(1024)
        ),
    });

    constructor(
        @inject(ELibraryApi) private api: ELibraryApi,
        @inject(UserBookDetailsStore) private bookDetailsStore: UserBookDetailsStore
    ) {
        makeObservable(this);
        this.setEditReview();
    }

    saveReview = async (bookId: number) => {
        this.setSaveBookReviewLoadStatus(LoadStatus.Loading);
        const { hasError } = await this.commentForm.validate();

        if (hasError) {
            this.setSaveBookReviewLoadStatus(LoadStatus.Ok);
            return;
        }

        if (this.bookDetailsStore.singleReviews?.id) {
            await this.updateReview(bookId);
        } else {
            await this.createReview(bookId);
        }
    };

    createReview = async (bookId: number) => {
        try {
            await this.api.reviewsController_addReview({
                bookId,
                review: this.commentForm.$.review.value,
            } as CreateReviewDto);
            await this.bookDetailsStore.fetchReviews(bookId);
            this.setSaveBookReviewLoadStatus(LoadStatus.Ok);
            this.bookDetailsStore.closeModal();
        } catch {
            this.setSaveBookReviewLoadStatus(LoadStatus.Error);
        }
    };

    updateReview = async (bookId: number) => {
        if (this.bookDetailsStore.singleReviews?.id) {
            try {
                await this.api.reviewsController_editReview(
                    this.bookDetailsStore.singleReviews?.id,
                    {
                        bookId,
                        review: this.commentForm.$.review.value,
                    } as ReviewModel
                );
                await this.bookDetailsStore.fetchReviews(bookId);
                this.bookDetailsStore.closeModal();
                this.setSaveBookReviewLoadStatus(LoadStatus.Ok);
            } catch {
                this.setSaveBookReviewLoadStatus(LoadStatus.Error);
            }
        }
    };

    setEditReview = () => {
        if (this.bookDetailsStore.singleReviews) {
            setFormStateValues(this.commentForm, {
                review: this.bookDetailsStore.singleReviews.review,
            });
        }
    };

    @action setSaveBookReviewLoadStatus = (status: LoadStatus) =>
        (this.saveBookReviewLoadStatus = status);
}
