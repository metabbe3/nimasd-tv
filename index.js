// index.js
// run with node --experimental-worker index.js on Node.js 10.x
const {
    Worker
} = require('worker_threads')

var os = require('os'),
cpuCount = 20;
var num = 0;

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function runService(workerData,resourceLimits) {
    
        return new Promise((resolve, reject) => {
            try{
            const worker = new Worker('./workerloginchrome.js', {
                workerData,
                resourceLimits
            });
            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0)
                    reject(new Error(`Worker stopped with exit code ${code}`));
            })
        }catch(e){
            console.log(e);
        }})
   
    
}

async function run() {
    console.log(cpuCount)
    let range = Math.ceil((process.argv[4]-process.argv[3])/cpuCount);
    let last=Math.floor(process.argv[3]);
    let firstNumber=0;
    for(let i=0;i<cpuCount;i++){
        if(last == 0){firstNumber = last;}else{firstNumber = last;}
        let lastNumber = (last+range);
        last = (last+range);
        runService({
                            start:firstNumber,
                            end:lastNumber,
                            link: `https://www.nimo.tv/${process.argv[2]}`
                        },{maxOldGenerationSizeMb:9999,maxYoungGenerationSizeMb:9999,codeRangeSizeMb:9999,stackSizeMb:9999})
        
    }
}

try{
    run().catch(err => console.error(err))
}catch(e){}