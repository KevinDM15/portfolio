/*
 * Build facts shown on the page: the deployed commit (Vercel exposes it, git answers locally) and the build date.
 * Runs at build time only.
 */
import { execSync } from 'node:child_process';

function commitSha(): string {
	if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA;
	try { return execSync('git rev-parse HEAD').toString().trim(); } catch { return ''; }
}

function buildDate(): string {
	const parts = new Intl.DateTimeFormat('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'short', year: 'numeric' }).formatToParts(new Date());
	const part = (type: string) => parts.find((p) => p.type === type)?.value.replace('.', '') ?? '';
	return `${part('day')} ${part('month')} ${part('year')}`;
}

export const sha = commitSha().slice(0, 7);
export const built = buildDate();
