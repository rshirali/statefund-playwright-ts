import type { FullConfig } from '@playwright/test';

export default async function globalSetup(cfg: FullConfig) {
    // Some PW versions expose root fields under cfg.config
    const root: any = (cfg as any).config ?? cfg;

    console.log('\n=== RESOLVED PLAYWRIGHT CONFIG ===');
    console.log('testDir:', String(root.testDir));
    console.log('retries:', root.retries);
    console.log('timeout:', root.timeout);
    console.log('workers:', root.workers);
    console.log('projects:', cfg.projects.map(p => p.name).join(', '));

    for (const p of cfg.projects) {
        console.log(`\n[${p.name}] use = ${JSON.stringify(p.use, null, 2)}`);
    }

    if (process.env.PRINT_CONFIG_ONLY) {
        // Exit before running tests
        process.exit(0);
    }
}
