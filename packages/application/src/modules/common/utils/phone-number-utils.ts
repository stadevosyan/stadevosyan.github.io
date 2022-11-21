export const phoneNumberToThreeDigitFormat = (number: string) => {
    let numberToShow = number;
    if (numberToShow.length >= 9) {
        numberToShow = numberToShow.slice(-8);
    }
    if (numberToShow.length === 8) {
        numberToShow = `0${numberToShow}`;
        numberToShow = numberToShow.match(/.{1,3}/g)!.join('-');
    }
    return numberToShow;
};
