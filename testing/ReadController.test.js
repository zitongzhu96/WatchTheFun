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
    await inputBox1.sendKeys("yfmao");
    await inputBox2.sendKeys("123")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/yfmao");
};

describe('Main page test', () => {
    it('should produce the correct main page', async () => {
        // Check whether the navigation bar is correct
        await mockUserLogin();
        let grid_nav = await driver.findElement(webdriver.By.id("grid-nav"));
        let span_count = await grid_nav.findElements(webdriver.By.tagName("span")).then(element => element.length);
        let div_count = await grid_nav.findElements(webdriver.By.tagName("div")).then(element => element.length);
        expect(span_count).toEqual(1);
        expect(div_count).toEqual(3);
    });

    it("should produce the correct sidebar elements", async () =>{
        // Check whether main components are existed
        await mockUserLogin();
        let grid_container = await driver.findElement(webdriver.By.id("grid-container"));
        let container_div_count = await grid_container.findElements(webdriver.By.tagName("div")).then(element =>element.length)
        
        // The expectation number should change with the number of post changing
        let post_count= await grid_container.findElements(webdriver.By.css("#postboard > *")).then(element => element.length)
        expect(container_div_count).toEqual(13+5*post_count);
        let grid_sidebar = await driver.findElement(webdriver.By.id("grid-sidebar"));
        let sidebar_div_count = await grid_sidebar.findElements(webdriver.By.tagName("div")).then(element => element.length);
        expect(sidebar_div_count).toEqual(10);
        let modal_content = await driver.findElement(webdriver.By.className("modal-content"));
        let modal_input_count = await modal_content.findElements(webdriver.By.tagName("input")).then(element => element.length);
        expect(modal_input_count).toEqual(1);
        let modal_div_count = await modal_content.findElements(webdriver.By.tagName("div")).then(element => element.length);
        expect(modal_div_count).toEqual(7);
        let modal_btn0 = await driver.findElement(webdriver.By.className("btn btn-info btn-lg")).getAttribute("href");
        expect(modal_btn0).toEqual("http://localhost:8081/FriendList/yfmao");
    });

        
    it("should produce the correct navigation bar elements", async () =>{
        // All descendent divs, not only include the direct children divs
        // Expect without promise
        await mockUserLogin();
        let dashboard = await driver.findElement(webdriver.By.id("dashboard")).getAttribute("href");
        expect(dashboard).toEqual("http://localhost:8081/MainPage/yfmao");
        let friendlist = await driver.findElement(webdriver.By.id("friendlistpage")).getAttribute("href");
        expect(friendlist).toEqual("http://localhost:8081/FriendList/yfmao");
        let profile = await driver.findElement(webdriver.By.id("profilepage")).getAttribute("href");
        expect(profile).toEqual("http://localhost:8081/Profile/yfmao");
        let login = await driver.findElement(webdriver.By.id("loginpage")).getAttribute("href");
        expect(login).toEqual("http://localhost:8081/Login");
    });
});


afterEach(async () => { 
    await driver.quit();
  });