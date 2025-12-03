export type Category = {
  id_key: number;
  name: string;
};

export type Product = {
  id_key: number;
  name: string;
  price: number;
  stock: number;
  category_id: number;
  category?: Category;
  image?: string;
  description?: string;
};

export type Client = {
  id_key: number;
  name: string;
  lastname: string;
  email: string;
  telephone: string;
};

export type BillPayload = {
  bill_number: string;
  discount?: number;
  date: string;
  total: number;
  payment_type: string;
  client_id: number;
};

export type OrderPayload = {
  total: number;
  delivery_method: string;
  status?: string;
  client_id: number;
  bill_id: number;
};

export type OrderDetailPayload = {
  quantity: number;
  price: number;
  order_id: number;
  product_id: number;
};
