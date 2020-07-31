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
        '--disable-renderer-backgrounding'
        ]
    });
    // const context = await browser.createIncognitoBrowserContext();
    let getPages = await browser.pages();

    let page = await getPages[0];


    await page.setViewport({
        width: getRandomIntInclusive(1250, 2040),
        height: getRandomIntInclusive(1250, 2040),
        deviceScaleFactor: 1,
    });

    //  await page.authenticate({
    //        username: 'nich_1310@yahoo.com',
    //        password: 'N!ch0l@5'
    //    });
  
  
  console.log('a');
    return page;
}

let openlogin = async (pages) => {
    while (pages.url() !== 'https://www.nimo.tv/login') {
        //console.log('open login');
        await pages.goto('https://www.nimo.tv/login', {
            waitLoad: true,
            timeout: 240000,
            waitNetworkIdle: true // defaults to false
        });

        if (pages.url() === 'https://www.nimo.tv/login') {
            break;
        }
    }
}

let loginusername = async (pages,country,phonenum,passwords) => {
    await pages.waitForSelector(click_number);
    await pages.click(click_number);
    await pages.waitForSelector(box);
    await pages.type(box, country);
    await pages.click(indo);
    await pages.type(number, phonenum);
    await pages.type(password, passwords);
    try {
        await Promise.all([
            pages.click(login),
            pages.waitForNavigation({
                 waitLoad: true, 
                timeout: 60000,
                 waitNetworkIdle: true // defaults to false
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
  //  console.log(cookiesString);
    const cookiess = JSON.parse(cookiesString);
    await page.setCookie(...cookiess);
    }
    await page.setRequestInterception(true)
    await page.on('request', request => {
        if (request.resourceType() === 'image')
            request.abort();
        else
            request.continue();
    });
    await page.goto('https://www.nimo.tv/', {
        waitLoad: true,
        timeout: 240000,
        waitNetworkIdle: true // defaults to false
    });
    console.log('landing page success');
    if ( !fs.existsSync(`./cookies/cookies-${phonenum}.json`)) {
    var cookies = await page._client.send('Network.getAllCookies');
    cookies = cookies.cookies.map( cookie => {
      cookie.expiresUTC = new Date(cookie.expires * 1000);

      return cookie;
    });

    var persistantCookies = cookies.filter(c => {
      return !c.session;
    });

    fs.writeFile(`./cookies/cookies-${phonenum}.json`, JSON.stringify(persistantCookies, null, 2), function (err) {
        if (err) return console.log(err);
        console.log('success login');
      });
    }
    // console.log({
    //   persistantCookies: persistantCookies,
    //   persistantCookiesCount: persistantCookies.length,
    // });
}

let target = async (page) => {
    console.log('b');
    await page.goto(link, {
        waitLoad: true,
        timeout: 240000,
        waitNetworkIdle: true // defaults to false
    });
    try{
        await page.waitForSelector('#nimo-player > div.autoplay-alert > div > span');
        await page.evaluate(()=>
        document.querySelector('#nimo-player > div.autoplay-alert > div > span').click());
        await page.evaluate(()=>
        document.querySelector('#nimo-player > div.controls > div:nth-child(1) > div.play-control.control-item > i').click());
        
    }catch(e){}
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
        console.log('a');
        await target(page2);
        console.log(i);
        numstart++;
        
            }
        }
    } catch (e) {}

})();