import type { JSX } from 'react';

export interface CommandOutput {
	command: string;
	output: string | JSX.Element;
}

export type CommandFunction = () => JSX.Element;

export interface CommandRegistry {
	[key: string]: CommandFunction;
}
