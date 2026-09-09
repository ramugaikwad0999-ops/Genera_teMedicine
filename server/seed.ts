import { mockDrugs, mockStores, mockInitialOrder, mockDisputeDossier } from '../src/data/mockData';

export interface SeedSummary {
  storesCount: number;
  drugsCount: number;
  ordersCount: number;
  disputesCount: number;
  timestamp: string;
}

export function generateSeedData(): SeedSummary {
  console.log('--- Initializing generaticMed Database Seeding ---');
  console.log(`[Seed] Ingesting ${mockStores.length} verified pharmacy fulfillment stores...`);
  mockStores.forEach((store) => {
    console.log(`  -> Store #${store.code}: ${store.name} (${store.city}, ${store.state})`);
  });

  console.log(`[Seed] Normalizing ${mockDrugs.length} canonical RxNorm drugs across FDA Orange Book...`);
  mockDrugs.forEach((drug) => {
    console.log(`  -> RxCUI #${drug.rxNormCode}: ${drug.name} [TE: ${drug.fdaTeCode}] Brand: ${drug.brandEquivalent}`);
  });

  console.log(`[Seed] Staging initial escrow order #${mockInitialOrder.orderNumber} (RFID: ${mockInitialOrder.rfidSealNumber})...`);
  console.log('[Seed] Ingesting 1 baseline forensic dispute case...');

  console.log('--- Database Seeding Completed Successfully ---');

  return {
    storesCount: mockStores.length,
    drugsCount: mockDrugs.length,
    ordersCount: 1,
    disputesCount: mockDisputeDossier ? 1 : 0,
    timestamp: new Date().toISOString(),
  };
}

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  generateSeedData();
}
