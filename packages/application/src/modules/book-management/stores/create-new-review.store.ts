import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { FormState } from 'formstate';
import { FormValidators, InputFieldState } from '@servicetitan/form';
import { errorMessages, requiredWithCustomText } from './new-book.store';
import { LoadStatus } from '../../common/enums/load-status';
import { CreateReviewDto, ELibraryApi } from '../../common/api/e-library.client';

@injectable()
export class CreateNewReviewStore {
    @observable saveBookReviewLoadStatus: LoadStatus = LoadStatus.None;

    commentForm = new FormState({
        review: new InputFieldState('').validators(
            requiredWithCustomText(errorMessages.RequiredDesc),
            FormValidators.maxLength(1024)
        ),
    });

    constructor(@inject(ELibraryApi) private api: ELibraryApi) {
        makeObservable(this);
    }

    saveReview = async (bookId: number) => {
        this.setSaveBookReviewLoadStatus(LoadStatus.Loading);
        const { hasError } = await this.commentForm.validate();

        if (hasError) {
            this.setSaveBookReviewLoadStatus(LoadStatus.Ok);
            return;
        }

        try {
            await this.api.reviewsController_addReview({
                bookId,
                review: this.commentForm.$.review.value,
            } as CreateReviewDto);
            this.setSaveBookReviewLoadStatus(LoadStatus.Ok);
        } catch {
            this.setSaveBookReviewLoadStatus(LoadStatus.Error);
        }
    };

    @action setSaveBookReviewLoadStatus = (status: LoadStatus) =>
        (this.saveBookReviewLoadStatus = status);
}
