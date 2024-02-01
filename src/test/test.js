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
    browserTab.get("https://members.crurated.com/");

browserWindow
    .then(() => {
        browserTab.findElement(By.name("email")).sendKeys("nicola.melito@gbrain.it", Key.RETURN);
        browserTab.findElement(By.name("password")).sendKeys("Maggiore11.", Key.RETURN);
        browserTab.findElement(By.id('kt_login_signin_submit')).click();


        setInterval(function () {
            browserTab.quit();
        }, 10000);
    })
    .catch(function (error) {
        console.log("Error ", error);
    });