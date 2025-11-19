'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";

interface OrderItem {
  unitPrice: string;
  quantity: number;
}

interface Client {
  name: string;
}

interface Order {
  id: string;
  status: string;
  client: Client;
  items: OrderItem[];
}

const STATUS_MAP = {
  PENDING: { label: 'Pendente', color: 'bg-yellow-500' },
  PROCESSING: { label: 'Em Preparo', color: 'bg-blue-500' },
  DELIVERED: { label: 'Entregue', color: 'bg-green-500' },
  CANCELED: { label: 'Cancelado', color: 'bg-red-500' },
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: string } | null>(null);

  const fetchOrders = async () => {
    try {
      // GET /orders retorna todos os pedidos para o ADMIN
      const response = await api.get('/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos', error);
      toast.error("Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.patch(`/orders/status/${orderId}`, { status: newStatus });
      
      // Atualiza a lista localmente para refletir a mudança rápido
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast.success(`Status atualizado para ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao atualizar status do pedido.");
      // (Opcional: reverter o estado local aqui se der erro)
      fetchOrders(); 
    }
  };

  const confirmStatusChange = async () => {
    if (!pendingUpdate) return;

    try {
      await api.patch(`/orders/${pendingUpdate.id}/status`, { status: pendingUpdate.status });
      
      // Atualiza a lista localmente
      setOrders(prev => prev.map(order => 
        order.id === pendingUpdate.id ? { ...order, status: pendingUpdate.status } : order
      ));
      
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar status.");
    } finally {
      // Fecha o modal limpando o estado
      setPendingUpdate(null);
    }
  };

  if (loading) return <Loader2 className="animate-spin" />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Gerenciamento de Pedidos</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status Atual</TableHead>
              <TableHead>Ação (Mudar Status)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>{order.client?.name || 'Cliente'}</TableCell>
                <TableCell>
                  R$ {(order.items || []).reduce((acc: number, item: any) => acc + (parseFloat(item.unitPrice) * item.quantity), 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Badge className={`${STATUS_MAP[order.status as keyof typeof STATUS_MAP].color} border-none`}>
                    {STATUS_MAP[order.status as keyof typeof STATUS_MAP].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select 
                    value={order.status}
                    onValueChange={(newStatus) => setPendingUpdate({ id: order.id, status: newStatus })}
                  >
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pendente</SelectItem>
                      <SelectItem value="PROCESSING">Em Preparo</SelectItem>
                      <SelectItem value="DELIVERED">Entregue</SelectItem>
                      <SelectItem value="CANCELED">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={!!pendingUpdate} onOpenChange={(open) => !open && setPendingUpdate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Alterar Status do Pedido?</AlertDialogTitle>
            <AlertDialogDescription>
              Você está prestes a mudar o status do pedido <strong>#{pendingUpdate?.id}</strong> para{' '}
              <strong>{STATUS_MAP[pendingUpdate?.status as keyof typeof STATUS_MAP]?.label}</strong>.
              <br /><br />
              Deseja confirmar esta alteração?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmStatusChange}>
              Confirmar Alteração
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}