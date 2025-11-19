'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Pencil } from 'lucide-react';
import { Address } from '@/types'
import { toast } from "sonner"

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

interface AddressFormModalProps {
  onSuccess: () => void;
  addressToEdit?: Address | null; // Se vier preenchido, é modo EDIÇÃO
  targetUserId?: string;
}

export function AddressFormModal({ onSuccess, addressToEdit, targetUserId }: AddressFormModalProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    street: '',
    number: '',
    district: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // Efeito para carregar dados se for edição
  useEffect(() => {
    if (isOpen && addressToEdit) {
      setFormData({
        street: addressToEdit.street,
        number: addressToEdit.number,
        district: addressToEdit.district,
        city: addressToEdit.city,
        state: addressToEdit.state,
        zipCode: addressToEdit.zipCode,
      });
    } else if (isOpen && !addressToEdit) {
      // Limpa se for criação
      setFormData({
        street: '',
        number: '',
        district: '',
        city: '',
        state: '',
        zipCode: '',
      });
    }
  }, [isOpen, addressToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const userIdToUse = targetUserId || user?.id;

    if (!userIdToUse) {
        toast.error("Usuário não autenticado.");
        setIsLoading(false);
        return;
    }

    try {
      if (addressToEdit) {
        // --- MODO EDIÇÃO (PUT) ---
        await api.put(`/address/${addressToEdit.id}`, formData);
        toast.success("Endereço atualizado!");
      } else {
        // --- MODO CRIAÇÃO (POST) ---
        await api.post(`/address/${userIdToUse}`, formData);
        toast.success("Novo endereço cadastrado!");
      }

      setIsOpen(false);
      onSuccess(); // Recarrega a lista pai
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao salvar endereço.';
      console.error('Erro ao salvar endereço:', err);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isEditing = !!addressToEdit;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="icon">
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
        ) : (
          // O botão 'Adicionar Novo Endereço' na página de Checkout
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> Adicionar Novo
          </Button>
        )}
      </DialogTrigger>
      
      {/* 6. Este é o conteúdo do Pop-up (Modal) */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Endereço' : 'Novo Endereço'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Altere os dados do seu endereço abaixo.' : 'Preencha os dados do novo endereço de entrega.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="street" className="text-right">Rua</Label>
              <Input
                id="street"
                value={formData.street}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">Número</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="district" className="text-right">Bairro</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">Cidade</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">UF</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={handleChange}
                className="col-span-3"
                maxLength={2}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zipCode" className="text-right">CEP</Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>

          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}