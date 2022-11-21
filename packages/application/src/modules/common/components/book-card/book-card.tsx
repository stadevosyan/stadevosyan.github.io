import { FC } from 'react';
import { BodyText, Card, Headline, Stack, Tag } from '@servicetitan/design-system';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder';
import { baseUrl } from '../../../../app';

enum Status {
    Avilable,
    Unavilable,
}

export interface BookCardProps {
    id?: number;
    name?: string;
    author?: string;
    imgUrl?: string;
    status?: Status;
    onClick: (selfProps: BookCardProps) => void;
}

export const BookCard: FC<BookCardProps> = props => {
    return (
        <Card
            className="of-hidden m-b-2"
            style={{ height: 356, width: 224 }}
            onClick={() => {
                props.onClick(props);
            }}
        >
            <Card.Section
                className="p-0 p-x-2 p-t-2"
                style={{
                    borderBottom: 0,
                }}
            >
                <Stack justifyContent="center" style={{ height: 224 }}>
                    {props.imgUrl ? (
                        <img
                            src={`${baseUrl}${props.imgUrl}`}
                            style={{
                                height: 'auto',
                                display: 'block',
                                maxWidth: '100%',
                            }}
                        />
                    ) : (
                        <ImagePlaceholder width={197} height={225} />
                    )}
                </Stack>
            </Card.Section>

            <Card.Section className="p-2" style={{ minHeight: 68, borderTop: 0 }}>
                <Headline size="small" className="m-0  t-truncate">
                    {props.name}
                </Headline>
                <BodyText size="small" className="m-0 p-t-1 p-b-1  t-truncate">
                    {props.author}
                </BodyText>
                <Tag color="success" subtle>
                    Հասանելի է
                </Tag>
            </Card.Section>
        </Card>
    );
};
