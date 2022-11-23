import { Avatar, BodyText, Button, Stack } from '@servicetitan/design-system';
import classNames from 'classnames';
import { FC } from 'react';

interface CommentCardProps {
    id: number;
    name?: string;
    review?: string;
    deletable?: boolean;
    createdOn?: string;
    onDelete?: (id: number) => void;
}

export const CommentCard: FC<CommentCardProps> = ({ deletable, review, name, createdOn }) => {
    return (
        <Stack.Item className="m-y-2">
            <Stack direction="column">
                <Stack alignItems="center" className="m-b-2">
                    <Stack.Item className="m-r-6">
                        <Avatar className="m-r-2" name="RT" />
                        {name}
                    </Stack.Item>
                    <Stack.Item>{createdOn}</Stack.Item>
                </Stack>
                <Stack direction="row">
                    <BodyText>{review}</BodyText>
                    {deletable && (
                        <Button
                            className={classNames({ 'm-r-6 m-l-6': deletable })}
                            negative
                            outline
                            iconName="delete"
                        />
                    )}
                </Stack>
            </Stack>
        </Stack.Item>
    );
};
