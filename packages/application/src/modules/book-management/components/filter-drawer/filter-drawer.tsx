import { FC } from 'react';
import { BodyText, Button, ButtonGroup, Drawer, Form } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';

export const FilterDrawer: FC = observer(() => {
    const [bookStore] = useDependencies(BooksStore);

    return (
        <Drawer
            header="Ֆիլտրեր"
            open={bookStore.isFilterOpen}
            onClose={bookStore.closeFilter}
            footer={
                <ButtonGroup>
                    <Button onClick={bookStore.cancelFilter}>Չեղարկել</Button>
                    <Button onClick={bookStore.applyFilter} primary>
                        Կիրառել
                    </Button>
                </ButtonGroup>
            }
        >
            <Form className="">
                <Form.Group grouped className="flex-grow-1">
                    <label>Ժանրեր</label>
                    <Form.Checkbox size="small" label="բոլոր ժանրերը" />
                    <Form.Checkbox size="small" label="գեղարվեստական" />
                </Form.Group>
                <Drawer />
                <BodyText className="m-b-2 t-truncate" size="small" bold>
                    Հասանելիություն
                </BodyText>
                <Form.Group grouped className="align-items-stretch m-r-1">
                    <Form.Togglebox
                        control="radio"
                        value={1}
                        /*
                         * checked={value === 1}
                         * onClick={value => setValue(value)}
                         */
                        title="Հասանելի"
                        label=""
                    />
                    <Form.Togglebox
                        control="radio"
                        value={1}
                        /*
                         * checked={value === 1}
                         * onClick={value => setValue(value)}
                         */
                        title="Վարձակալված"
                        label=""
                    />
                </Form.Group>
                <Drawer />
            </Form>
        </Drawer>
    );
});
