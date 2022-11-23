import { baseUrl } from '../../../app';

export const urlToShow = (url?: string) => (url ? `${baseUrl}${url}` : undefined);

export const getAvatarFirstLetters = (name = '') => {
    let firstLetters = '';
    if (name) {
        const parts = name.trim().split(' ');
        parts.forEach(item => (firstLetters += item[0].toUpperCase()));
    }

    return firstLetters;
};
