const {By, Key, Builder} = require("selenium-webdriver");
require("chromedriver");


let seleniumDriver = require("selenium-webdriver");
const {elementLocated} = require("@material-ui/core/test-utils/until");
// get the browser instance
let seleniumBuilder = new seleniumDriver.Builder();
let browserTab = seleniumBuilder.forBrowser("chrome").build();
// open the browser
let browserWindow = browserTab.get("https://www.google.it/");

browserWindow
    .then(() => {
        browserTab.findElement(By.className('QS5gu sy4vM')).click();
        browserTab.findElement(By.name("q")).sendKeys("Hello, World!", Key.RETURN);
        setTimeout(function waitTwoSeconds() {
            browserTab.findElement(By.linkText('Amiga E')).click();
        }, 9000)

    })
    .catch(function (error) {
        console.log("Error ", error);
    });