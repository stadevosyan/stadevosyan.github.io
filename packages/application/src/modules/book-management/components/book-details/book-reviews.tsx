import { CommentCard } from '../comment-card/comment-card';
import { BodyText, Stack } from '@servicetitan/design-system';
import { Fragment, useEffect } from 'react';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { observer } from 'mobx-react';
import { useConfirm } from '@servicetitan/confirm';
import { BookReviewsStore } from '../../stores/book-reviews.store';
import { useParams } from 'react-router-dom';
import { LoadStatus } from '../../../common/enums/load-status';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import moment from 'moment';

// TODO change popup label
export const BookReviews = provide({ singletons: [BookReviewsStore] })(
    observer(() => {
        const [{ reviews, reviewLoading, reviewRecordsExists, init, removeReview, setReviewId }] =
            useDependencies(BookReviewsStore);
        const { id } = useParams<{ id: string }>();

        const [HookConfirm, hookHandler] = useConfirm(removeReview);

        useEffect(() => {
            init(+id);
        }, [id, init]);

        const loading = reviewLoading === LoadStatus.Loading;

        return (
            <Fragment>
                {loading && (
                    <Stack alignItems="center" justifyContent="center" className="h-100 w-100">
                        <CenteredSpinner />
                    </Stack>
                )}
                {!loading &&
                    (!reviewRecordsExists ? (
                        <Stack alignItems="center" justifyContent="center" className="h-100 w-100">
                            <Stack
                                direction="column"
                                spacing={1}
                                style={{ height: '460px', width: '300px' }}
                                justifyContent="center"
                            >
                                <img src={require('../../../common/assets/no-data-1.png')} />
                                <BodyText className="ta-center m-t-2-i">
                                    Այս գրքի համար դեռ չկան մենկաբանություններ{' '}
                                </BodyText>
                            </Stack>
                        </Stack>
                    ) : (
                        <Stack className="p-y-3 w-100" direction="column">
                            {reviews.map(review => (
                                <CommentCard
                                    deletable
                                    key={review.id}
                                    id={review.id}
                                    name={review.user.name ?? '--'}
                                    onDelete={() => {
                                        setReviewId(review.id);
                                        hookHandler();
                                    }}
                                    review={review.review}
                                    image={review.user.profilePictureUrl}
                                    createdOn={
                                        review.created_at
                                            ? moment(review.created_at).format('l')
                                            : '--'
                                    }
                                />
                            ))}
                        </Stack>
                    ))}
                <HookConfirm title="" />
            </Fragment>
        );
    })
);
