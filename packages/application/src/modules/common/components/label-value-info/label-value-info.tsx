import { BodyText, Stack } from '@servicetitan/design-system';
import { FC } from 'react';

export const LabelValueInfo: FC<{
    label: string;
    value?: string;
}> = ({ label, value = '-' }) => {
    return (
        <Stack direction="column" spacing={2}>
            <BodyText size="small" subdued>
                {label}
            </BodyText>
            <BodyText>{value}</BodyText>
        </Stack>
    );
};
