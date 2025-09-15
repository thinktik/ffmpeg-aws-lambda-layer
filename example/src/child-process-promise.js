const {spawn} = require('child_process');

const spawnPromise = (command, args, options = {}) => {
    return new Promise((resolve, reject) => {
        console.log('executing', command, args.join(' '));

        const defaultOptions = {
            env: process.env,
            cwd: process.cwd()
        };

        const childProc = spawn(command, args, {...defaultOptions, ...options});
        const resultBuffers = [];

        childProc.stdout.on('data', buffer => {
            console.log(buffer.toString());
            resultBuffers.push(buffer);
        });

        childProc.stderr.on('data', buffer => {
            console.error(buffer.toString());
        });

        childProc.on('exit', (code, signal) => {
            console.log(`${command} completed with ${code}:${signal}`);
            if (code || signal) {
                reject(new Error(`${command} failed with ${code || signal}`));
            } else {
                resolve(Buffer.concat(resultBuffers).toString().trim());
            }
        });
    });
};

module.exports = {
    spawn: spawnPromise
};