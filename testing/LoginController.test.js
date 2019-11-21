const assert = require('assert');
const webdriver = require('selenium-webdriver');

var driver;
beforeEach(async () => {
    driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
});

async function mockUserSignUpCorrect(){
    await driver.get('http://localhost:8081');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys('billy'+Math.floor(Math.random() * 10000));
    await inputBox2.sendKeys('asdasd');
    const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
    await SignUpButton.click();
    await driver.wait(webdriver.until.alertIsPresent());
    const a1 = await driver.switchTo().alert();
    const a1_text = await a1.getText();
    expect(a1_text).toEqual('Sign up successfully! Please login');
    await a1.dismiss();
}

async function mockUserSignUpIncorrect(){
    await driver.get('http://localhost:8081');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys('zitongzh');
    await inputBox2.sendKeys('asdasd');
    const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
    await SignUpButton.click();
    await driver.wait(webdriver.until.alertIsPresent());
    const a2 = await driver.switchTo().alert();
    const a2_text = await a2.getText();
    expect(a2_text).toEqual('User already exist!');
    await a2.dismiss();
}

async function mockUserNameIncorrect(testInfo){
    await driver.get('http://localhost:8081');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys(testInfo.info[0].username);
    await inputBox2.sendKeys(testInfo.info[0].password);
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.wait(webdriver.until.alertIsPresent());
    const a3 = await driver.switchTo().alert();
    const a3_text = await a3.getText();
    expect(a3_text).toEqual('User Not Exists!');
    await a3.dismiss();
}

async function mockUserPwdIncorrect(testInfo){
    await driver.get('http://localhost:8081');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys(testInfo.info[0].username);
    await inputBox2.sendKeys(testInfo.info[0].password);
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.wait(webdriver.until.alertIsPresent());
    const a4 = await driver.switchTo().alert();
    const a4_text = await a4.getText();
    expect(a4_text).toEqual('Password incorrect, please try again!');
    await a4.dismiss();
}

async function mockUserLoginCorrect(){
    await driver.get('http://localhost:8081');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys("zitongzh");
    await inputBox2.sendKeys("asdasd")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/zitongzh");
}

describe('Login test', () => {
    it('should not forward to the main page since the user is not existed',  (async () => {
        const testInfo={
            'info':[{username: "zitongzhu", password: "asdasd"}]
        };
        await mockUserNameIncorrect(testInfo);
        const curr_url = await driver.getCurrentUrl();
        expect(curr_url).toEqual("http://localhost:8081/");
        })
    );
    
    it('should not forward to the main page since the password is not correct',  (async () => {
        const testInfo={
            'info':[{username: "zitongzh", password: "aaaasdasd"}]
        };
        await mockUserPwdIncorrect(testInfo);
        const curr_url = await driver.getCurrentUrl()
        expect(curr_url).toEqual("http://localhost:8081/");
        })
    );

    it('should forward to the correct main page', (async () => {
        await mockUserLoginCorrect();
        const curr_url = await driver.getCurrentUrl();
        expect(curr_url).toEqual("http://localhost:8081/MainPage/zitongzh");
        })
    );    

    it('should show the correct alert text and clean the password', (async () => {
        await mockUserSignUpCorrect();
        const curr_url = await driver.getCurrentUrl()
        expect(curr_url).toEqual("http://localhost:8081/");
        })
    );

    it('should show the correct alert text', (async () => {
        await mockUserSignUpIncorrect();
        const curr_url = await driver.getCurrentUrl()
        expect(curr_url).toEqual("http://localhost:8081/");
        })
    );
});

afterEach(async () => { 
  await driver.quit();
});