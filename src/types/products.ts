export interface Product {
  id: string;
  title: string;
  price: number;
  images_urls: string[];
  status: string;
}

export interface Favorite {
  id: string;
  product: Product | Product[];
}