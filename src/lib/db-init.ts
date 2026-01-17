// lib/db-init.ts
import { createIndexes } from './mongodb';

let indexesCreated = false;

export async function initializeDatabase() {
  if (!indexesCreated) {
    await createIndexes();
    indexesCreated = true;
  }
}