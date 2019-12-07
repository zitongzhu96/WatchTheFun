const assert = require('assert');
const webdriver = require('selenium-webdriver');

let driver;
beforeEach(async () => {
  driver = await new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();
});

async function mockUserLoginCorrect() {
  await driver.get('http://localhost:8081');
  // console.log(driver)
  await driver.wait(webdriver.until.urlContains('localhost:8081'), 10000);
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys('zitongzh');
  await inputBox2.sendKeys('asdasd');
  const LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
}


async function mockUserNameNotExisted(testInfo) {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys(testInfo.info[0].username);
  await inputBox2.sendKeys(testInfo.info[0].password);
  const LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a1 = await driver.switchTo().alert();
  const a1Text = await a1.getText();
  expect(a1Text).toEqual('User Not Exists!');
  await a1.dismiss();
}


async function mockUserNameIllegal(testInfo) {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys(testInfo.info[0].username);
  await inputBox2.sendKeys(testInfo.info[0].password);
  const LoginButton = await driver.findElement(webdriver.By.id('signup'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a2 = await driver.switchTo().alert();
  const a2Text = await a2.getText();
  expect(a2Text).toEqual('The username can only be 4-12 characters and numbers');
  await a2.dismiss();
}


async function mockPasswordNull(testInfo) {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys(testInfo.info[0].username);
  await inputBox2.sendKeys(testInfo.info[0].password);
  const LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a3 = await driver.switchTo().alert();
  const a3Text = await a3.getText();
  expect(a3Text).toEqual('Password cannot be empty');
  await a3.dismiss();
}


async function mockPasswordIncorrect(testInfo) {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys(testInfo.info[0].username);
  await inputBox2.sendKeys(testInfo.info[0].password);
  const LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a4 = await driver.switchTo().alert();
  const a4Text = await a4.getText();
  expect(a4Text).toEqual('Password incorrect, please try again!');
  await a4.dismiss();
}


async function mockAccountLocked() {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  const username = `billy${Math.floor(Math.random() * 10000)}`;
  const password = 'Goodpass123!';
  await inputBox1.sendKeys(username);
  await inputBox2.sendKeys(password);
  const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
  await SignUpButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a = await driver.switchTo().alert();
  const aText = await a.getText();
  expect(aText).toEqual('Sign up successfully! Please login');
  await a.dismiss();

  await inputBox1.sendKeys(username);
  await inputBox2.sendKeys('Abc123123!');
  let LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  let a5 = await driver.switchTo().alert();
  let a5Text = await a5.getText();
  expect(a5Text).toEqual('Password incorrect, please try again!');
  await a5.dismiss();

  await inputBox2.sendKeys('Abc123123!');
  LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  a5 = await driver.switchTo().alert();
  a5Text = await a5.getText();
  expect(a5Text).toEqual('Password incorrect, please try again!');
  await a5.dismiss();

  await inputBox2.sendKeys('Abc123123!');
  LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  a5 = await driver.switchTo().alert();
  a5Text = await a5.getText();
  expect(a5Text).toEqual('Password incorrect, please try again!');
  await a5.dismiss();

  await inputBox2.sendKeys('Abc123123!');
  LoginButton = await driver.findElement(webdriver.By.id('login'));
  await LoginButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  a5 = await driver.switchTo().alert();
  a5Text = await a5.getText();
  expect(a5Text).toEqual('Your account has been lock, please wait!');
  await a5.dismiss();
}


async function mockUserSignUpCorrect() {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys(`billy${Math.floor(Math.random() * 10000)}`);
  await inputBox2.sendKeys('Goodpass123!');
  const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
  await SignUpButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a6 = await driver.switchTo().alert();
  const a6Text = await a6.getText();
  expect(a6Text).toEqual('Sign up successfully! Please login');
  await a6.dismiss();
}


async function mockUserSignUpFailed() {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys('zitongzh');
  await inputBox2.sendKeys('Goodpass123!');
  const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
  await SignUpButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a7 = await driver.switchTo().alert();
  const a7Text = await a7.getText();
  expect(a7Text).toEqual('User already exist!');
  await a7.dismiss();
}


async function mockSignUpIllegal() {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys('zh');
  await inputBox2.sendKeys('Goodpass123!');
  const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
  await SignUpButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a8 = await driver.switchTo().alert();
  const a8Text = await a8.getText();
  expect(a8Text).toEqual('The username can only be 4-12 characters and numbers');
  await a8.dismiss();
}


async function mockSignupNullPwd() {
  await driver.get('http://localhost:8081');
  const inputBox1 = await driver.findElement(webdriver.By.id('name'));
  const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
  await inputBox1.sendKeys('billy');
  await inputBox2.sendKeys('asd');
  const SignUpButton = await driver.findElement(webdriver.By.id('signup'));
  await SignUpButton.click();
  await driver.wait(webdriver.until.alertIsPresent());
  const a9 = await driver.switchTo().alert();
  const a9Text = await a9.getText();
  expect(a9Text).toEqual('Password should be longer than 8 characters and include Capital letter, numbers, letters, and symbol');
  await a9.dismiss();
}

describe ('Login test', () => {
  it('should forward to the correct main page', (async () => {
    driver = new webdriver.Builder().forBrowser('chrome')
      .withCapabilities(webdriver.Capabilities.chrome())
      .build();
    await mockUserLoginCorrect();
    await driver.wait(webdriver.until.urlContains('/MainPage/zitongzh'));
    const username = await driver.wait(webdriver.until.elementLocated(webdriver.By.id('grid-username')), 10000).getAttribute('innerHTML');
    expect(username).toEqual('zitongzh');
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/MainPage/zitongzh');

  }));

  it ('should not forward to the main page since the user is not existed', (async () => {

    const testInfo = {
      info: [{ username: 'noname', password: 'Goodpass123!' }],
    };
    await mockUserNameNotExisted(testInfo);
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it ('should not forward to the main page since the user name is not in the required format', (async () => {

    const testInfo = {
      info: [{ username: 'ab', password: 'Goodpass123!' }],
    };
    await mockUserNameIllegal(testInfo);
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should not forward to the main page since the password is empty', (async () => {

    const testInfo = {
      info: [{ username: 'zitongzh', password: '' }],
    };
    await mockPasswordNull(testInfo);
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should not forward to the main page since the password is not correct', (async () => {

    const testInfo = {
      info: [{ username: 'zitongzh', password: 'aaaasdasd' }],
    };
    await mockPasswordIncorrect(testInfo);
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should not forward to the main page since the account is locked', (async () => {

    await mockAccountLocked();
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should show the correct alert text and clean the password', (async () => {

    await mockUserSignUpCorrect();
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should not sign up since the user is already existed', (async () => {

    await mockUserSignUpFailed();
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should not sign up since username input does not meet the requirement ', (async () => {

    await mockSignUpIllegal();
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));

  it('should not sign up since the password is not correct', (async () => {

    await mockSignupNullPwd();
    const currUrl = await driver.getCurrentUrl();
    expect(currUrl).toEqual('http://localhost:8081/');

  }));
});

afterEach(async () => { 
  await driver.quit();
});
