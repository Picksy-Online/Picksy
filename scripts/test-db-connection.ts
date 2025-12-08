
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Connecting to database...');
        // just counting users to test connection
        const userCount = await prisma.user.count();
        console.log(`Successfully connected! Found ${userCount} users.`);
        console.log('Neon Database is WORKING. ✅');
    } catch (e) {
        console.error('Connection failed:', e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
