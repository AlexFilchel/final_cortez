export interface Product {
  id_key: number;
  name: string;
  price: number;
  stock: number;
  category_id?: number;
  description?: string;
  image_url?: string;
}
