import path from 'path'
import istanbulCoverage from 'istanbul-lib-coverage'
import istanbulReports from 'istanbul-reports'
import istanbulReport from 'istanbul-lib-report'
import glob from 'glob'

const root = (...args: string[]) => path.join(__dirname, '..', ...args)

const coverageMap = istanbulCoverage.createCoverageMap()
const coverageFilePaths = glob.sync('**/coverage-final.json')
console.log('Found coverage files', coverageFilePaths)
coverageFilePaths.forEach((file) => coverageMap.merge(require(root(file))))

const reporter = istanbulReports.create('lcovonly')
const reporterContext = istanbulReport.createContext({
	/* @ts-expect-error */
	coverageMap,
	dir: root('coverage'),
})

/* @ts-expect-error */
reporter.execute(reporterContext)
