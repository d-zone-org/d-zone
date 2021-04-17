import path from 'path'
import { createRequire } from 'module'
import { Logger } from 'tslog'

export const createNextServer = (dev: boolean, logger: Logger) => {
	const webWorkspacePath = path.join(process.cwd(), '../web')
	const webWorkspacePackageJsonPath = path.join(
		webWorkspacePath,
		'package.json'
	)
	const webWorkspaceRoot = path.join(webWorkspacePath, 'src')

	logger.debug('Using web workspace at ', webWorkspacePath)

	const webRequire = createRequire(webWorkspacePackageJsonPath)
	const next: typeof import('next') = webRequire('next')

	const app = next.default({ dev, dir: webWorkspaceRoot })
	const requestHandler = app.getRequestHandler()

	return app.prepare().then(() => requestHandler)
}
