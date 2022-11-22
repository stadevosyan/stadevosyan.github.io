import { inject, injectable } from '@servicetitan/react-ioc';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import download from 'downloadjs';
import { ELibraryApi } from '../api/e-library.client';
import { LoadStatus } from '../enums/load-status';
import { baseUrl } from '../../../app';

export interface FileParameter {
    data: any;
    fileName: string;
}

interface Size {
    width: number;
    height: number;
}

@injectable()
export class FilePickerStore {
    // added to filepicker
    @observable imageToUpload?: FileParameter;
    // valid image url received from BE
    @observable imageSentToBE?: string;
    // received from filepicker by prop
    @observable savedImageUrl?: string;

    @observable imageDeleted = false;
    @observable error?: string;
    @observable fileUploadStatus = LoadStatus.None;

    @computed get isDirty() {
        return !!this.imageSentToBE || !!this.imageToUpload || this.imageDeleted || this.error;
    }

    @computed get imageUrlToShow() {
        return this.imageToUpload
            ? URL.createObjectURL(this.imageToUpload.data)
            : this.urlToShow(this.imageSentToBE) ?? !this.imageDeleted
            ? this.urlToShow(this.savedImageUrl)
            : undefined;
    }

    @computed get imageUrlToSave() {
        if (this.imageSentToBE) {
            return this.imageSentToBE;
        }

        return !this.imageDeleted ? this.savedImageUrl : undefined;
    }

    constructor(@inject(ELibraryApi) private readonly api: ELibraryApi) {
        makeObservable(this);
    }

    @action setSavedImageUrl = (imageUrl: string) => {
        this.savedImageUrl = imageUrl;
        this.reset();
    };

    @action deleteImage = () => {
        this.imageSentToBE = undefined;
        this.imageToUpload = undefined;
        this.error = undefined;
        this.imageDeleted = true;
    };

    @action reset = () => {
        this.imageSentToBE = undefined;
        this.imageToUpload = undefined;
        this.imageDeleted = false;
        this.error = undefined;
        this.setFileUploadStatus(LoadStatus.None);
    };

    @action downloadImage = () => {
        const result: any = Promise.resolve({});
        const extension = result.headers['content-type'] === 'image/png' ? 'png' : 'jpeg';
        if (result.data) {
            download(result.data, `image.${extension}`, `image/${extension}`);
        }
    };

    @action selectFile = async (files: FileList) => {
        const file: FileParameter = {
            data: files[0],
            fileName: files[0].name,
        };
        await this.addNewFile(file);
    };

    @action replaceFile = async (newFile: File) => {
        const file: FileParameter = {
            data: newFile,
            fileName: newFile.name,
        };
        await this.addNewFile(file);
    };

    @action setFileUploadStatus = (status: LoadStatus) => (this.fileUploadStatus = status);

    private urlToShow = (url?: string) => (url ? `${baseUrl}${url}` : undefined);

    private addNewFile = async (file: FileParameter) => {
        this.imageToUpload = file;
        const isValid = await this.verifyImageSize();
        if (isValid) {
            runInAction(() => (this.imageDeleted = false));
            this.setFileUploadStatus(LoadStatus.Loading);
            const fileForm = new FormData();
            fileForm.append('file', file.data);

            try {
                const { data } = await this.api.uploadController_uploadFile(fileForm);
                runInAction(() => {
                    this.imageSentToBE = data.url;
                });
                this.setFileUploadStatus(LoadStatus.Ok);
            } catch {
                this.setFileUploadStatus(LoadStatus.Error);
            }
        }
    };

    @action private async verifyImageSize() {
        const size = await this.getImageSize(this.imageUrlToShow!);
        runInAction(() => {
            if (size) {
                const MIN_SIZE = 180;
                if (size.height < MIN_SIZE || size.width < MIN_SIZE) {
                    this.error = 'Please use an image that is at least 180x180px in size.';
                } else {
                    this.error = undefined;
                }
            } else {
                this.error = 'File is not a valid image';
            }
        });
        return !this.error;
    }

    private getImageSize = (url: string) => {
        return new Promise<Size | undefined>(resolve => {
            const image = document.createElement('img');
            image.onload = () => {
                resolve({ width: image.width, height: image.height });
            };
            image.onerror = () => {
                resolve(undefined);
            };
            image.src = url;
        });
    };
}
