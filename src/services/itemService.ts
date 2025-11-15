import { ItemRepository } from "../repositories/itemRepository.js";
import type { Prisma, Item } from "@prisma/client";






export class ItemService {
  private itemRepository = new ItemRepository();

}