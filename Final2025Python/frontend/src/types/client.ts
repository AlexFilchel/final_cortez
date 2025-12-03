export interface Client {
  id_key: number;
  name: string;
  lastname: string;
  email: string;
  telephone: string;
}

export interface ClientPayload {
  name: string;
  lastname: string;
  email: string;
  telephone: string;
}
