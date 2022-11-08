import { BodyText, Button, Divider, Form, Stack } from '@servicetitan/design-system';
import { FilePicker } from '../../../common/components/file-picker/file-picker';

export const BookSummary = () => {
    return (
        <Stack className="p-y-3" direction="column">
            <Form.Group className="align-items-stretch">
                <FilePicker
                    replaceable
                    className="p-l-2"
                    buttonProps={{
                        buttonLabel: 'Կցել գրքի լուսանկարը',
                        typesNote: 'Թույլատրված ֆայլերի տեսակները: jpeg, png, jpg, svg',
                    }}
                />
                <Stack direction="column" className="m-l-2">
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
                </Stack>


            </Form.Group>
            <Divider className="m-y-3" />
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
            <Divider className="m-y-3" />
            <Stack>
                <Button negative outline iconName="delete">
                    Ջնջել գիրքը
                </Button>
            </Stack>
        </Stack>
    );
};
