export interface IUpdateUserDto {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  birthDate?: string | Date;
}