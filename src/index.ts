import type * as esbuild from 'esbuild';
import { promises as fs } from 'node:fs';
import path from 'node:path';

type Options = {
	filter?: RegExp;
	suffix?: string;
	outRelativePath?: string;
	namespace?: string;
};

export default function importUrlPlugin(options: Options = {}): esbuild.Plugin {
	const filter = options.filter || /.+\?url/;
	const suffix = options.suffix || '?url';
	const outRelativePath = options.outRelativePath || '';
	const namespace =
		options.namespace || Math.random().toString(36).substring(2, 9);

	return {
		name: 'esbuild-plugin-copy-import',
		setup(build) {
			const outDir = build.initialOptions.outfile
				? path.dirname(build.initialOptions.outfile)
				: build.initialOptions.outdir;

			if (!outDir) {
				throw new Error('outDir is not defined');
			}

			build.onResolve({ filter }, async (args) => {
				const filePath = args.path.substring(
					0,
					args.path.length - suffix.length,
				);

				// Copy file to output directory
				const fileDir = path.dirname(filePath);
				await fs.mkdir(path.resolve(outDir, outRelativePath, fileDir), {
					recursive: true,
				});
				await fs.copyFile(
					import.meta.resolve(filePath).slice('file://'.length),
					path.join(outDir, outRelativePath, filePath),
				);

				const outputFile = `./${path.join(outRelativePath, filePath)}`;

				return {
					path: outputFile,
					namespace,
				};
			});

			build.onLoad({ filter: /.*/, namespace }, (args) => {
				// Creates a variable of the output file path
				return {
					contents: args.path,
					watchFiles: [args.path],
					loader: 'text',
				};
			});
		},
	};
}
