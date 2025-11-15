import { UserType } from '@prisma/client';
import prisma from "./prismaClient.js"
import { hash } from 'bcryptjs';


async function main() {
  console.log('Iniciando o script de seed...');

  // Pega as credenciais do .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      'Variáveis de ambiente ADMIN_EMAIL ou ADMIN_PASSWORD não definidas.'
    );
  }

  // Hasheia a senha
  const hashedPassword = await hash(adminPassword, 10);

  // 'upsert' é um comando mágico:
  // - Tenta encontrar um usuário pelo 'email'.
  // - Se encontrar, ele 'update' (não faz nada aqui).
  // - Se NÃO encontrar, ele 'create'.
  // Isso garante que você nunca crie admins duplicados.
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {}, // Não faz nada se o admin já existir
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin UaiFood',
      phone: '000000000',
      userType: UserType.ADMIN,
      birthDate: new Date(),
    },
  });

  console.log(`Usuário admin criado/verificado: ${admin.email}`);
}

// Executa a função e fecha a conexão
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });