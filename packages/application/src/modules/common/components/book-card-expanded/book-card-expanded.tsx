import { FC, Fragment } from 'react';
import { Avatar, BodyText, Card, Divider, Headline, Stack } from '@servicetitan/design-system';

import { BookCardProps } from '../book-card/book-card';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder';
import { baseUrl } from '../../../../app';
import { UserModel } from '../../api/e-library.client';
import { urlToShow } from '../../utils/url-helpers';
import moment from 'moment';

interface BookCardExpandedProps extends BookCardProps {
    isMyBook?: boolean;
    name?: string;
    user?: UserModel;
    onClick: (selfProps: BookCardProps) => void;
    holdedDate?: Date;
    endDate?: Date;
}

export const BookCardExpanded: FC<BookCardExpandedProps> = props => {
    return (
        <Card
            className="w-100"
            onClick={() => {
                props.onClick(props);
            }}
        >
            <Stack alignItems="center" justifyContent="space-between" spacing="4">
                <Stack
                    justifyContent="space-between"
                    className="w-33 h-100"
                    style={{ minWidth: '350px' }}
                >
                    {props.imgUrl ? (
                        <Stack style={{ height: 120, width: 100 }}>
                            <img
                                className="m-r-3"
                                src={`${baseUrl}${props.imgUrl}`}
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
                        <ImagePlaceholder classes="m-r-3" />
                    )}
                    <Stack
                        style={{
                            width: 'calc(100% - 100px)',
                        }}
                        className="m-r-3"
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                    >
                        <Headline size="small" className="m-0 w-100 t-truncate">
                            {props.name}
                        </Headline>
                        <BodyText size="small" className="m-0 p-t-1 p-b-1 t-truncate">
                            {props.author}
                        </BodyText>
                        {props.tagToShow}
                    </Stack>
                    <Divider vertical alignContent="end" />
                </Stack>
                <Stack justifyContent="space-between" className="w-33 h-100">
                    <Stack direction="column" alignItems="flex-start" justifyContent="center">
                        <BodyText className="m-b-2" inline subdued>
                            {props.isMyBook ? 'Վարձակալման ամսաթիվ' : 'Վարձակալի անուն'}
                        </BodyText>
                        {props.isMyBook && (
                            <BodyText className="m-b-2 t-truncate" size="small">
                                {props.holdedDate ? moment().format('l') : '--'}
                            </BodyText>
                        )}
                        {!props.isMyBook && (
                            <Stack justifyContent="center" alignItems="center">
                                {props.user?.name ? (
                                    <Fragment>
                                        <Avatar
                                            name={props.user?.name.charAt(0)}
                                            image={urlToShow(props.user?.profilePictureUrl)}
                                            autoColor
                                        />
                                        <BodyText className="p-l-1 t-truncate" size="medium">
                                            {props.user?.name ?? '--'}
                                        </BodyText>
                                    </Fragment>
                                ) : (
                                    <BodyText className="m-b-2 t-truncate" size="small">
                                        --
                                    </BodyText>
                                )}
                            </Stack>
                        )}
                    </Stack>
                    <Divider vertical />
                </Stack>
                <Stack justifyContent="space-between" className="w-33 h-100">
                    <Stack direction="column" alignItems="flex-start" justifyContent="center">
                        <BodyText className="m-b-2" inline subdued>
                            {props.isMyBook ? 'Վերադարձման ամսաթիվ' : 'Վարձակալման ամսաթիվ'}
                        </BodyText>
                        <BodyText className="m-b-2 t-truncate" size="small">
                            {props.holdedDate ? moment().format('l') : '--'}
                        </BodyText>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
};
