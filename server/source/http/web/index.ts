import webpack from 'webpack'
import koa from 'koa'
import koaWebpack from 'koa-webpack'
import koaStatic from 'koa-static'
import koaCompose from 'koa-compose'

import { resolve } from 'path'

import configuration, { root } from './config'

export const buildMiddleware = async (dev: boolean) => {
	const generatedConfig = configuration(dev)

	const webpackMiddleware = await koaWebpack({
		compiler: webpack(generatedConfig),
		devMiddleware: { stats: 'minimal' },
	})

	return koaCompose([
		webpackMiddleware,

		async (ctx: koa.ParameterizedContext, next: koa.Next) => {
			if (ctx.path === '/') {
				const filename = resolve(
					generatedConfig.output?.path ||
						'THIS PATH ALWAYS EXISTS, TS CANNOT INFER',
					'index.html'
				)

				ctx.response.type = 'html'
				ctx.response.body = webpackMiddleware.devMiddleware.fileSystem.createReadStream(
					filename
				)
			} else await next()
		},

		koaStatic(root('./public')),
	])
}
