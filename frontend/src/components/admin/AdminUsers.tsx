"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, MapPin, Pencil, Loader2, Plus } from "lucide-react";
import { AddressFormModal } from "@/components/order/AddressFormModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

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
import { getErrorMessage } from "@/lib/utils";

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserAddresses, setSelectedUserAddresses] = useState<any[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    birthDate: "",
    userType: "CLIENT",
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthDate: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Erro ao carregar usuários.");
    }
  };

  useEffect(() => {
    const fetch = async () => {
      await fetchUsers();
    };
    fetch();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/user/${id}`);
      fetchUsers();
      toast.success("Usuário removido com sucesso.");
    } catch (e) {
      console.error(e);
      toast.error("Erro ao deletar usuário.");
    }
  };

  const fetchAddresses = async (userId: string) => {
    try {
      // Usa a rota de listar endereços por ID de usuário
      const res = await api.get(`/address/${userId}`);
      setSelectedUserAddresses(res.data);
    } catch (e) {
      setSelectedUserAddresses([]);
    }
  };

  const openEditModal = (user: any) => {
    setEditingUser(user);

    // Formata a data para o input (YYYY-MM-DD) se existir
    let formattedDate = "";
    if (user.birthDate) {
      const dateObj = new Date(user.birthDate);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split("T")[0];
      }
    }

    setEditFormData({
      name: user.name || "",
      phone: user.phone || "",
      birthDate: formattedDate,
      userType: user.userType || "CLIENT",
    });

    setIsEditOpen(true);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Usa a rota padrão de registro
      await api.post("/register", createFormData);

      toast.success("Usuário criado com sucesso!");
      setCreateFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        birthDate: "",
      }); // Limpa form
      setIsCreateOpen(false); // Fecha modal
      fetchUsers(); // Atualiza lista
    } catch (error: any) {
      console.error(error);
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setLoading(true);

      // Prepara o payload
      const payload: any = {
        name: editFormData.name,
        phone: editFormData.phone,
        userType: editFormData.userType,
      };

      // Só envia a data se estiver preenchida
      if (editFormData.birthDate) {
        payload.birthDate = editFormData.birthDate;
      }

      await api.put(`/user/${editingUser.id}`, payload);

      toast.success("Usuário atualizado com sucesso!");
      setIsEditOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      const errorMsg =
        error.response?.data?.error || "Erro ao atualizar usuário.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho com Botão de Adicionar */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Lista de Usuários</h3>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Novo Usuário
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      u.userType === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {u.userType}
                  </span>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(u)}
                    title="Editar Usuário"
                  >
                    <Pencil className="h-4 w-4 text-blue-600" />
                  </Button>
                  {/* Botão Ver/Gerenciar Endereços (Abre Modal) */}
                  <Dialog onOpenChange={(open) => open && fetchAddresses(u.id)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Gerenciar Endereços"
                      >
                        <MapPin className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex justify-between items-center">
                          <span>Endereços de {u.name}</span>
                          {/* Botão para CRIAR endereço para este usuário */}
                          <div className="mr-8">
                            <AddressFormModal
                              onSuccess={() => fetchAddresses(u.id)}
                              targetUserId={u.id} // Passa o ID do cliente
                            />
                          </div>
                        </DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4 mt-4 max-h-[60vh] overflow-y-auto">
                        {selectedUserAddresses.length === 0 ? (
                          <p className="text-sm text-gray-500">
                            Nenhum endereço cadastrado.
                          </p>
                        ) : (
                          selectedUserAddresses.map((addr: any) => (
                            <div
                              key={addr.id}
                              className="border p-3 rounded text-sm flex justify-between items-start"
                            >
                              <div>
                                <p className="font-bold">
                                  {addr.street}, {addr.number}
                                </p>
                                <p>
                                  {addr.district} - {addr.city}/{addr.state}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {addr.zipCode}
                                </p>
                              </div>
                              {/* Botão EDITAR endereço */}
                              <div className="ml-2">
                                <AddressFormModal
                                  onSuccess={() => fetchAddresses(u.id)}
                                  addressToEdit={addr}
                                />
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Usuário?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir{" "}
                          <strong>{u.name}</strong>? Isso apagará todo o
                          histórico e dados do usuário permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(u.id)}
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
        {/* --- MODAL DE EDIÇÃO DE USUÁRIO --- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateUser} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Telefone</Label>
                <Input
                  id="edit-phone"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-birthDate">Data de Nascimento</Label>
                <Input
                  id="edit-birthDate"
                  type="date"
                  value={editFormData.birthDate}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      birthDate: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-role">Tipo de Usuário</Label>
                <Select
                  value={editFormData.userType}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, userType: value })
                  }
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLIENT">Cliente</SelectItem>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        {/* --- MODAL DE CRIAÇÃO --- */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="create-name">Nome Completo</Label>
              <Input 
                id="create-name" 
                value={createFormData.name} 
                onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">Email</Label>
              <Input 
                id="create-email" 
                type="email"
                value={createFormData.email} 
                onChange={(e) => setCreateFormData({...createFormData, email: e.target.value})} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">Senha</Label>
              <Input 
                id="create-password" 
                type="password"
                value={createFormData.password} 
                onChange={(e) => setCreateFormData({...createFormData, password: e.target.value})} 
                required
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-phone">Telefone</Label>
              <Input 
                id="create-phone" 
                value={createFormData.phone} 
                onChange={(e) => setCreateFormData({...createFormData, phone: e.target.value})} 
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-birthDate">Data de Nascimento</Label>
              <Input 
                id="create-birthDate" 
                type="date"
                value={createFormData.birthDate} 
                onChange={(e) => setCreateFormData({...createFormData, birthDate: e.target.value})} 
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Criar Usuário
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
