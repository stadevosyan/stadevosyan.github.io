import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { UserBookDetailsStore } from '../../stores/user-book-details.store';
import { LoadStatus } from '../../../common/enums/load-status';
import { BodyText, Button, Headline, Icon, Stack } from '@servicetitan/design-system';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import { CommentCard } from '../comment-card/comment-card';
import { AuthStore } from '../../../common/stores/auth.store';
import { useConfirm } from '@servicetitan/confirm';
import moment from 'moment/moment';

export const ReviewsSection = observer(() => {
    const [
        {
            openModal,
            fetchBookReviewsLoadStatus,
            bookReviews,
            handleEditReview,
            handleDeleteReview,
            removeReview,
        },
        { user },
    ] = useDependencies(UserBookDetailsStore, AuthStore);
    const [HookConfirm, hookHandler] = useConfirm(removeReview);

    const loadingReviews = fetchBookReviewsLoadStatus === LoadStatus.Loading;
    const noReviews = bookReviews.length === 0 && fetchBookReviewsLoadStatus === LoadStatus.Ok;

    return (
        <Stack direction="column">
            <Stack className="p-3" justifyContent="space-between">
                <Stack.Item>
                    <Headline className="m-b-2 t-truncate" size="small">
                        Մեկնաբանություններ
                    </Headline>
                </Stack.Item>
                {!noReviews && (
                    <Stack.Item>
                        <Button
                            iconName="comment"
                            outline
                            onClick={openModal}
                            disabled={loadingReviews}
                        >
                            Գրել մեկնաբանություն
                        </Button>
                    </Stack.Item>
                )}
            </Stack>
            {loadingReviews ? (
                <CenteredSpinner />
            ) : noReviews ? (
                <NoReviewsPlaceholder />
            ) : (
                <Stack className="p-3" direction="column">
                    {bookReviews.map(item => (
                        <CommentCard
                            key={item.id}
                            id={item.id}
                            name={item.user.name}
                            review={item.review}
                            image={item.user.profilePictureUrl}
                            deletable={item.user.id === user?.id}
                            editable={item.user.id === user?.id}
                            onEdit={() => {
                                handleEditReview(item.id);
                            }}
                            onDelete={() => {
                                hookHandler();
                                handleDeleteReview(item.id);
                            }}
                            createdOn={item.created_at ? moment(item.created_at).format('l') : '--'}
                        />
                    ))}
                </Stack>
            )}
            <HookConfirm title="Ջնջե՞լ" />
        </Stack>
    );
});

const NoReviewsPlaceholder = () => {
    const [{ openModal }] = useDependencies(UserBookDetailsStore);

    return (
        <Stack alignItems="center" justifyContent="center">
            <Stack
                direction="column"
                spacing={1}
                style={{ height: '310', width: '300px' }}
                justifyContent="center"
            >
                <img src={require('../../../common/assets/no-data-2.png')} />
                <BodyText className="ta-center m-t-2-i">
                    Այս գրքի համար դեռ չկան մենկաբանություններ
                </BodyText>
                <Button
                    primary
                    onClick={openModal}
                    style={{ width: '250px', marginLeft: '20px' }}
                    className="m-t-2-i"
                    outline
                >
                    <Icon name="message" className="m-r-half" /> Գրել մեկնաբանություն
                </Button>
            </Stack>
        </Stack>
    );
};
