const puppeteer = require('puppeteer')
fs = require('fs');
var click_number = '#container > div > div.nimo-login-content-wrapper.n-fx-col.n-fx-ss > div.nimo-login-body.n-fx-sn.n-fx1.n-fx-basis-auto.n-as-w100 > div.nimo-login-body-first.n-fx1.n-fx-basis-auto > div.nimo-login-body-input.n-fx-sn.bc10.n-as-rnd.n-as-mrgb-md.n-as-rel.n-as-of-hidden > div.nimo-login-body-area-code.c1.n-as-padh.n-fx-sr0.line-height40.n-as-pointer';
var indo = '#container > div > div:nth-child(2) > div > div > div > div.n-as-scroll.n-fx1.n-as-of-auto > div:nth-child(1)';
var number = '#container > div > div.nimo-login-content-wrapper.n-fx-col.n-fx-ss > div.nimo-login-body.n-fx-sn.n-fx1.n-fx-basis-auto.n-as-w100 > div.nimo-login-body-first.n-fx1.n-fx-basis-auto > div.nimo-login-body-input.n-fx-sn.bc10.n-as-rnd.n-as-mrgb-md.n-as-rel.n-as-of-hidden > input';
var password = '#container > div > div.nimo-login-content-wrapper.n-fx-col.n-fx-ss > div.nimo-login-body.n-fx-sn.n-fx1.n-fx-basis-auto.n-as-w100 > div.nimo-login-body-first.n-fx1.n-fx-basis-auto > div.nimo-login-body-input.n-fx-sn.bc10.n-as-rnd.n-as-mrgb.n-as-rel.n-as-of-hidden > input';
var login = '#container > div > div.nimo-login-content-wrapper.n-fx-col.n-fx-ss > div.nimo-login-body.n-fx-sn.n-fx1.n-fx-basis-auto.n-as-w100 > div.nimo-login-body-first.n-fx1.n-fx-basis-auto > button';
var search = '#header > div > div.nimo-header-main-menu.n-fx0.n-as-h60px.n-fx-bc > div.n-as-mrgh.c-hover1 > ul > a:nth-child(1) > li';
var box = '#container > div > div:nth-child(2) > div > div > div > div.bc4.search-input.n-fx-sc.n-as-mrgb.n-fx-sr0.n-as-mrgh > input';
const {
    workerData: {
        start,
        end,
        link
    }
} = require('worker_threads');
const proxy = require('./proxy.js');
const no = require('./akun.js');
const ua = ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.105 Safari/537.36',''];




function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

console.log('Process triggered.');
console.time('Execution time');

/**
 * @return {Promise}
 */
const sleep = async function() {
    return new Promise(resolve => {
        setTimeout(resolve, Math.floor(Math.random() * 5000) + 999);
    });
};
var count = 0;
let openbrowser = async (proxy) => {
    process.removeAllListeners();
    process.setMaxListeners(999999);
    console.log(proxy);
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: '/usr/bin/google-chrome',
        args: [`--proxy-server=${proxy}`,
        '--incognito',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        
        ]
    });
    console.log('open browser');
    // const context = await browser.createIncognitoBrowserContext();
    let getPages = await browser.pages();

    let page = await getPages[0];
    console.log('get pages');
    await page.setViewport({
        width: 1280,
        height: 720,
        deviceScaleFactor: 1,
    });
    console.log('set viewport');
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36');
    console.log('set useragent');
    //  await page.authenticate({
    //        username: 'nich_1310@yahoo.com',
    //        password: 'N!ch0l@5'
    //    });
  
  
  //console.log('a');
    return page;
}

let openlogin = async (pages) => {
    while (pages.url() !== 'https://www.nimo.tv/login') {
        console.log('open nimo login page');
        await pages.goto('https://www.nimo.tv/login', {
            timeout: 240000,
        waitUntil: 'networkidle0',
        });

        if (pages.url() === 'https://www.nimo.tv/login') {
            console.log('in nimo login page');
            break;
        
        }
    }
}

let loginusername = async (pages,country,phonenum,passwords) => {
    console.log('wait for selector login page');
    await pages.waitForSelector(click_number);
    console.log('selector found');
    await pages.click(click_number);
    console.log('click country');
    await pages.waitForSelector(box);
    console.log('wait for country list');
    await pages.type(box, country);
    console.log('select country');
    await pages.click(indo);
    console.log('type phonenumber');
    await pages.type(number, phonenum);
    console.log('type password');
    await pages.type(password, passwords);
    try {
        console.log('try login');
        await Promise.all([
            pages.click(login),
            pages.waitForNavigation({
                timeout: 240000,
                waitUntil: 'networkidle2',
               
            }),
        ]);
      
    } catch (e) {
        
    }
    return true;
}

