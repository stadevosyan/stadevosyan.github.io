import { FC } from 'react';
import { IUserBook } from '../../stores/contact-details.store';
import { BodyText, Card, Headline, Stack } from '@servicetitan/design-system';
import * as Styles from './book-card.module.less';
import { ImagePlaceholder } from '../../../common/components/image-placeholder/image-placeholder';

export const UserBookCard: FC<{ bookData: IUserBook }> = ({ bookData }) => {
    return (
        <Card className={Styles.bookCard}>
            <Stack spacing={2}>
                {bookData.bookImageUrl ? (
                    <Stack
                        justifyContent="center"
                        style={{
                            height: 120,
                            width: 100,
                            borderRadius: 6,
                            backgroundColor: '#f7f7f7',
                        }}
                    >
                        <img
                            src={bookData.bookImageUrl}
                            style={{
                                height: 'auto',
                                display: 'block',
                                maxWidth: '100%',
                            }}
                        />
                    </Stack>
                ) : (
                    <ImagePlaceholder />
                )}
                <Stack direction="column">
                    <Headline className="m-b-1" size="small">
                        {bookData.title}
                    </Headline>
                    <BodyText className="m-b-3" size="small" subdued>
                        {bookData.author}
                    </BodyText>
                    <BodyText className="m-b-1" size="xsmall" subdued>
                        "Վարձակալման ամսաթիվ
                    </BodyText>
                    <BodyText size="xsmall">{bookData.bookingDate.toDateString()}</BodyText>
                </Stack>
            </Stack>
        </Card>
    );
};
