/* tslint:disable */
/* eslint-disable */
//----------------------
// <auto-generated>
//     Generated with ApiClientGenerator, using the NSwag toolchain
// </auto-generated>
//----------------------
// ReSharper disable InconsistentNaming

import axios, { AxiosRequestConfig, AxiosPromise, AxiosInstance, CancelToken } from 'axios';
import { injectable, inject, optional, symbolToken } from '@servicetitan/react-ioc';
// @ts-ignore: needed for Date serialization if a DateTime parameter has an Unspecified attribute on it
import moment from 'moment';

interface ClientApiConfig {
    baseUrl: string;
    axios: AxiosInstance;
}

export const BASE_URL_TOKEN_ELibraryApi = symbolToken<string>('BASE_URL_TOKEN', false);
export const AXIOS_TOKEN_ELibraryApi = symbolToken<string>('AXIOS_TOKEN', false);

@injectable()
export class ELibraryApi {
    protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
    protected readonly opts: ClientApiConfig;

    constructor(
        @inject(BASE_URL_TOKEN_ELibraryApi) @optional() baseUrl = '',
        @inject(AXIOS_TOKEN_ELibraryApi) @optional() axiosInstance = axios,
    ) {

        this.opts = {
            baseUrl,
            axios: axiosInstance,
        };
    }

    /**
     * @return Signed up
     */
    authController_signUpUser(body: CreateUserDto, cancelToken?: CancelToken): AxiosPromise<void> {
        let url_ = "/auth/signup";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.opts.axios.request<void>(options_);
    }

    authController_signInUser(body: LoginUserDto, cancelToken?: CancelToken): AxiosPromise<LoginResponseDto> {
        let url_ = "/auth/signin";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<LoginResponseDto>(options_);
    }

    usersController_getUsers(name: string | undefined, page: number | undefined, pageSize: number | undefined, cancelToken?: CancelToken): AxiosPromise<GetUsersResponseDto> {
        let url_ = "/users?";
        if (name === null)
            throw new Error("The parameter 'name' cannot be null.");
        else if (name !== undefined)
            url_ += "name=" + encodeURIComponent("" + name) + "&";
        if (page === null)
            throw new Error("The parameter 'page' cannot be null.");
        else if (page !== undefined)
            url_ += "page=" + encodeURIComponent("" + page) + "&";
        if (pageSize === null)
            throw new Error("The parameter 'pageSize' cannot be null.");
        else if (pageSize !== undefined)
            url_ += "pageSize=" + encodeURIComponent("" + pageSize) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<GetUsersResponseDto>(options_);
    }

    usersController_getMyProfile(cancelToken?: CancelToken): AxiosPromise<UserEntity> {
        let url_ = "/users/profile";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<UserEntity>(options_);
    }

    usersController_editMyProfile(body: EditUserDto, cancelToken?: CancelToken): AxiosPromise<UserEntity> {
        let url_ = "/users/profile";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<UserEntity>(options_);
    }

    usersController_getUserById(id: number, cancelToken?: CancelToken): AxiosPromise<UserEntity> {
        let url_ = "/users/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<UserEntity>(options_);
    }

    usersController_editCategory(id: number, body: EditUserDto, cancelToken?: CancelToken): AxiosPromise<UserEntity> {
        let url_ = "/users/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<UserEntity>(options_);
    }

    usersController_deleteCategory(id: number, cancelToken?: CancelToken): AxiosPromise<void> {
        let url_ = "/users/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.opts.axios.request<void>(options_);
    }

    booksController_addBook(body: CreateBookDto, cancelToken?: CancelToken): AxiosPromise<void> {
        let url_ = "/books";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.opts.axios.request<void>(options_);
    }

    booksController_getBooks(title: string | undefined, cancelToken?: CancelToken): AxiosPromise<GetBooksResponseDto> {
        let url_ = "/books?";
        if (title === null)
            throw new Error("The parameter 'title' cannot be null.");
        else if (title !== undefined)
            url_ += "title=" + encodeURIComponent("" + title) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<GetBooksResponseDto>(options_);
    }

