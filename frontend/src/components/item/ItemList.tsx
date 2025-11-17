'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface Item {
  category: string & { description: string };
  id: string;
  description: string;
  unitPrice: number;
  categoryId: string;
}

export function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCartStore();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data);
      } catch (err) {
        setError('Erro ao carregar a lista de itens.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-lg">Carregando itens...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {items.map((item) => (
        <Card key={item.id} className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle>{item.description}</CardTitle>
            <CardDescription>Categoria: {item.category.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              R$ {parseFloat((item.unitPrice).toString()).toFixed(2).replace('.', ',')}
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => addItem(item)}>
              <ShoppingCart className="mr-2 h-4 w-4" /> Adicionar ao Carrinho
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
