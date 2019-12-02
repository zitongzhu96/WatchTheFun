const assert = require('assert');
const webdriver = require('selenium-webdriver');

var driver;
beforeEach(async () => {
    driver = await new webdriver.Builder()
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
});

async function mockUserLogin(){
    await driver.get('http://localhost:8081');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.clear();
    await inputBox2.clear();
    await inputBox1.sendKeys("zitongzh");
    await inputBox2.sendKeys("asdasd")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/zitongzh");
    const ProfileButton = await driver.findElement(webdriver.By.id('profilepage'));
    await ProfileButton.click();
    await driver.get("http://localhost:8081/Profile/zitongzh");
};

describe('Main page test', () => {
    it('should produce the correct main page and username', async () => {
        // Check whether the navigation bar is correct
        await mockUserLogin();
        let grid_nav = await driver.findElement(webdriver.By.id("grid-nav"));
        let span_count = await grid_nav.findElements(webdriver.By.tagName("span")).then(element => element.length);
        let div_count = await grid_nav.findElements(webdriver.By.tagName("div")).then(element => element.length);
        let username = await driver.findElement(webdriver.By.id("grid-username")).getAttribute("innerHTML");
        expect(span_count).toEqual(1);
        expect(div_count).toEqual(3);
        expect(username).toEqual("zitongzh");
    });


    it("should produce the correct sidebar elements", async () =>{
        // Check whether main components are existed
        await mockUserLogin();
        let container = await driver.findElement(webdriver.By.id("postboard"));
        let container_div_count = await container.findElements(webdriver.By.tagName("div")).then(element =>element.length)
        
        // The expectation number should change with the number of post changing
        let post_count= await container.findElements(webdriver.By.css("#postboard > *")).then(element => element.length);
        expect(container_div_count).toEqual(4*post_count);
    });

        
    it("should produce the correct navigation bar elements", async () =>{
        await mockUserLogin();
        let dashboard = await driver.findElement(webdriver.By.id("dashboard")).getAttribute("href");
        expect(dashboard).toEqual("http://localhost:8081/MainPage/zitongzh");
        let friendlist = await driver.findElement(webdriver.By.id("friendlistpage")).getAttribute("href");
        expect(friendlist).toEqual("http://localhost:8081/FriendList/zitongzh");
        let profile = await driver.findElement(webdriver.By.id("profilepage")).getAttribute("href");
        expect(profile).toEqual("http://localhost:8081/Profile/zitongzh");
    });
});


afterEach(async () => { 
    await driver.quit();
  });