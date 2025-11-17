import { ItemList } from '@/components/item/ItemList';

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-center">Produtos</h1>
      <ItemList />
    </div>
  );
}
