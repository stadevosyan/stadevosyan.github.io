import { FC, ReactElement } from 'react';
import { BodyText, Button, ButtonGroup, Divider, Drawer, Form } from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { BooksStore } from '../../stores/books.store';

export const FilterDrawer: FC = observer(() => {
    const [bookStore] = useDependencies(BooksStore);
    const { filterForm, categoriesMap } = bookStore;

    const generateCheckboxes = () => {
        const checkboxes: ReactElement[] = [];

        filterForm.$.all.$.forEach((category, id) => {
            checkboxes.push(
                <Form.Checkbox
                    className="m-b-2-i"
                    checked={category.value}
                    value={!category.value}
                    onChange={category.onChange}
                    label={categoriesMap.get(id)?.name ?? ''}
                />
            );
        });

        return checkboxes;
    };

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
                    {generateCheckboxes()}
                </Form.Group>
                <Divider className="m-b-2" />
                <BodyText className="m-b-2 t-truncate" size="small" bold>
                    Հասանելիություն
                </BodyText>
                <Form.Group grouped className="align-items-stretch m-r-1">
                    <Form.Togglebox
                        control="checkbox"
                        value={!filterForm.$.isAvailable.value}
                        checked={filterForm.$.isAvailable.value}
                        onClick={filterForm.$.isAvailable.onChange}
                        title="Հասանելի"
                        label=""
                    />
                    <Form.Togglebox
                        control="checkbox"
                        value={!filterForm.$.isBooked.value}
                        checked={filterForm.$.isBooked.value}
                        onClick={filterForm.$.isBooked.onChange}
                        title="Վարձակալված"
                        label=""
                    />
                </Form.Group>
            </Form>
        </Drawer>
    );
});
