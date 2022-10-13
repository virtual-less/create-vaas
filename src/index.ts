#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path'
import * as os from 'os'
import {exec, ExecOptions}  from 'child_process'

const packageInfo = require('../package.json')
const program = new Command();


async function execPromise(command:string,options:ExecOptions) {
    return await new Promise((resolve,reject)=>{
        const child = exec(command,options,(err, stdout, stderr)=>{
            if(err)reject(err)
            resolve({stdout, stderr})
        })
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)
    })
    
}

program
    .name('create-vaas')
    .description('CLI to init vaas project')
    .version(packageInfo.version)
    .argument('[serverDirName]', 'server dir name')
    .action(async (serverDirName) => {
        if(!serverDirName) {serverDirName='vaas-project'}
        const serverDirPath = path.join(process.cwd(), serverDirName)
        await execPromise(`git clone https://github.com/virtual-less/vaas-template.git ${serverDirName}`,{
            cwd:process.cwd()
        })
        await execPromise(`rm -rf .git`,{
            cwd:serverDirPath
        })
        await execPromise(`npm install`,{
            cwd:serverDirPath
        })
        process.stdout.write(
            os.EOL+
            `init vaas project complete!`+os.EOL+
            `1. cd ${serverDirName}`+os.EOL+
            `2. npm run dev`+os.EOL
        )
    });

program.command('help')
    .description('help')
    .action(() => {
        program.help()
    });

program.parse();
