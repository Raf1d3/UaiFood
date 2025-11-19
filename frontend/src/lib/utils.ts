import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: any): string {
  // 1. Se não houver resposta da API (ex: servidor offline)
  if (!error.response) {
    return "Erro de conexão com o servidor.";
  }

  const data = error.response.data;

  // 2. Se a API retornou uma mensagem simples (ex: throw new Error("Msg"))
  if (data && typeof data.error === 'string') {
    return data.error;
  }

  // 3. Se a API retornou um erro do Zod (Objeto complexo)
  if (data && typeof data.error === 'object') {
    const zodError = data.error;
    
    // Tenta pegar erro do body (ex: campos do formulário)
    if (zodError.body) {
      // Pega a primeira chave (ex: "password", "email")
      const firstField = Object.keys(zodError.body)[0]; 
      // Retorna a primeira mensagem de erro desse campo
      if (firstField && zodError.body[firstField]?._errors?.[0]) {
        return zodError.body[firstField]._errors[0];
      }
    }
    
    // Tenta pegar erro global do Zod
    if (zodError._errors && zodError._errors.length > 0) {
      return zodError._errors[0];
    }
  }

  // 4. Fallback genérico
  return "Ocorreu um erro inesperado.";
}