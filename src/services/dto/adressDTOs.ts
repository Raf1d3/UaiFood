export interface ICreateAddressDto {
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface IUpdateAddressDto {
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}