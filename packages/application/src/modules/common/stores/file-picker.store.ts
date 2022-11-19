import { inject, injectable } from '@servicetitan/react-ioc';
import { makeObservable, observable, runInAction, action, computed } from 'mobx';
import download from 'downloadjs';

import { ELibraryApi } from '../api/e-library.client';

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
    @observable savedImageUrl?: string;
    @observable imageToUpload?: FileParameter;
    @observable loaded = false;
    @observable recommendLargerImage = false;
    @observable error?: string;
    @observable private imageDeleted = false;
    private integrationId?: number;

    @computed get imageUrl() {
        return this.imageToUpload
            ? URL.createObjectURL(this.imageToUpload.data)
            : this.imageDeleted
            ? undefined
            : this.savedImageUrl;
    }

    constructor(@inject(ELibraryApi) private api: ELibraryApi) {
        makeObservable(this);
    }

    @action init = (integrationId?: number, logoUrl?: string) => {
        this.integrationId = integrationId;
        this.savedImageUrl = logoUrl;
    };

    @action reset = (integrationId?: number, logoUrl?: string) => {
        this.init(integrationId, logoUrl);
        this.imageToUpload = undefined;
        this.loaded = false;
        this.recommendLargerImage = false;
        this.error = undefined;
        this.imageDeleted = false;
    };

    @action setImageUrl = async (imageUrl: string) => {
        this.savedImageUrl = imageUrl;
        this.imageDeleted = false;
        await this.verifyImageSize();
    };

    @action deleteImage = () => {
        this.imageDeleted = true;
        this.imageToUpload = undefined;
        this.recommendLargerImage = false;
    };

    @action cancel = () => {
        this.imageToUpload = undefined;
        this.imageDeleted = false;
    };

    @action download = () => {
        const result: any = Promise.resolve({});
        const extension = result.headers['content-type'] === 'image/png' ? 'png' : 'jpeg';
        if (result.data) {
            download(result.data, `logo.${extension}`, `image/${extension}`);
        }
    };

    @action selectFile = async (files: FileList) => {
        const file: FileParameter = {
            data: files[0],
            fileName: files[0].name,
        };
        await this.addNewFile(file);
    };

    @action uploadFile = async () => {
        if (this.imageToUpload) {
            try {
                const result: any = Promise.resolve({});
                await this.setImageUrl(result.data);
            } finally {
                runInAction(() => {
                    this.imageToUpload = undefined;
                });
            }
        }
    };

    @action replaceFile = async (newFile: File) => {
        const file: FileParameter = {
            data: newFile,
            fileName: newFile.name,
        };
        await this.addNewFile(file);
    };

    @action private addNewFile = async (file: FileParameter) => {
        this.imageToUpload = file;
        await this.verifyImageSize();
    };

    @action private async verifyImageSize() {
        this.loaded = false;
        const size = await this.getImageSize(this.imageUrl!);
        runInAction(() => {
            if (size) {
                const MIN_SIZE = 180;
                this.recommendLargerImage = size.height < MIN_SIZE || size.width < MIN_SIZE;
                this.error = undefined;
            } else {
                this.error = 'File is not a valid image';
            }
            this.loaded = true;
        });
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
