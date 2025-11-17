'use client';

import { useState } from 'react';
import api from '@/lib/api'; // (Assumindo que está em src/lib/api.ts)
import { useAuthStore } from '@/store/authStore'; // (Assumindo que está em src/store/authStore.ts)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

// 1. Defina uma "prop" para que este componente
//    possa "avisar" a página de checkout que um
//    novo endereço foi salvo.
interface AddressFormModalProps {
  onAddressAdded: () => void;
}

export function AddressFormModal({ onAddressAdded }: AddressFormModalProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Estados para o formulário
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) {
      setError('Você precisa estar logado para adicionar um endereço.');
      setIsLoading(false);
      return;
    }

    // 2. Monta o DTO que o Zod espera no back-end
    const addressData = {
      street,
      number,
      district,
      city,
      state,
      zipCode,
    };
    
    // 3. Usa a rota correta que criamos: POST /users/:id/addresses
    try {
      await api.post(`/users/${user.id}/addresses`, addressData);

      // Sucesso!
      setIsOpen(false); // Fecha o modal
      onAddressAdded(); // 4. Avisa a página de checkout para recarregar os endereços
      
      // Limpa o formulário
      setStreet('');
      setNumber('');
      setDistrict('');
      setCity('');
      setState('');
      setZipCode('');

    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao salvar endereço.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 5. O Dialog do Shadcn controla o estado de "aberto/fechado"
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Este é o botão que fica na página de checkout */}
        <Button variant="outline" size="sm" className="mt-2">
          Adicionar Novo Endereço
        </Button>
      </DialogTrigger>
      
      {/* 6. Este é o conteúdo do Pop-up (Modal) */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Endereço</DialogTitle>
          <DialogDescription>
            Preencha os dados do seu novo endereço de entrega.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Adicione os campos do formulário aqui */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">
                Rua
              </Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Número
              </Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="district" className="text-right">
                Bairro
              </Label>
              <Input
                id="district"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                Cidade
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">
                Estado (UF)
              </Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="col-span-3"
                maxLength={2}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zipCode" className="text-right">
                CEP
              </Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            {error && <p className="text-sm text-red-500 col-span-4">{error}</p>}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Salvar Endereço
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}