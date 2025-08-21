import { PageWithCursor } from "./types";
import Utilities from "./utilities";

export default class PageWrapper {
    constructor(page: PageWithCursor, id?: number) {
        this.__id = id ?? Utilities.random_number(10000, 999999);
        this.page = page;
    }
    __id: number;
    page?: PageWithCursor;
}