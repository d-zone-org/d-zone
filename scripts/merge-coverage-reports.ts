import path from 'path'
import fs from 'fs'
import istanbulCoverage from 'istanbul-lib-coverage'
import istanbulReports from 'istanbul-reports'
import istanbulReport from 'istanbul-lib-report'

const root = (...args: string[]) => path.join(__dirname, '..', ...args)

const coverageMap = istanbulCoverage.createCoverageMap()
for (const file of lcovFiles()) coverageMap.merge(file)

const reporter = istanbulReports.create('lcovonly')
const reporterContext = istanbulReport.createContext({
	/* @ts-expect-error */
	coverageMap,
	dir: root('coverage'),
})

/* @ts-expect-error */
reporter.execute(reporterContext)

function* lcovFiles(): Generator<istanbulCoverage.CoverageMapData> {
	const packageJson: typeof import('../package.json') = require('../package.json')
	const workspaceRoots = packageJson.workspaces
	const lcovFilePaths = workspaceRoots.map((workspaceRoot) =>
		root(workspaceRoot, 'coverage/coverage-final.json')
	)
	const existentFiles = lcovFilePaths.filter((file) => fs.existsSync(file))
	console.log(`Found files: \n${existentFiles.join('\n')}`)
	for (const filePath of existentFiles) yield require(filePath)
}
