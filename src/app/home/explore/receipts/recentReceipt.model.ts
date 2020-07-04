export class RecentReceipt{
    constructor(public pk: string,
                public category: string,
                public  total_spending: string,
                public created_at: string,
                public receipt_image_set: [],
                public icon: string,
                ) {

    }
}
