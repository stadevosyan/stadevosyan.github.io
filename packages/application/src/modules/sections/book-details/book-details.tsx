import React from 'react';
import { Button, Form, Headline, Stack, ToggleSwitch } from '@servicetitan/design-system';
import { useParams } from 'react-router-dom';

export const BookDetails = () => {
    const params = useParams<{id: string}>();
    return (
        <Stack direction="column" className="filters p-b-3">
            <Stack direction="column" className="filters p-b-3">
                <Stack>
                    <Headline className="m-b-2 t-truncate" size="large">
                        Կլարան և արևը
                    </Headline>
                </Stack>
                <Stack justifyContent="space-between" alignItems="center">
                    <Stack alignItems="center">
                        <Form.Input
                            style={{ width: '354px' }}
                            className="m-b-0 p-r-2"
                            placeholder="Որոնել գրքեր"
                        />
                        <ToggleSwitch
                            checked
                            label="Տեսնել միայն հասանելի գրքերը"
                            name="Toggle1"
                            onChange={() => {}}
                        />
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};
