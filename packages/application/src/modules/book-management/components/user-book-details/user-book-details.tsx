import { BodyText, Divider, Eyebrow, Headline, Stack, Tag } from '@servicetitan/design-system';

import { useHistory, useParams } from 'react-router-dom';
import { ImagePreview } from '../../../common/components/image-preview/image-preview';
import { provide, useDependencies } from '@servicetitan/react-ioc';
import { UserBookDetailsStore } from '../../stores/user-book-details.store';
import { observer } from 'mobx-react';
import { LoadStatus } from '../../../common/enums/load-status';
import { useEffect } from 'react';
import { CenteredSpinner } from '../../../common/components/centered-spinner/centered-spinner';
import { WriteReviewModal } from './write-review-modal';
import { ReviewsSection } from './reviews-section';
import { SomethingWentWrong } from '../../../common/components/something-went-wrong/something-went-wrong';

export const UserBookDetails = provide({ singletons: [UserBookDetailsStore] })(
    observer(() => {
        const [{ open, init, book, fetchBookDetailsLoadStatus }] =
            useDependencies(UserBookDetailsStore);
        const history = useHistory();
        const { id } = useParams<{ id: string }>();

        useEffect(() => {
            if (typeof +id === 'number') {
                init(+id);
            }
        }, [id, init]);

        if (fetchBookDetailsLoadStatus === LoadStatus.Error) {
            return <SomethingWentWrong />;
        }

        return (
            <Stack direction="column">
                <Stack direction="column" className="p-b-3">
                    <Stack direction="column" className="p-3">
                        <Stack direction="column">
                            <BodyText onClick={history.goBack} className="cursor-pointer m-b-3">
                                ← Վերադառնալ նախորդ էջ
                            </BodyText>

                            {fetchBookDetailsLoadStatus === LoadStatus.Loading ? (
                                <div style={{ height: '280px' }}>
                                    <CenteredSpinner />
                                </div>
                            ) : (
                                <Stack>
                                    <ImagePreview url={book?.pictureUrl} />
                                    <Stack direction="column" className="m-l-2">
                                        <Headline className="m-b-2 t-truncate" size="large">
                                            {book?.title ?? '--'}
                                            <Tag className="m-l-2" color="success" subtle>
                                                Հասանելի է
                                            </Tag>
                                        </Headline>
                                        <Eyebrow className="m-b-2 t-truncate" size="medium">
                                            {book?.author ?? '--'}
                                        </Eyebrow>
                                        <Stack className="m-b-2">
                                            {book?.categories?.map(item => (
                                                <Tag key={item.categoryId} className="m-1">
                                                    {item.name}
                                                </Tag>
                                            ))}
                                        </Stack>
                                        <Headline className="m-b-2 t-truncate" size="small">
                                            Նկարագրություն
                                        </Headline>
                                        <BodyText>{book?.description}</BodyText>
                                    </Stack>
                                </Stack>
                            )}
                        </Stack>
                    </Stack>
                    <Divider className="m-t-4" />
                    <ReviewsSection />
                </Stack>
                {open && <WriteReviewModal bookId={+id} />}
            </Stack>
        );
    })
);
