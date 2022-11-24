import { Avatar, BodyText, Button, Card, Stack } from '@servicetitan/design-system';
import classNames from 'classnames';
import { FC } from 'react';

interface CommentCardProps {
    id: number;
    name?: string;
    review?: string;
    deletable?: boolean;
    editable?: boolean;
    createdOn?: string;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    image?: string;
}

export const CommentCard: FC<CommentCardProps> = ({
    deletable,
    review,
    name,
    createdOn,
    image,
    onDelete,
}) => {
    return (
        <Stack.Item className="m-y-2 w-100">
            <Card>
                <Stack direction="column">
                    <Stack alignItems="center" className="m-b-2">
                        <Stack.Item className="m-r-6">
                            <Avatar className="m-r-2" name={name} image={image} />
                            {name}
                        </Stack.Item>
                        <Stack.Item>{createdOn}</Stack.Item>
                    </Stack>
                    <Stack direction="row" justifyContent={deletable ? 'space-between' : undefined}>
                        <BodyText>{review}</BodyText>
                        {deletable && (
                            <Button
                                className={classNames({ 'm-r-2 m-l-6': deletable })}
                                negative
                                outline
                                iconName="delete"
                                onClick={onDelete}
                            />
                        )}
                    </Stack>
                </Stack>
            </Card>
        </Stack.Item>
    );
};