    booksController_editCategory(id: number, body: EditBookDto, cancelToken?: CancelToken): AxiosPromise<BookEntity> {
        let url_ = "/books/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<BookEntity>(options_);
    }

    categoryController_addCategory(body: CreateCategoryDto, cancelToken?: CancelToken): AxiosPromise<void> {
        let url_ = "/category";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.opts.axios.request<void>(options_);
    }

    categoryController_getCategories(name: string | undefined, cancelToken?: CancelToken): AxiosPromise<void> {
        let url_ = "/category?";
        if (name === null)
            throw new Error("The parameter 'name' cannot be null.");
        else if (name !== undefined)
            url_ += "name=" + encodeURIComponent("" + name) + "&";
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.opts.axios.request<void>(options_);
    }

    categoryController_getCategoryById(id: number, cancelToken?: CancelToken): AxiosPromise<CategoryEntity> {
        let url_ = "/category/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<CategoryEntity>(options_);
    }

    categoryController_editCategory(id: number, body: EditCategoryDto, cancelToken?: CancelToken): AxiosPromise<CategoryEntity> {
        let url_ = "/category/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<CategoryEntity>(options_);
    }

    categoryController_deleteCategory(id: number, cancelToken?: CancelToken): AxiosPromise<void> {
        let url_ = "/category/{id}";
        if (id === undefined || id === null)
            throw new Error("The parameter 'id' must be defined.");
        url_ = url_.replace("{id}", encodeURIComponent("" + id));
        url_ = url_.replace(/[?&]$/, "");

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            url: url_,
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            }
        };

        return this.opts.axios.request<void>(options_);
    }

    /**
     * @body file to upload
     */
    uploadController_uploadFile(body: any, cancelToken?: CancelToken): AxiosPromise<FileUploadResponseDto> {
        let url_ = "/upload";
        url_ = url_.replace(/[?&]$/, "");

        const content_ = body;

        let options_ = <AxiosRequestConfig>{
            baseURL: this.opts.baseUrl,
            cancelToken,
            data: content_,
            url: url_,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json"
            }
        };

        return this.opts.axios.request<FileUploadResponseDto>(options_);
    }
}

export class CreateUserDto implements ICreateUserDto {
    email!: string;
    password!: string;
    name!: string;
    phoneNumber!: string;
    profilePictureUrl!: string;

    [key: string]: any;

    constructor(data?: ICreateUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.email = _data["email"];
            this.password = _data["password"];
            this.name = _data["name"];
            this.phoneNumber = _data["phoneNumber"];
            this.profilePictureUrl = _data["profilePictureUrl"];
        }
    }

    static fromJS(data: any): CreateUserDto {
        data = typeof data === 'object' ? data : {};
        let result = new CreateUserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["email"] = this.email;
        data["password"] = this.password;
        data["name"] = this.name;
        data["phoneNumber"] = this.phoneNumber;
        data["profilePictureUrl"] = this.profilePictureUrl;
        return data;
    }
}

export interface ICreateUserDto {
    email: string;
    password: string;
    name: string;
    phoneNumber: string;
    profilePictureUrl: string;

    [key: string]: any;
}

export class LoginUserDto implements ILoginUserDto {
    email!: string;
    password!: string;

    [key: string]: any;

    constructor(data?: ILoginUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.email = _data["email"];
            this.password = _data["password"];
        }
    }

    static fromJS(data: any): LoginUserDto {
        data = typeof data === 'object' ? data : {};
        let result = new LoginUserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["email"] = this.email;
        data["password"] = this.password;
        return data;
    }
}

export interface ILoginUserDto {
    email: string;
    password: string;

    [key: string]: any;
}

export class LoginResponseDto implements ILoginResponseDto {
    access_token!: string;
    refresh_token!: string;

    [key: string]: any;

    constructor(data?: ILoginResponseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.access_token = _data["access_token"];
            this.refresh_token = _data["refresh_token"];
        }
    }

    static fromJS(data: any): LoginResponseDto {
        data = typeof data === 'object' ? data : {};
        let result = new LoginResponseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["access_token"] = this.access_token;
        data["refresh_token"] = this.refresh_token;
        return data;
    }
}

