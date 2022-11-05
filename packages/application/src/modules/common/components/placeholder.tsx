import { FC } from 'react';

import { Text } from '@servicetitan/design-system';

export const Placeholder: FC<{ text: string }> = ({ text }) => <Text size={5}>{text}</Text>;
