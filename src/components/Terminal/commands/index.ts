import type { CommandRegistry } from '../types';
import { whoami } from './whoami';
import { skills } from './skills';
import { experience } from './experience';
import { projects } from './projects';
import { hobbies } from './hobbies';
import { contact } from './contact';
import { help } from './help';

export const commands: CommandRegistry = {
	whoami,
	skills,
	experience,
	projects,
	hobbies,
	contact,
	help,
};
