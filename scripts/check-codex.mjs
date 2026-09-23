// Fails when a node codex file names a category n8n does not recognise.
// n8n drops an unknown category silently, so the node shows with no category and no linter reports it.
// Valid list: https://docs.n8n.io/integrations/creating-nodes/build/reference/node-codex-files/#node-categories
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const VALID = new Set([
	'Data & Storage',
	'Finance & Accounting',
	'Marketing & Content',
	'Productivity',
	'Miscellaneous',
	'Sales',
	'Development',
	'Analytics',
	'Communication',
	'Utility',
]);

let bad = 0;
let seen = 0;
for (const dir of readdirSync('nodes')) {
	for (const f of readdirSync(join('nodes', dir)).filter((n) => n.endsWith('.node.json'))) {
		const path = join('nodes', dir, f);
		const codex = JSON.parse(readFileSync(path, 'utf8'));
		seen++;
		const cats = codex.categories;
		if (!Array.isArray(cats) || cats.length === 0) {
			console.error(`${path}: categories must be a non-empty array`);
			bad++;
			continue;
		}
		for (const c of cats) {
			if (!VALID.has(c)) {
				console.error(`${path}: unknown category "${c}"`);
				bad++;
			}
		}
	}
}
if (seen === 0) {
	console.error('no codex files found under nodes/');
	process.exit(1);
}
if (bad) process.exit(1);
console.log(`codex categories OK (${seen} files)`);