export interface ILoginResponseDto {
    access_token: string;
    refresh_token: string;

    [key: string]: any;
}

export class UserEntity implements IUserEntity {
    email!: string;
    password!: string;
    name!: string;
    role!: UserEntityRole;
    phoneNumber!: string;
    profilePictureUrl!: string;
    id!: number;
    created_at!: Date;
    updated_at!: Date;

    [key: string]: any;

    constructor(data?: IUserEntity) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.email = _data["email"];
            this.password = _data["password"];
            this.name = _data["name"];
            this.role = _data["role"];
            this.phoneNumber = _data["phoneNumber"];
            this.profilePictureUrl = _data["profilePictureUrl"];
            this.id = _data["id"];
            this.created_at = _data["created_at"] ? new Date(_data["created_at"].toString()) : <any>undefined;
            this.updated_at = _data["updated_at"] ? new Date(_data["updated_at"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): UserEntity {
        data = typeof data === 'object' ? data : {};
        let result = new UserEntity();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["email"] = this.email;
        data["password"] = this.password;
        data["name"] = this.name;
        data["role"] = this.role;
        data["phoneNumber"] = this.phoneNumber;
        data["profilePictureUrl"] = this.profilePictureUrl;
        data["id"] = this.id;
        data["created_at"] = this.created_at ? this.created_at.toISOString() : <any>undefined;
        data["updated_at"] = this.updated_at ? this.updated_at.toISOString() : <any>undefined;
        return data;
    }
}

export interface IUserEntity {
    email: string;
    password: string;
    name: string;
    role: UserEntityRole;
    phoneNumber: string;
    profilePictureUrl: string;
    id: number;
    created_at: Date;
    updated_at: Date;

    [key: string]: any;
}

export class GetUsersResponseDto implements IGetUsersResponseDto {
    data!: UserEntity[];
    count!: number;

    [key: string]: any;

    constructor(data?: IGetUsersResponseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
        if (!data) {
            this.data = [];
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            if (Array.isArray(_data["data"])) {
                this.data = [] as any;
                for (let item of _data["data"])
                    this.data!.push(UserEntity.fromJS(item));
            }
            this.count = _data["count"];
        }
    }

    static fromJS(data: any): GetUsersResponseDto {
        data = typeof data === 'object' ? data : {};
        let result = new GetUsersResponseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        if (Array.isArray(this.data)) {
            data["data"] = [];
            for (let item of this.data)
                data["data"].push(item.toJSON());
        }
        data["count"] = this.count;
        return data;
    }
}

export interface IGetUsersResponseDto {
    data: UserEntity[];
    count: number;

    [key: string]: any;
}

export class EditUserDto implements IEditUserDto {
    name!: string;
    profilePictureUrl!: string;
    phoneNumber!: string;

    [key: string]: any;

    constructor(data?: IEditUserDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.name = _data["name"];
            this.profilePictureUrl = _data["profilePictureUrl"];
            this.phoneNumber = _data["phoneNumber"];
        }
    }

    static fromJS(data: any): EditUserDto {
        data = typeof data === 'object' ? data : {};
        let result = new EditUserDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["name"] = this.name;
        data["profilePictureUrl"] = this.profilePictureUrl;
        data["phoneNumber"] = this.phoneNumber;
        return data;
    }
}

export interface IEditUserDto {
    name: string;
    profilePictureUrl: string;
    phoneNumber: string;

    [key: string]: any;
}

export class CreateBookDto implements ICreateBookDto {
    title!: string;
    description!: string;
    author!: string;
    categoryIds!: number[];
    pictureUrl!: string;

    [key: string]: any;

    constructor(data?: ICreateBookDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
        if (!data) {
            this.categoryIds = [];
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.title = _data["title"];
            this.description = _data["description"];
            this.author = _data["author"];
            if (Array.isArray(_data["categoryIds"])) {
                this.categoryIds = [] as any;
                for (let item of _data["categoryIds"])
                    this.categoryIds!.push(item);
            }
            this.pictureUrl = _data["pictureUrl"];
        }
    }

