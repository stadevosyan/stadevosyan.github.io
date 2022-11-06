import {
    BodyText,
    Button,
    ButtonGroup,
    Divider,
    Form,
    Layout,
    Stack,
    Takeover,
} from '@servicetitan/design-system';
import { observer } from 'mobx-react';
import { useDependencies } from '@servicetitan/react-ioc';
import { NewBookStore } from '../stores/new-book.store';

export const NewBookTakeover = observer(() => {
    const [newBookStore] = useDependencies(NewBookStore);

    return (
        <Takeover
            portal={false}
            theme="light"
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
            onBack={newBookStore.handleClose}
            onClose={newBookStore.handleClose}
        >
            <Layout type="island">
                <Stack direction="column">
                    <Stack.Item>
                        <Button iconName="add_a_photo">Կցել գրքի լուսանկարը</Button>
                    </Stack.Item>
                    <Divider className="m-y-3" />
                    <Form>
                        <Form.Group widths="equal" className="">
                            <Form.Input
                                label="Գրքի անուն"
                                /*
                                 * value={login.value}
                                 * onChange={login.onChangeHandler}
                                 * error={login.hasError}
                                 */
                            />
                            <Form.Input
                                label="Հեղինակի անուն"
                                /*
                                 * value={login.value}
                                 * onChange={login.onChangeHandler}
                                 * error={login.hasError}
                                 */
                            />
                        </Form.Group>
                        <Form.TextArea
                            label="Նկարագրություն (ոչ պարտադիր)"
                            // placeholder="Aren't you a little short for a stormtrooper?"
                        />
                        <BodyText className="m-b-2 t-truncate" size="small" bold>
                            Հասանելիություն
                        </BodyText>
                        <Form.Group className="align-items-stretch m-r-1">
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
                    </Form>
                </Stack>
            </Layout>
        </Takeover>
    );
});
