import { BodyText, Stack } from '@servicetitan/design-system';
import { Logo } from '../../../common/components/logo';

export const LogoSection = () => {
    return (
        <Stack spacing={2} alignItems="center">
            <Logo />
            <BodyText>Լոգո</BodyText>
        </Stack>
    );
};