    static fromJS(data: any): CreateBookDto {
        data = typeof data === 'object' ? data : {};
        let result = new CreateBookDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["title"] = this.title;
        data["description"] = this.description;
        data["author"] = this.author;
        if (Array.isArray(this.categoryIds)) {
            data["categoryIds"] = [];
            for (let item of this.categoryIds)
                data["categoryIds"].push(item);
        }
        data["pictureUrl"] = this.pictureUrl;
        return data;
    }
}

export interface ICreateBookDto {
    title: string;
    description: string;
    author: string;
    categoryIds: number[];
    pictureUrl: string;

    [key: string]: any;
}

export class EditBookDto implements IEditBookDto {
    title!: string;
    description!: string;
    author!: string;
    categoryIds!: number[];
    pictureUrl!: string;

    [key: string]: any;

    constructor(data?: IEditBookDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
        if (!data) {
            this.categoryIds = [];
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.title = _data["title"];
            this.description = _data["description"];
            this.author = _data["author"];
            if (Array.isArray(_data["categoryIds"])) {
                this.categoryIds = [] as any;
                for (let item of _data["categoryIds"])
                    this.categoryIds!.push(item);
            }
            this.pictureUrl = _data["pictureUrl"];
        }
    }

    static fromJS(data: any): EditBookDto {
        data = typeof data === 'object' ? data : {};
        let result = new EditBookDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["title"] = this.title;
        data["description"] = this.description;
        data["author"] = this.author;
        if (Array.isArray(this.categoryIds)) {
            data["categoryIds"] = [];
            for (let item of this.categoryIds)
                data["categoryIds"].push(item);
        }
        data["pictureUrl"] = this.pictureUrl;
        return data;
    }
}

export interface IEditBookDto {
    title: string;
    description: string;
    author: string;
    categoryIds: number[];
    pictureUrl: string;

    [key: string]: any;
}

export class CategoryEntity implements ICategoryEntity {
    name!: string;
    id!: number;
    created_at!: Date;
    updated_at!: Date;

    [key: string]: any;

    constructor(data?: ICategoryEntity) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.name = _data["name"];
            this.id = _data["id"];
            this.created_at = _data["created_at"] ? new Date(_data["created_at"].toString()) : <any>undefined;
            this.updated_at = _data["updated_at"] ? new Date(_data["updated_at"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): CategoryEntity {
        data = typeof data === 'object' ? data : {};
        let result = new CategoryEntity();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["name"] = this.name;
        data["id"] = this.id;
        data["created_at"] = this.created_at ? this.created_at.toISOString() : <any>undefined;
        data["updated_at"] = this.updated_at ? this.updated_at.toISOString() : <any>undefined;
        return data;
    }
}

export interface ICategoryEntity {
    name: string;
    id: number;
    created_at: Date;
    updated_at: Date;

    [key: string]: any;
}

export class BookEntity implements IBookEntity {
    title!: string;
    description!: string;
    author!: string;
    count!: number;
    pictureUrl!: string;
    holdCount!: number;
    categories!: CategoryEntity[];
    id!: number;
    created_at!: Date;
    updated_at!: Date;

    [key: string]: any;

    constructor(data?: IBookEntity) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
        if (!data) {
            this.categories = [];
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.title = _data["title"];
            this.description = _data["description"];
            this.author = _data["author"];
            this.count = _data["count"];
            this.pictureUrl = _data["pictureUrl"];
            this.holdCount = _data["holdCount"];
            if (Array.isArray(_data["categories"])) {
                this.categories = [] as any;
                for (let item of _data["categories"])
                    this.categories!.push(CategoryEntity.fromJS(item));
            }
            this.id = _data["id"];
            this.created_at = _data["created_at"] ? new Date(_data["created_at"].toString()) : <any>undefined;
            this.updated_at = _data["updated_at"] ? new Date(_data["updated_at"].toString()) : <any>undefined;
        }
    }

