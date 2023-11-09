export interface ListProducts {
    id_product ?: number;
    name : string;
    description :  string | null;
    image_product : string | null;
    weight : number | 0;
    variation ?: any;
}
