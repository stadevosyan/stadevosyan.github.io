import React from 'react';
import { Button, ButtonGroup, Takeover } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { NewBookStore } from '../stores/new-book.store';

export const NewBookTakeover = observer(() => {
    const [newBookStore] = useDependencies(NewBookStore);

    return (
        <Takeover
            portal={false}
            open={newBookStore.open}
            focusTrapOptions={{ disabled: true }}
            title="Ավելացնել նոր գիրք"
            backLabel="Վերադառնալ գլխավոր էջ"
            footer={
                <ButtonGroup>
                    <Button>Չեղարկել</Button>
                    <Button primary>Ավելացնել</Button>
                </ButtonGroup>
            }
            onBack={function () {}}
            onClose={newBookStore.handleClose}
        >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id accumsan augue.
            Phasellus consequat augue vitae tellus tincidunt posuere. Curabitur justo urna,
            consectetur vel elit iaculis, ultrices condimentum risus. Nulla facilisi. Etiam
            venenatis molestie tellus. Quisque consectetur non risus eu rutrum.
        </Takeover>
    );
});
