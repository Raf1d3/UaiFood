'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner"


export function AdminItems() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Form States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCatId, setEditCatId] = useState('');
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCatId, setNewCatId] = useState('');

  const fetchData = async () => {
    try {
    const [itemsRes, catsRes] = await Promise.all([
      api.get('/items'),
      api.get('/categories')
    ]);
    setItems(itemsRes.data);
    setCategories(catsRes.data);
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao carregar produtos."); 
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchData();
    };
    fetch();
  }, []);

  const handleCreate = async () => {
    try {
      await api.post('/items', {
        description: newName,
        unitPrice: parseFloat(newPrice),
        categoryId: newCatId
      });
      setNewName(''); setNewPrice(''); setNewCatId('');
      fetchData(); // Recarrega a lista
      toast.success("Produto adicionado com sucesso!");
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao criar produto."); 
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/items/${id}`);
      fetchData();
      toast.success("Produto removido.");
      fetchData();
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao deletar produto."); 
    }
  };

  const openEditModal = (item: any) => {
    setEditId(item.id);
    setEditName(item.description);
    setEditPrice(item.unitPrice); // Prisma manda string, input number aceita string numérica
    setEditCatId(item.categoryId);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/items/${editId}`, {
        description: editName,
        unitPrice: parseFloat(editPrice),
        categoryId: editCatId
      });
      setIsEditOpen(false);
      fetchData();
      toast.success("Produto atualizado com sucesso!");
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao atualizar produto."); 
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 items-end p-4 rounded-lg border">
        <div className="space-y-2">
          <span className="text-sm font-medium">Nome do Produto</span>
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Coca-Cola" />
        </div>
        <div className="space-y-2 w-32">
          <span className="text-sm font-medium">Preço</span>
          <Input type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="0.00" />
        </div>
        <div className="space-y-2 w-48">
          <span className="text-sm font-medium">Categoria</span>
          <Select value={newCatId} onValueChange={setNewCatId}>
            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
            <SelectContent>
              {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.description}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleCreate} disabled={!newName || !newPrice || !newCatId}>
          <Plus className="mr-2 h-4 w-4" /> Adicionar
        </Button>
      </div>

      {/* Modal de Edição (Compartilhado) */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Editar Produto</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <span className="text-sm font-medium">Nome</span>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <span className="text-sm font-medium">Preço</span>
                    <Input type="number" value={editPrice} onChange={e => setEditPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                    <span className="text-sm font-medium">Categoria</span>
                    <Select value={editCatId} onValueChange={setEditCatId}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.description}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full" onClick={handleUpdate}>Salvar Alterações</Button>
            </div>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.description}</TableCell>
              <TableCell>R$ {parseFloat(item.unitPrice).toFixed(2)}</TableCell>
              <TableCell>{item.category?.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
                  <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir <strong>{item.description}</strong>? Esta ação é irreversível.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Sim, excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}