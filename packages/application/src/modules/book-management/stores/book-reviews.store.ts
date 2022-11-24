import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { ELibraryApi, ReviewModel } from '../../common/api/e-library.client';

@injectable()
export class BookReviewsStore {
    @observable reviewLoading: LoadStatus = LoadStatus.None;
    @observable removeLoading: LoadStatus = LoadStatus.None;
    @observable bookId?: number;
    @observable reviewRecordsExists = false;
    @observable reviews: ReviewModel[] = [];
    @observable reviewId?: number;

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
    }

    @action setReviewLoading = (loading: LoadStatus) => (this.reviewLoading = loading);
    @action setReviewId = (reviewId: number | undefined) => (this.reviewId = reviewId);

    init = async (bookId: number) => {
        this.getReviews(bookId).catch();
    };

    removeReview = async () => {
        runInAction(() => {
            this.removeLoading = LoadStatus.Loading;
        });
        try {
            if (this.reviewId) {
                await this.eLibraryApi.reviewsController_deleteReview(this.reviewId);
            }
            await this.getReviews(this.bookId);
        } catch {
            //
        }
        runInAction(() => {
            this.removeLoading = LoadStatus.Ok;
        });
    };

    getReviews = async (bookId?: number) => {
        if (!bookId) {
            return;
        }

        this.setReviewLoading(LoadStatus.Loading);

        const {
            data: { data },
        } = await this.eLibraryApi.reviewsController_getBookReviews(bookId);

        runInAction(() => {
            this.reviewRecordsExists = !!data.length;
            this.reviews = data;
        });

        this.setReviewLoading(LoadStatus.Ok);
    };
}