let homepage = async (page,phonenum) => {
    if ( fs.existsSync(`./cookies/cookies-${phonenum}.json`)) {
        console.log('please wait fast login');
    const cookiesString = fs.readFileSync(`./cookies/cookies-${phonenum}.json`);
    console.log('read cookies');
  //  console.log(cookiesString);
    const cookiess = JSON.parse(cookiesString);
    console.log('parse cookies');
    await page.setCookie(...cookiess);
    console.log('set cookies');
    }

    await page.setRequestInterception(true)
    await page.on('request', request => {
        const url = request.url();
    const filters = [
        'livefyre',
        'moatad',
        'analytics',
        'controltag',
        'chartbeat',
    ];
    const shouldAbort = filters.some((urlPart) => url.includes(urlPart));
        if (shouldAbort || request.resourceType() === 'image' || request.resourceType() === 'stylesheet')
            request.abort();
        else
            request.continue();
    });
    console.log('go to landing page');
    await page.goto('https://www.nimo.tv/', {
     
        timeout: 240000,
        waitUntil: 'domcontentloaded',
       
    });
    console.log('landing page success');
    if ( !fs.existsSync(`./cookies/cookies-${phonenum}.json`)) {
        console.log('cookies not exist');
    var cookies = await page._client.send('Network.getAllCookies');

    cookies = cookies.cookies.map( cookie => {
      cookie.expiresUTC = new Date(cookie.expires * 1000);

      return cookie;
    });

    var persistantCookies = cookies.filter(c => {
      return !c.session;
    });
    console.log('write cookies');
    fs.writeFile(`./cookies/cookies-${phonenum}.json`, JSON.stringify(persistantCookies, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('success login + write cookies');
      });
    }
    // console.log({
    //   persistantCookies: persistantCookies,
    //   persistantCookiesCount: persistantCookies.length,
    // });
}

let target = async (page) => {
    let checkPlay =0;
    console.log('go to nimo streamer link');
    await page.goto(link, {
        timeout: 240000,
        waitUntil: 'networkidle2',
       
    });
    
    await page.waitForSelector('video');
    console.log('video found try pause');
    //await page.WaitFor(15000);
    await page.evaluate(()=>
        document.querySelector('video').pause());
    console.log('video paused');
    await page.evaluate(()=>
        document.querySelector('video').hidden=true);
    console.log('video hidden');
   
    // try{
    //     console.log('wait selector error browser');
    //      page.waitForSelector('#nimo-player > div.autoplay-alert > div > span');
         
    //     await page.evaluate(()=>
    //     document.querySelector('#nimo-player > div.autoplay-alert > div > span').click());
    //         await page.waitForSelector('#nimo-player > div.controls > div:nth-child(1) > div.play-control.control-item > i');
    //         console.log('wait play');
    //     for(let i=0;i<10;i++){
    //         await page.evaluate(()=>
    //     document.querySelector('#nimo-player > div.controls > div:nth-child(1) > div.play-control.control-item > i').click());
    //     console.log('play');
    //     await page.waitFor(15000)
    //     if(await page.$('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item') != null){
    //         i=10;
    //     }
    //     }
        
        
    //     // console.log('set lowest res');
      
    // }catch(e){}
    // for(let i=0;i<2;i++){
    //     await page.waitFor(30000);
    //     if(await page.$('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item') == null && checkPlay != 0){
    //         console.log(await page.$('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item'));
    //         console.log('paused');
    //         i=2;
    //     }else if(await page.$('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item') == null && checkPlay == 0){
    //         console.log('try play again');
    //         await page.evaluate(()=>
    //         document.querySelector('#nimo-player > div.controls > div:nth-child(1) > div.play-control.control-item > i').click());
    //         checkPlay=1;
    //         i--;
    //     }else if(await page.$('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item') != null && checkPlay == 0){
    //         console.log('not paused');
    //         await page.evaluate(()=>
    //     document.querySelector('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item').click());
    //     i--;
    //     }else if(await page.$('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item') != null && checkPlay == 1){
    //         console.log('not paused');
    //         await page.evaluate(()=>
    //     document.querySelector('#nimo-player > div.controls > div:nth-child(1) > div.play-control.playing.control-item').click());
    //     i--;
    //     }
    // }
  
    //browser.disconnect();
    process.removeAllListeners();
    console.log('Process end.');
    console.timeEnd('Execution time');
}

(async () => {
    try {
        let numstart=start*2;
        for(let k=start;k<end;k++){  
            for(let i=0;i<2;i++){
        console.log(numstart);
        const words = no.no[numstart].split(':');
        const countlogin = 0;
        const page2 = await openbrowser(proxy.proxy[k]);
        if ( !fs.existsSync(`./cookies/cookies-${words[0]}.json`)) {
            console.log('dont exist');
            await openlogin(page2);
            let status = await loginusername(page2,words[2],words[0],words[1]);
           // console.log(status);
            while (status !== true) {
                countlogin++;
                await openlogin(page2);
                let status2 = await loginusername(page2);
                if (status2 === true) {
                    break;
                }
                if (countlogin > 10) {
                    page2.close();
                    break;
                }
            }
            
          }
           
        await homepage(page2,words[0]);
      //  console.log('a');
        await target(page2);
       
        console.log(i);
        numstart++;
        
            }
        }
    } catch (e) {}

})();