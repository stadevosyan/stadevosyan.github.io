import { FC } from 'react';
import moment from 'moment';
import { IUserBook } from '../../stores/contact-details.store';
import { BodyText, Card, Headline, Stack } from '@servicetitan/design-system';
import { ImagePlaceholder } from '../../../common/components/image-placeholder/image-placeholder';

import * as Styles from './book-card.module.less';
import { baseUrl } from '../../../../app';

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
                            src={`${baseUrl}${bookData.bookImageUrl}`}
                            style={{
                                height: 'auto',
                                width: 'auto',
                                maxWidth: '100px',
                                maxHeight: '120px',
                                objectFit: 'contain',
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
                        Վարձակալման ամսաթիվ
                    </BodyText>
                    <BodyText size="xsmall">
                        {bookData.bookingDate ? moment(bookData.bookingDate).format('l') : '--'}
                    </BodyText>
                </Stack>
            </Stack>
        </Card>
    );
};
