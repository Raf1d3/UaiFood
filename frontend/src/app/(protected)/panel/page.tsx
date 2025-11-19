'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminItems } from '@/components/admin/AdminItems';
import { AdminCategories } from '@/components/admin/AdminCategories';
import { AdminUsers } from '@/components/admin/AdminUsers';
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  // Proteção Extra no Front-end (Redireciona se não for admin)
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.userType !== 'ADMIN') {
        router.push('/'); // Manda para home se não for admin
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || !user || user.userType !== 'ADMIN') {
    return null; // Ou um Loader
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-gray-500 mb-8">Gerencie sua loja, cardápio e pedidos em um só lugar.</p>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4 p-1 rounded-lg mb-8">
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="items">Produtos</TabsTrigger>
          <TabsTrigger value="categories">Categorias</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
        </TabsList>

        {/* Conteúdo das Abas */}
        <TabsContent value="orders">
          <AdminOrders />
        </TabsContent>
        
        <TabsContent value="items">
          <AdminItems />
        </TabsContent>
        
        <TabsContent value="categories">
          <AdminCategories />
        </TabsContent>

        <TabsContent value="users">
          <AdminUsers />
        </TabsContent>
      </Tabs>
    </div>
  );
}