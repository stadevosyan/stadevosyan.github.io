import { FC, Fragment } from 'react';
import { Avatar, BodyText, Card, Divider, Headline, Stack, Tag } from '@servicetitan/design-system';

import { BookCardProps } from '../book-card/book-card';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder';
import { baseUrl } from '../../../../app';
import { UserModel } from '../../api/e-library.client';
import { urlToShow } from '../../utils/url-helpers';

interface BookCardExpandedProps extends BookCardProps {
    name?: string;
    user?: UserModel;
    onClick: (selfProps: BookCardProps) => void;
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
                <Stack justifyContent="space-between" className="w-33 h-100">
                    <Stack justifyContent="flex-start" style={{ height: 120 }}>
                        {props.imgUrl ? (
                            <img
                                className="m-r-3"
                                src={`${baseUrl}${props.imgUrl}`}
                                style={{
                                    height: 'auto',
                                    display: 'block',
                                    maxWidth: '100%',
                                }}
                            />
                        ) : (
                            <ImagePlaceholder classes="m-r-3" />
                        )}
                        <Stack.Item fill>
                            <Stack
                                className="m-r-3"
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                            >
                                <Headline size="small" className="w-66 m-0 t-truncate">
                                    {props.name}
                                </Headline>
                                <BodyText size="small" className="m-0 p-t-1 p-b-1 t-truncate">
                                    {props.author}
                                </BodyText>
                                {!props.status && (
                                    <Tag color="success" subtle>
                                        Հասանելի է
                                    </Tag>
                                )}
                                {props.status && <Tag>Վարձակալված է</Tag>}
                            </Stack>
                        </Stack.Item>
                    </Stack>
                    <Divider vertical alignContent="end" />
                </Stack>
                <Stack justifyContent="space-between" className="w-33 h-100">
                    <Stack direction="column" alignItems="flex-start" justifyContent="center">
                        <BodyText className="m-b-2" inline subdued>
                            Վարձակալի անուն
                        </BodyText>
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
                                '--'
                            )}
                        </Stack>
                    </Stack>
                    <Divider vertical />
                </Stack>
                <Stack justifyContent="space-between" className="w-33 h-100">
                    <Stack direction="column" alignItems="flex-start" justifyContent="center">
                        <BodyText className="m-b-2" inline subdued>
                            Վարձակալման ամսաթիվ
                        </BodyText>
                        <BodyText className="m-b-2 t-truncate" size="small">
                            12/11/22
                        </BodyText>
                    </Stack>
                </Stack>
            </Stack>
        </Card>
    );
};
