import { inject, injectable } from '@servicetitan/react-ioc';
import { action, makeObservable, observable, runInAction, when } from 'mobx';
import { LoadStatus } from '../../common/enums/load-status';
import { BookModel, ELibraryApi, ReviewModel } from '../../common/api/e-library.client';

@injectable()
export class UserBookDetailsStore {
    @observable fetchBookDetailsLoadStatus: LoadStatus = LoadStatus.None;
    @observable fetchBookReviewsLoadStatus: LoadStatus = LoadStatus.None;
    @observable open = false;
    @observable book?: BookModel;
    @observable bookReviews: ReviewModel[] = [];
    @observable singleReviews?: ReviewModel;
    @observable singleReviewsForDelete?: ReviewModel;

    constructor(@inject(ELibraryApi) private eLibraryApi: ELibraryApi) {
        makeObservable(this);
    }

    @action openModal = () => (this.open = true);
    @action closeModal = () => {
        this.singleReviews = undefined;
        this.open = false;
    };

    init = (id: number) => {
        this.fetchBooks(id).catch();
        this.fetchReviews(id).catch();
    };

    fetchBooks = async (id: number) => {
        this.setFetchBookDetailsLoadStatus(LoadStatus.Loading);
        try {
            const { data } = await this.eLibraryApi.booksController_getBookById(id);
            runInAction(() => {
                this.book = data;
            });
            this.setFetchBookDetailsLoadStatus(LoadStatus.Ok);
        } catch {
            this.setFetchBookDetailsLoadStatus(LoadStatus.Error);
        }
    };

    fetchReviews = async (id: number) => {
        this.setFetchBookReviewsLoadStatus(LoadStatus.Loading);
        try {
            const { data: response } = await this.eLibraryApi.reviewsController_getBookReviews(id);
            runInAction(() => {
                this.bookReviews = response.data.sort((item1, item2) => item2.id - item1.id);
            });

            if (this.fetchBookDetailsLoadStatus !== LoadStatus.Ok) {
                await when(() => this.fetchBookDetailsLoadStatus === LoadStatus.Ok);
            }
            this.setFetchBookReviewsLoadStatus(LoadStatus.Ok);
        } catch {
            this.setFetchBookReviewsLoadStatus(LoadStatus.Error);
        }
    };

    removeReview = async () => {
        try {
            if (this.singleReviewsForDelete?.id && this.book?.id) {
                await this.eLibraryApi.reviewsController_deleteReview(
                    this.singleReviewsForDelete?.id
                );
                await this.fetchReviews(this.book?.id);
            }
            runInAction(() => {
                this.singleReviewsForDelete = undefined;
            });
        } catch {
            //
        }
    };

    @action handleEditReview = (reviewId: number) => {
        const review = this.bookReviews.find(review => review.id === reviewId);
        if (review) {
            this.singleReviews = review;
            this.openModal();
        }
    };

    @action handleDeleteReview = (reviewId: number) => {
        const review = this.bookReviews.find(review => review.id === reviewId);
        if (review) {
            this.singleReviewsForDelete = review;
        }
    };

    @action setFetchBookDetailsLoadStatus = (status: LoadStatus) =>
        (this.fetchBookDetailsLoadStatus = status);
    @action setFetchBookReviewsLoadStatus = (status: LoadStatus) =>
        (this.fetchBookReviewsLoadStatus = status);
}
