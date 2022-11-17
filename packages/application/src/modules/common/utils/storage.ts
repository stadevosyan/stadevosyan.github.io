export class Storage {
    static getItem(key: string) {
        const data = localStorage.getItem(key);

        if (data && data === Object(data)) {
            return JSON.parse(data);
        }
        return data;
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
