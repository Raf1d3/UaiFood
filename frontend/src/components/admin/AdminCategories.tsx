'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Plus, Pencil, Save, X, Loader2 } from 'lucide-react';
import { toast } from "sonner"

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

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newDesc, setNewDesc] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDesc, setEditDesc] = useState('');
  const [loading, setLoading] = useState(false);

const fetchCats = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao carregar categorias."); 
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchCats();
    };
    fetch();
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await api.post('/categories', { description: newDesc });
      setNewDesc('');
      fetchCats();
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao criar categoria."); 
    } finally {
      setLoading(false);
    }

  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      fetchCats();
    } catch (e: any) { 
      console.error(e);
      // Mensagem específica para erro de FK (categoria em uso)
      const msg = e.response?.data?.error || "Erro ao deletar categoria.";
      toast.error(msg);
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      await api.put(`/categories/${id}`, { description: editDesc });
      setEditingId(null);
      fetchCats();
    } catch (e) { 
      console.error(e);
      toast.error("Erro ao atualizar categoria."); 
    }
  };

  const startEditing = (cat: any) => {
    setEditingId(cat.id);
    setEditDesc(cat.description);
  };

return (
    <div className="space-y-6">
      {/* --- Formulário de Criação --- */}
      <div className="flex gap-4 items-end p-4 rounded-lg border max-w-lg">
        <div className="space-y-2 flex-1">
          <span className="text-sm font-medium">Nova Categoria</span>
          <Input 
            value={newDesc} 
            onChange={e => setNewDesc(e.target.value)} 
            placeholder="Ex: Bebidas" 
          />
        </div>
        <Button onClick={handleCreate} disabled={!newDesc || !!loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} 
          Criar
        </Button>
      </div>

      {/* --- Tabela de Categorias --- */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-center w-[100px]">Qtd. Produtos</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat: any) => {
              // Lógica de Negócio Local
              const itemCount = cat._count?.items || 0;
              const canDelete = itemCount === 0;

              return (
                <TableRow key={cat.id}>
                  {/* Coluna 1: Descrição (Com Edição Inline) */}
                  <TableCell>
                    {editingId === cat.id ? (
                      <div className="flex gap-2">
                        <Input 
                            value={editDesc} 
                            onChange={(e) => setEditDesc(e.target.value)} 
                            className="h-8"
                        />
                        <Button size="icon" variant="ghost" onClick={() => handleUpdate(cat.id)}>
                            <Save className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                            <X className="h-4 w-4 text-gray-500" />
                        </Button>
                      </div>
                    ) : (
                      cat.description
                    )}
                  </TableCell>

                  {/* Coluna 2: Contagem de Itens */}
                  <TableCell className="text-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${itemCount > 0 ? 'bg-blue-100 dark:bg-gray-800 text-blue-700' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {itemCount}
                    </span>
                  </TableCell>

                  {/* Coluna 3: Ações */}
                  <TableCell className="text-right flex justify-end gap-2">
                    {/* Botão Editar */}
                    {editingId !== cat.id && (
                        <Button variant="ghost" size="icon" onClick={() => startEditing(cat)}>
                            <Pencil className="h-4 w-4 text-blue-600" />
                        </Button>
                    )}

                    {/* Botão Excluir */}
                    {canDelete ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Categoria?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(cat.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sim, excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      // SE NÃO PODE DELETAR: Mostra botão desabilitado com dica
                      <div className="inline-block" title="Não é possível excluir categorias com produtos vinculados.">
                        <Button variant="ghost" size="icon" disabled className="opacity-30 cursor-not-allowed">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}