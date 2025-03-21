const pinoConfig = {
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
			ignore: 'pid,hostname',
			singleLine: false,
		},
	},
};

export default pinoConfig;
