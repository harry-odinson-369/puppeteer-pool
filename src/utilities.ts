export default class Utilities {
    static random_number(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}