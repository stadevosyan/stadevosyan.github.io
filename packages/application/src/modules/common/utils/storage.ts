export class Storage {
    static getItem(key: string) {
        const data = localStorage.getItem(key);
        return data && JSON.parse(data);
    }

    static setItem(key: string, value: unknown): void {
        let data = value;
        if (value === Object(value)) {
            data = JSON.stringify(value);
        }
        localStorage.setItem(key, data as string);
    }

    static removeItem(key: string): void {
        localStorage.removeItem(key);
    }
}
