const { createCoverageMap } = require('istanbul-lib-coverage')
const { createReporter } = require('istanbul-api')
const path = require('path')

const lcovFilePaths = [
	"../packages/server/coverage/coverage-final.json",
	"../packages/webapp/coverage/coverage-final.json"
].map((fileRelativePath) => path.join(__dirname, fileRelativePath))

const coverageMap = createCoverageMap({})
const reporter = createReporter()
reporter.add('lcovonly')

for (let fileIndex = 0; fileIndex < lcovFilePaths.length; fileIndex++) {
	const lcovFile = require(lcovFilePaths[fileIndex])
	if (lcovFile) coverageMap.merge(lcovFile)
}

reporter.write(coverageMap)