    static fromJS(data: any): BookEntity {
        data = typeof data === 'object' ? data : {};
        let result = new BookEntity();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["title"] = this.title;
        data["description"] = this.description;
        data["author"] = this.author;
        data["count"] = this.count;
        data["pictureUrl"] = this.pictureUrl;
        data["holdCount"] = this.holdCount;
        if (Array.isArray(this.categories)) {
            data["categories"] = [];
            for (let item of this.categories)
                data["categories"].push(item.toJSON());
        }
        data["id"] = this.id;
        data["created_at"] = this.created_at ? this.created_at.toISOString() : <any>undefined;
        data["updated_at"] = this.updated_at ? this.updated_at.toISOString() : <any>undefined;
        return data;
    }
}

export interface IBookEntity {
    title: string;
    description: string;
    author: string;
    count: number;
    pictureUrl: string;
    holdCount: number;
    categories: CategoryEntity[];
    id: number;
    created_at: Date;
    updated_at: Date;

    [key: string]: any;
}

export class GetBooksResponseDto implements IGetBooksResponseDto {
    data!: BookEntity[];
    count!: number;

    [key: string]: any;

    constructor(data?: IGetBooksResponseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
        if (!data) {
            this.data = [];
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            if (Array.isArray(_data["data"])) {
                this.data = [] as any;
                for (let item of _data["data"])
                    this.data!.push(BookEntity.fromJS(item));
            }
            this.count = _data["count"];
        }
    }

    static fromJS(data: any): GetBooksResponseDto {
        data = typeof data === 'object' ? data : {};
        let result = new GetBooksResponseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        if (Array.isArray(this.data)) {
            data["data"] = [];
            for (let item of this.data)
                data["data"].push(item.toJSON());
        }
        data["count"] = this.count;
        return data;
    }
}

export interface IGetBooksResponseDto {
    data: BookEntity[];
    count: number;

    [key: string]: any;
}

export class CreateCategoryDto implements ICreateCategoryDto {
    name!: string;

    [key: string]: any;

    constructor(data?: ICreateCategoryDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): CreateCategoryDto {
        data = typeof data === 'object' ? data : {};
        let result = new CreateCategoryDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["name"] = this.name;
        return data;
    }
}

export interface ICreateCategoryDto {
    name: string;

    [key: string]: any;
}

export class EditCategoryDto implements IEditCategoryDto {
    name!: string;

    [key: string]: any;

    constructor(data?: IEditCategoryDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.name = _data["name"];
        }
    }

    static fromJS(data: any): EditCategoryDto {
        data = typeof data === 'object' ? data : {};
        let result = new EditCategoryDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["name"] = this.name;
        return data;
    }
}

export interface IEditCategoryDto {
    name: string;

    [key: string]: any;
}

export class FileUploadDto implements IFileUploadDto {
    file!: string;

    [key: string]: any;

    constructor(data?: IFileUploadDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.file = _data["file"];
        }
    }

    static fromJS(data: any): FileUploadDto {
        data = typeof data === 'object' ? data : {};
        let result = new FileUploadDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["file"] = this.file;
        return data;
    }
}

export interface IFileUploadDto {
    file: string;

    [key: string]: any;
}

export class FileUploadResponseDto implements IFileUploadResponseDto {
    filename!: string;
    url!: string;

    [key: string]: any;

    constructor(data?: IFileUploadResponseDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            for (var property in _data) {
                if (_data.hasOwnProperty(property))
                    this[property] = _data[property];
            }
            this.filename = _data["filename"];
            this.url = _data["url"];
        }
    }

    static fromJS(data: any): FileUploadResponseDto {
        data = typeof data === 'object' ? data : {};
        let result = new FileUploadResponseDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        for (var property in this) {
            if (this.hasOwnProperty(property))
                data[property] = this[property];
        }
        data["filename"] = this.filename;
        data["url"] = this.url;
        return data;
    }
}

export interface IFileUploadResponseDto {
    filename: string;
    url: string;

    [key: string]: any;
}

export enum UserEntityRole {
    User = "User",
    Admin = "Admin",
}