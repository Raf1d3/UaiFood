import { CategoryRepository } from "../repositories/categoryRepository.js";
import type { Prisma, Category } from "@prisma/client";





export class CategoryService {
  private categoryRepository = new CategoryRepository();

}