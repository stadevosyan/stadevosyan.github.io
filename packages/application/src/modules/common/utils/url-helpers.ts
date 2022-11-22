import { baseUrl } from '../../../app';

export const urlToShow = (url?: string) => (url ? `${baseUrl}${url}` : undefined);

export const getAvatarFirstLetters = (name = '') => {
    const parts = name.trim().split(' ');
    let firstLetters = '';
    parts.forEach(item => (firstLetters += item[0].toUpperCase()));

    return firstLetters;
};
