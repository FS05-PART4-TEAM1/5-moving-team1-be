import { ERDBuilder } from 'typeorm-erd';
import { DataSource } from 'typeorm';
import { ENTITIES } from './database/database.entities';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'moving_db',
  entities: ENTITIES,
  synchronize: false,
});

const main = async () => {
  const erd = new ERDBuilder('mermaid', AppDataSource);
  await erd.initialize();
  const erdText = await erd.render();

  console.info(erdText);

  const erdDir = join(__dirname, 'database', 'erd');
  mkdirSync(erdDir, { recursive: true });

  const erdFilePath = join(erdDir, 'erd.mmd');
  writeFileSync(erdFilePath, erdText);
  console.log(`ERD가 ${erdFilePath} 파일로 저장되었습니다.`);
};

main();
