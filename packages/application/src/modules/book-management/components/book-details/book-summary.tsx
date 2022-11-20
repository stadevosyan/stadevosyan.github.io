import { Button, Divider, Form, Stack } from '@servicetitan/design-system';
import { FilePicker } from '../../../common/components/file-picker/file-picker';

export const BookSummary = () => {
    return (
        <Stack className="p-y-3" direction="column">
            <Form.Group className="align-items-stretch">
                <FilePicker
                    className="p-l-2"
                    downloadable
                    buttonProps={{
                        buttonLabel: 'Կցել գրքի լուսանկարը',
                        typesNote: 'Թույլատրված ֆայլերի տեսակները: jpeg, png, jpg, svg',
                    }}
                />
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
