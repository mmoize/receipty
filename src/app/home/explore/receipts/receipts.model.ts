export class  Receipt {
    constructor(
        public pk: string,
        public user: any[],
        // tslint:disable-next-line: variable-name
        public total_spending: string,
        public category: string,
        public tags: string,
        // tslint:disable-next-line: variable-name
        public receipt_image_set: any[],
        // tslint:disable-next-line: variable-name
        public created_at: Date,
        // tslint:disable-next-line: variable-name

    ) {}
}
