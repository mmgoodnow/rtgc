import {existsSync} from "node:fs";
import {readdir, readlink, mkdir, link} from "node:fs/promises";
import { parseArgs } from "node:util";
import { join, dirname, basename, relative, resolve } from "node:path";

const options = {
	"symlink-dir": {type: "string"},
	"output-dir": {type: "string"},
	"execute": { type: "boolean", default: false }
};

const { values } = parseArgs({ options });
const symlinkDir = values["symlink-dir"];
const rawDir = values["raw-dir"];
const outputDir = values["output-dir"];
const execute = values["execute"];

console.log('CLI arguments:',{
	symlinkDir,
	rawDir,
	outputDir,
	execute
})

async function processSymlinks(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			await processSymlinks(fullPath);
		} else if (entry.isSymbolicLink()) {
			await handleSymlink(fullPath);
		}
	}
}

async function handleSymlink(symlinkPath) {
	try {
		const targetPath = resolve(dirname(symlinkPath), await readlink(symlinkPath));
		const rawFilename = basename(targetPath);
		const symlinkRelativeFromSymlinkRoot = relative(symlinkDir, symlinkPath);
		const relativeDir = dirname(symlinkRelativeFromSymlinkRoot);
		const outputPath = join(outputDir, relativeDir, rawFilename);

		if (!existsSync(targetPath)) {
			console.error(`Target of symlink ${symlinkPath} does not exist: ${targetPath}`);
			return;
		}

		if (!execute) {
			console.log(`[Dry Run] Would hardlink: ${targetPath} -> ${outputPath}`);
			return;
		}

		await mkdir(dirname(outputPath), { recursive: true });
		await link(targetPath, outputPath);
		console.log(`Hardlinked: ${targetPath} -> ${outputPath}`);
	} catch (error) {
		console.error(`Error processing symlink ${symlinkPath}:`, error);
	}
}

console.log(`Starting in ${execute ? "EXECUTION" : "DRY RUN"} mode.`);
await processSymlinks(symlinkDir);
