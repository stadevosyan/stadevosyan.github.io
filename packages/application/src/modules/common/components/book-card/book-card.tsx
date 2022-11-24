import { FC } from 'react';
import { BodyText, Card, Headline, Stack } from '@servicetitan/design-system';
import { ImagePlaceholder } from '../image-placeholder/image-placeholder';
import { baseUrl } from '../../../../app';

export interface BookCardProps {
    id?: number;
    name?: string;
    author?: string;
    imgUrl?: string;
    tagToShow: JSX.Element;
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
                                width: 'auto',
                                objectFit: 'contain',
                                maxWidth: '196px',
                                maxHeight: '224px',
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
                {props.tagToShow}
            </Card.Section>
        </Card>
    );
};
