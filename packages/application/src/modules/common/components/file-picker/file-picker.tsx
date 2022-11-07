import { observer } from 'mobx-react';
import {
    FilePicker as Picker,
    ButtonGroup,
    Tooltip,
    Button,
    Card,
    Banner,
    Stack,
} from '@servicetitan/design-system';
import { useDependencies } from '@servicetitan/react-ioc';
import { ChangeEvent, FC, useRef } from 'react';

import { FilePickerStore } from '../../stores/file-picker.store';

import * as Styles from './file-picker.module.less';

interface ButtonProps {
    buttonLabel?: string;
    typesNote?: string;
}

interface FilePickerProps {
    buttonProps: ButtonProps;
    className?: string;
    replaceable?: boolean;
    deletable?: boolean;
    downloadable?: boolean;
    fieldError?: string;
    banner?: boolean;
}

export const FilePicker: FC<FilePickerProps> = observer(
    ({ buttonProps, fieldError, banner, replaceable, deletable, downloadable, className = '' }) => {
        const [fileStore] = useDependencies(FilePickerStore);
        const fileRef = useRef<HTMLInputElement>(null);
        const { buttonLabel, typesNote } = buttonProps;
        const handleClick = () => fileRef.current?.click();
        const handleReplace = async (e: ChangeEvent<HTMLInputElement>) => {
            const newFile = e.target.files?.[0];
            if (!newFile) {
                return;
            }
            await fileStore.replaceFile(newFile);
        };

        const error = fieldError ?? fileStore.error;

        return (
            <Stack className={className}>
                {/* <Label required>Logo</Label>*/}
                {!!error && <Banner status="critical" title={error} icon className="m-y-2" />}
                {!fileStore.imageUrl ? (
                    <Picker
                        buttonLabel={buttonLabel}
                        buttonProps={{ iconName: 'add_a_photo' }}
                        onSelected={fileStore.selectFile}
                        accept="image/png, image/jpeg, .svg"
                        typesNote={typesNote}
                    />
                ) : (
                    <Card raised padding="thin" className={Styles.logoCard}>
                        {/* <Card.Section>*/}
                        <img src={fileStore.imageUrl} alt="cover" />
                        <div className={Styles.logoAction}>
                            <ButtonGroup>
                                {replaceable && (
                                    <Tooltip el="div" text="Փոխել">
                                        <Button
                                            outline
                                            iconName="edit"
                                            onClick={handleClick}
                                            className="shadow-1-i bg-white-i"
                                        />
                                        <input
                                            hidden
                                            type="file"
                                            accept="image/png, image/jpeg, .svg"
                                            ref={fileRef}
                                            onChange={handleReplace}
                                        />
                                    </Tooltip>
                                )}
                                {downloadable && (
                                    <Tooltip el="div" text="Ներբերել">
                                        <Button
                                            outline
                                            iconName="file_download"
                                            onClick={fileStore.download}
                                            disabled={fileStore.imageToUpload !== undefined}
                                            className="shadow-1-i bg-white-i"
                                        />
                                    </Tooltip>
                                )}
                                {deletable && (
                                    <Tooltip el="div" text="հեռացնել">
                                        <Button
                                            outline
                                            iconName="delete"
                                            onClick={fileStore.deleteImage}
                                            className="shadow-1-i bg-white-i"
                                        />
                                    </Tooltip>
                                )}
                            </ButtonGroup>
                        </div>
                        {/* </Card.Section>*/}
                    </Card>
                )}
                {fileStore.recommendLargerImage && banner && (
                    <Banner
                        status="warning"
                        icon
                        title="We strongly recommend using a logo that is at least 180x180px in size. Using a lower-resolution image may result in logo pixelation in your templates."
                        className="m-t-2"
                    />
                )}
                {(!fileStore.imageUrl || fileStore.recommendLargerImage) && banner && (
                    <Banner icon title="Tips on Uploading Your Logo:" className="m-t-2">
                        <ul>
                            <li>
                                PNGs with a transparent background work best, but aren't required.
                            </li>
                            <li>
                                Don't know where your logo is? Your social media profile would be a
                                good place to look.
                            </li>
                            <li>Use a logo that is at least 180x180px in size.</li>
                            <li>
                                Avoid using a screenshot of your logo, right click and “save as” if
                                you're pulling it from somewhere else.
                            </li>
                        </ul>
                    </Banner>
                )}
            </Stack>
        );
    }
);
