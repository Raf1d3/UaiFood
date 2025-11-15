import { AddressRepository } from "../repositories/addressRepository.js";
import type { Prisma, Address } from "@prisma/client";
import { UserRepository } from "../repositories/userRepository.js";
import type { ICreateAddressDto, IUpdateAddressDto } from "./dto/adressDTOs.js";

export class AddressService {
  private addressRepository = new AddressRepository();
  private userRepository = new UserRepository();

  async create(userId: bigint, data: ICreateAddressDto): Promise<Address> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("Usuário não encontrado. Impossível criar endereço.");
    }

    const dataToSave: Prisma.AddressCreateInput = {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    };

    return this.addressRepository.create(dataToSave);
  }

  async update(
    userId: bigint,
    addressId: bigint,
    data: IUpdateAddressDto
  ): Promise<Address> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    if (address.userId !== userId) {
      throw new Error("Acesso negado. Este endereço não pertence a você.");
    }

    return this.addressRepository.update(addressId, data);
  }

  async delete(
    userId: bigint,
    addressId: bigint
  ): Promise<{ message: string }> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new Error("Endereço não encontrado.");
    }

    if (address.userId !== userId) {
      throw new Error("Acesso negado. Este endereço não pertence a você.");
    }

    await this.addressRepository.delete(addressId);
    return { message: "Endereço deletado com sucesso" };
  }

  async findAllUserId(userId: bigint): Promise<Address[]> {
    const addressUser = await this.addressRepository.findAllByUserId(userId);

    return addressUser;
  }


}
