import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { TodoPriority } from '../src/todos/entities/todo.interface';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  // Effacer toutes les données existantes
  await prisma.todo.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Database cleared.');

  console.log('Seeding...');

  const templateUser = {
    email: 'toto@kresus.eu',
    password: 'test',
    firstName: 'toto',
    lastName: 'kresus',
  };

  const encryptedPassword = await bcrypt.hash(templateUser.password, 10);
  const user = await prisma.user.create({
    data: { ...templateUser, password: encryptedPassword },
  });

  await prisma.todo.create({
    data: {
      userId: user.id,
      title: 'Todo1',
      priority: TodoPriority.HIGH,
      executionDate: new Date('2021-10-01'),
      content: 'lorem ipsum dolor sit amet',
    },
  });
  await prisma.todo.create({
    data: {
      userId: user.id,
      title: 'Todo2',
      priority: TodoPriority.MEDIUM,
      executionDate: new Date('2021-10-02'),
      content: 'lorem ipsum dolor sit amet',
    },
  });
  console.log('Seeding completed.');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
