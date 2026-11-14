// Launch the painter agents of an experiment, all in parallel.
// Usage: node run.mjs experiments/<name> [--only fable,opus] [--dry]   (--dry prints the commands only)
// Each agent gets prompt.md with NAME replaced, may only write its own painter file
// and run render.mjs, and logs to experiments/<name>/work/<painter>/agent.log.
import { readFileSync, mkdirSync, openSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join, relative, resolve } from 'node:path';

const exp = resolve(process.argv[2] || '');
const args = process.argv.slice(3);
const only = args.includes('--only') ? args[args.indexOf('--only') + 1].split(',') : null;
const cfg = JSON.parse(readFileSync(join(exp, 'experiment.json'), 'utf8'));
const template = readFileSync(join(exp, cfg.prompt || 'prompt.md'), 'utf8');
const root = process.cwd(), rel = relative(root, exp);

// One entry per agent CLI. file = the only file the agent may write.
const AGENTS = {
  claude: ({ model }, prompt, file) => ['claude', ['-p', prompt, '--model', model,
    '--allowedTools', 'Read', `Write(${file})`, `Edit(${file})`, 'Bash(node render.mjs:*)']],
  codex: ({ model, effort }, prompt) => ['codex', ['exec', '--skip-git-repo-check', '-m', model,
    ...(effort ? ['-c', `model_reasoning_effort=${effort}`] : []), '--sandbox', 'workspace-write', '-C', root, prompt]],
  grok: ({ model }, prompt, file) => ['grok', ['-p', prompt, '-m', model, '--cwd', root, '--permission-mode', 'dontAsk',
    '--allow', 'Read', '--allow', `Write(${file})`, '--allow', `Edit(${file})`, '--allow', 'Bash(node render.mjs:*)']],
};

const runs = cfg.painters.filter(p => !only || only.includes(p.name)).map(p => {
  const make = AGENTS[p.agent];
  if (!make) throw new Error(`${p.name}: unknown agent "${p.agent}" (known: ${Object.keys(AGENTS)})`);
  const file = `${rel}/painters/${p.name}.mjs`;
  const prompt = template.replaceAll('NAME', p.name).replaceAll('EXP', rel);
  const [cmd, argv] = make(p, prompt, file);
  if (args.includes('--dry')) { console.log(`${p.label}:`, cmd, argv.map(a => a === prompt ? '<prompt>' : a).join(' ')); return 0; }
  const dir = join(exp, 'work', p.name); mkdirSync(dir, { recursive: true });
  const log = openSync(join(dir, 'agent.log'), 'w');
  console.log(`${p.label}: ${cmd} -m ${p.model} -> ${relative(root, dir)}/agent.log`);
  const child = spawn(cmd, argv, { cwd: root, stdio: ['ignore', log, log] });
  return new Promise(r => child.on('close', code => { console.log(`${p.label}: exit ${code}`); r(code); }));
});
const codes = await Promise.all(runs);
process.exit(codes.some(c => c) ? 1 : 0);
