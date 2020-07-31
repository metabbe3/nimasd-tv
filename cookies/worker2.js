const puppeteer = require('puppeteer');
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
        useragent,
        proxy,
        phonenum,
        link
    }
} = require('worker_threads');




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
let openbrowser = async () => {
    try{
    process.removeAllListeners();
    process.setMaxListeners(999999);

    const browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${proxy}`,
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu',
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
        width: getRandomIntInclusive(0, 2040),
        height: getRandomIntInclusive(0, 2040),
        deviceScaleFactor: 1,
    });

    //  await page.authenticate({
    //        username: 'nich_1310@yahoo.com',
    //        password: 'N!ch0l@5'
    //    });
    await page.setUserAgent(useragent);

    return page;
}catch(e){}
}

let openlogin = async (pages) => {
    try{
        
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
}catch(e){}
}

let loginusername = async (pages) => {
    try{
    await pages.waitForSelector(click_number);
    await pages.click(click_number);
    await pages.waitForSelector(box);
    await pages.type(box, 'United States');
    await pages.click(indo);
    await pages.type(number, phonenum);
    await pages.type(password, 'masuk123');
    try {
        await Promise.all([
            pages.click(login),
            pages.waitForNavigation({
                //  waitLoad: true, 
                timeout: 60000,
                //  waitNetworkIdle: true // defaults to false
            }),
        ]);
        return true;
    } catch (e) {
        return false;
    }
}catch(e){}
}

let homepage = async (page) => {
    try{
        
    await page.setRequestInterception(true)
    await page.on('request', request => {
        if (request.resourceType() === 'image' || request.resourceType() === 'font' || request.resourceType() === 'stylesheet')
            request.abort();
        else
            request.continue();
    });
    if ( fs.existsSync(`./cookies/cookies-${phonenum}.json`)) {
        console.log('please wait fast login');
    const cookiesString = fs.readFileSync(`./cookies/cookies-${phonenum}.json`);
  //  console.log(cookiesString);
    const cookiess = JSON.parse(cookiesString);
    await page.setCookie(...cookiess);
    }
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
}catch(e){}
}

let target = async (page) => {
    try{
    await page.goto(link, {
        waitLoad: true,
        timeout: 240000,
        waitNetworkIdle: true // defaults to false
    });
    //browser.disconnect();
    process.removeAllListeners();
    console.log('Process end.');
    console.timeEnd('Execution time');
}catch(e){}
}

(async () => {
    try {

        const countlogin = 0;
        const page2 = await openbrowser();
        if ( !fs.existsSync(`./cookies/cookies-${phonenum}.json`)) {
            console.log('dont exist');
            await openlogin(page2);
            let status = await loginusername(page2);
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
           
          
        await homepage(page2);
        await target(page2);
    } catch (e) {}

})();