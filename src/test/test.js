const {By, Key, Builder} = require("selenium-webdriver");
require("chromedriver");
//
// async function test_case(){
//     let driver = await new Builder().forBrowser("chrome").build();
//
//     await driver.get("https://google.com");
//
//     //cliccco accetta i cookie
//     await driver.findElement(By.id('L2AGLb')).click();
//     //faccio la ricerca di hello world nell'input di ricerca
//     await driver.findElement(By.name("q")).sendKeys("Hello, World!", Key.RETURN);
//
//     setInterval(function(){
//         driver.quit();
//     }, 10000);
// }
//
// test_case()


let seleniumDriver = require("selenium-webdriver");
// get the browser instance
let seleniumBuilder = new seleniumDriver.Builder();
let browserTab = seleniumBuilder.forBrowser("chrome").build();
// open the browser
let browserWindow =
    browserTab.get("https://sp.agenziaentrate.gov.it/rp/poste/sel");

browserWindow
    .then(() => {
        setTimeout(function waitTwoSeconds() {
        browserTab.findElement(By.className('btn btn-primary btn-login btn-login-xs')).click();
        }, 15000)
        //browserTab.findElement(By.id("username")).sendKeys("nicola.melito@gbrain.it", Key.RETURN);

        // browserTab.findElement(By.xpath("//a[@href='https://sp.agenziaentrate.gov.it/rp/poste/sel']")).click();
    })
    .catch(function (error) {
        console.log("Error ", error);
    });