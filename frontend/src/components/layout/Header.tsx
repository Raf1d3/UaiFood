'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingCart,
  LogOut,
  User,
  Search,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
  // --- Hooks ---
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();

  // Calcula o total de itens no carrinho
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // --- Handlers de Clique ---

  /**
   * Lida com cliques em links protegidos (ex: Carrinho).
   * Se o usuário não estiver logado, ele é enviado para /login
   * com uma query 'redirect' para que possamos enviá-lo de volta.
   */
  const handleProtectedLink = (href: string) => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${href}`);
    } else {
      router.push(href);
    }
  };

  /**
   * Lida com o clique no botão "Entrar".
   * Envia o usuário para o login, mas também diz para onde
   * ele deve ser redirecionado após o sucesso.
   */
  const handleLoginClick = () => {
    // Não redireciona se já estivermos no login/register
    if (pathname !== '/login' && pathname !== '/register') {
      router.push(`/login?redirect=${pathname}`);
    } else {
      router.push('/login');
    }
  };

  /**
   * Lida com o clique no botão "Sair".
   * Executa o logout e redireciona para a home.
   */
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 flex justify-center w-full border-b bg-white/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center gap-10">
        {/* --- Logo e Links da Esquerda --- */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-bold transition-colors"
          >
            <Image
              src="/images/Logo_uaiFood.webp"
              alt="UaiFood Logo"
              width={100} // Defina a largura
              height={40} // Defina a altura
              priority // Para o logo carregar mais rápido
              style={{ objectFit: 'contain' }} // Garante que a imagem não distorça
            />
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium text-muted-foreground md:flex">
            <Link
              href="/ofertas"
              className="transition-colors hover:text-primary"
            >
              Ofertas
            </Link>
            <Link
              href="/contato"
              className="transition-colors hover:text-primary"
            >
              Contato
            </Link>
          </nav>
        </div>

        {/* --- Barra de Busca Central --- */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por item ou categoria..."
            className="w-full rounded-full bg-muted pl-10 pr-4"
          />
        </div>

        {/* --- Botões da Direita --- */}
        <nav className="flex items-center gap-3">
          {/* Botão Carrinho (Sempre visível) */}
          <Button
            variant="outline"
            size="icon"
            className="relative h-9 w-9"
            onClick={() => handleProtectedLink('/cart')}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
            <span className="sr-only">Carrinho</span>
          </Button>

          {/* Bloco de Autenticação Condicional */}
          {isAuthenticated ? (
            // --- USUÁRIO LOGADO ---
            <>
              <div className="hidden items-center text-sm font-medium sm:flex">
                <User className="mr-1 h-4 w-4" />
                <span>Olá, {user?.name?.split(' ')[0] || 'Usuário'}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-1 h-4 w-4" />
                Sair
              </Button>
            </>
          ) : (
            // --- USUÁRIO DESLOGADO ---
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLoginClick}
                className="hidden sm:inline-flex"
              >
                <LogIn className="mr-1 h-4 w-4" />
                Entrar
              </Button>
              <Link href="/register">
                <Button size="sm">
                  <UserPlus className="mr-1 h-4 w-4" />
                  Registrar
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}