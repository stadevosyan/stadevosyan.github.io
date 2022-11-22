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
import { ChangeEvent, FC, useEffect, useRef } from 'react';

import { FilePickerStore } from '../../stores/file-picker.store';

import * as Styles from './file-picker.module.less';

interface ButtonProps {
    buttonLabel?: string;
    typesNote?: string;
}

interface FilePickerProps {
    imageUrlParam?: string;
    buttonProps: ButtonProps;
    className?: string;
    downloadable?: boolean;
}

export const FilePicker: FC<FilePickerProps> = observer(
    ({ buttonProps, className = '', imageUrlParam, downloadable }) => {
        const [
            {
                replaceFile,
                setSavedImageUrl,
                error,
                imageUrlToShow,
                selectFile,
                downloadImage,
                deleteImage,
                imageToUpload,
            },
        ] = useDependencies(FilePickerStore);
        const fileRef = useRef<HTMLInputElement>(null);
        const { buttonLabel, typesNote } = buttonProps;
        const handleClick = () => fileRef.current?.click();
        const handleReplace = async (e: ChangeEvent<HTMLInputElement>) => {
            const newFile = e.target.files?.[0];
            if (!newFile) {
                return;
            }
            await replaceFile(newFile);
        };

        useEffect(() => {
            if (imageUrlParam !== undefined) {
                setSavedImageUrl(imageUrlParam);
            }
        }, [imageUrlParam, setSavedImageUrl]);

        return (
            <Stack className={className} direction="column" spacing={1}>
                {/* <Label required>Logo</Label>*/}
                {!!error && <Banner status="critical" title={error} icon className="m-y-2" />}
                {!imageUrlToShow ? (
                    <Picker
                        buttonLabel={buttonLabel}
                        buttonProps={{ iconName: 'add_a_photo' }}
                        onSelected={selectFile}
                        accept="image/png, image/jpeg, .svg"
                        typesNote={typesNote}
                    />
                ) : (
                    <Card raised padding="thin" className={Styles.logoCard}>
                        <Stack
                            direction="column"
                            justifyContent="center"
                            className={Styles.logoContainer}
                        >
                            <img src={imageUrlToShow} alt="cover" />
                            <div className={Styles.logoAction}>
                                <ButtonGroup>
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
                                    {downloadable && (
                                        <Tooltip el="div" text="Ներբերել">
                                            <Button
                                                outline
                                                iconName="file_download"
                                                onClick={downloadImage}
                                                disabled={imageToUpload !== undefined}
                                                className="shadow-1-i bg-white-i"
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip el="div" text="հեռացնել">
                                        <Button
                                            outline
                                            iconName="delete"
                                            onClick={deleteImage}
                                            className="shadow-1-i bg-white-i"
                                        />
                                    </Tooltip>
                                </ButtonGroup>
                            </div>
                        </Stack>
                    </Card>
                )}
            </Stack>
        );
    }
);
