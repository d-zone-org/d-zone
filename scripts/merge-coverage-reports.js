const { createCoverageMap } = require('istanbul-lib-coverage')
const { createReporter } = require('istanbul-api')
const { workspaces } = require('../package.json')
const path = require('path')
const fs = require('fs')

// We get the workspace roots from package.json
// Then get their absolute urls
// Then filter the ones that exist
const lcovFilePaths = workspaces
	.map((filePathRelativeToRoot) =>
		path.join(
			__dirname,
			'..',
			filePathRelativeToRoot,
			'/coverage/coverage-final.json'
		)
	)
	.filter((filePath) => fs.existsSync(filePath))

// Log the files found
console.log(`Found lcov files: \n${lcovFilePaths.join('\n')}`)

// Merge and write the coverage
const coverageMap = createCoverageMap({})
const reporter = createReporter()
reporter.add('lcovonly')

for (let fileIndex = 0; fileIndex < lcovFilePaths.length; fileIndex++) {
	const lcovFile = require(lcovFilePaths[fileIndex])
	if (lcovFile) coverageMap.merge(lcovFile)
}

reporter.write(coverageMap)
