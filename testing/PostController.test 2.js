const assert = require('assert');
const webdriver = require('selenium-webdriver');

var driver;
beforeEach(async () => {
  driver = await new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();
});

async function mockUploadImage(testInfo){
    await driver.get('http://localhost:8081/');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys("zitongzh");
    await inputBox2.sendKeys("asdasd")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/zitongzh");
    await driver.wait(webdriver.until.urlIs("http://localhost:8081/MainPage/zitongzh"));

    const PostButton = await driver.findElement(webdriver.By.id("post-your-life"));
    await PostButton.click();
    // Since new post dialog has attribute aria-hidden is true
    // Then every time we open the dialog, we have to wait until it is enabled
    const new_post = await driver.findElement(webdriver.By.id("new-post"));
    await driver.wait(webdriver.until.elementIsVisible(new_post));
    const file_dir = await driver.findElement(webdriver.By.id("file-dir"));
    await file_dir.sendKeys(testInfo.image);
    const img_src = await file_dir.getAttribute("value");
    // Here fakepath will be presented instead of original full path
    expect(img_src).toEqual("C:\\fakepath\\default_icon.jpg");
    const preview_image = await driver.findElement(webdriver.By.id("preview-image")).getAttribute("src");
    expect(preview_image.length).toEqual(16139);
}

async function mockWriteText(testInfo){
    await driver.get('http://localhost:8081/');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys("zitongzh");
    await inputBox2.sendKeys("asdasd")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/zitongzh");
    await driver.wait(webdriver.until.urlIs("http://localhost:8081/MainPage/zitongzh"));

    const PostButton = await driver.findElement(webdriver.By.id("post-your-life"));
    await PostButton.click();
    // Since new post dialog has attribute aria-hidden is true
    // Then every time we open the dialog, we have to wait until it is enabled
    const new_post = await driver.findElement(webdriver.By.id("new-post"));
    await driver.wait(webdriver.until.elementIsVisible(new_post));
    // A fake image to open the preivew area
    const post_content = await driver.findElement(webdriver.By.id("post-content"));
    await post_content.sendKeys(testInfo.text)
    // Have to wait some time here
    const file_dir = await driver.findElement(webdriver.By.id("file-dir"));
    await file_dir.sendKeys(testInfo.image);
    const preview_text = await driver.findElement(webdriver.By.id("preview-text")).getText();
    expect(preview_text).toEqual(testInfo.text);
}

async function mockCloseNewPost(testInfo){
    await driver.get('http://localhost:8081/');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys("zitongzh");
    await inputBox2.sendKeys("asdasd")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/zitongzh");
    await driver.wait(webdriver.until.urlIs("http://localhost:8081/MainPage/zitongzh"));

    const postboard = await driver.findElement(webdriver.By.id("postboard"));
    const original_count = await postboard.findElements(webdriver.By.tagName("div")).then(element => element.length);

    const PostButton = await driver.findElement(webdriver.By.id("post-your-life"));
    await PostButton.click();
    const new_post = await driver.findElement(webdriver.By.id("new-post"));
    await driver.wait(webdriver.until.elementIsVisible(new_post));
    const file_dir = await driver.findElement(webdriver.By.id("file-dir"));
    await file_dir.sendKeys(testInfo.image);
    const post_content = await driver.findElement(webdriver.By.id("post-content"));
    await post_content.sendKeys(testInfo.text);

    // However we close it before posting
    const ClosePost = await driver.findElement(webdriver.By.id("close-post"));
    await ClosePost.click();

    // No new post is created
    const new_count = await postboard.findElements(webdriver.By.tagName("div")).then(element => element.length);
    expect(new_count).toEqual(original_count);
}

async function mockAddNewPost(testInfo){
    await driver.get('http://localhost:8081/');
    const inputBox1 = await driver.findElement(webdriver.By.id('name'));
    const inputBox2 = await driver.findElement(webdriver.By.id('pwd'));
    await inputBox1.sendKeys("zitongzh");
    await inputBox2.sendKeys("asdasd")
    const LoginButton = await driver.findElement(webdriver.By.id('login'));
    await LoginButton.click();
    await driver.get("http://localhost:8081/MainPage/zitongzh");
    await driver.wait(webdriver.until.urlIs("http://localhost:8081/MainPage/zitongzh"));

    // Count the number of post before testing
    const postboard = await driver.findElement(webdriver.By.id("postboard"));
    const original_count = await postboard.findElements(webdriver.By.tagName("div")).then(element => element.length);

    const PostButton = await driver.findElement(webdriver.By.id("post-your-life"));
    await PostButton.click();
    const new_post = await driver.findElement(webdriver.By.id("new-post"));
    await driver.wait(webdriver.until.elementIsVisible(new_post));
    const file_dir = await driver.findElement(webdriver.By.id("file-dir"));
    await file_dir.sendKeys(testInfo.image);
    const post_content = await driver.findElement(webdriver.By.id("post-content"));
    await post_content.sendKeys(testInfo.text);

    const AddPost = await driver.findElement(webdriver.By.id("add-post"));
    await AddPost.click();

    const new_count = await postboard.findElements(webdriver.By.tagName("div")).then(element => element.length);
    const latest_post = await postboard.findElement(webdriver.By.tagName("div"));
    expect(new_count).toEqual(original_count+5);
    const new_subcount1 = await latest_post.findElements(webdriver.By.tagName("div")).then(element => element.length);
    expect(new_subcount1).toEqual(4);
    const latest_title = await latest_post.findElement(webdriver.By.css("div > div"));
    const latest_person = await latest_title.findElement(webdriver.By.css("div > div"));
    // Dealing with tesging list of elements
    await latest_person.findElements(webdriver.By.tagName("div")).then(element=>function(){
        expect(element[1].getText()).toEqual("zitongzh");
        });
    await latest_post.findElements(webdriver.By.tagName("div")).then(element => async function(){
        const latest_image= await element[1].findElement(webdriver.By.tagName("div"));
        const imgurl= await latest_image.getAttribute("src");
        expect(imgurl).toEqual(testInfo.image);
    });
}



describe('Add new post test', () => {
    it("should upload the image",async()=>{
        const testInfo={
            image: process.cwd()+"\\public\\externals\\default_icon.jpg"
        };
        await mockUploadImage(testInfo);
    })

    it("should write the input text",async()=>{
        const testInfo={
            image: process.cwd()+"\\public\\externals\\default_icon.jpg",
            text: "testing text"+Math.floor(Math.random()*10000)
        };
        await mockWriteText(testInfo);
    })


    it("should clear the modal instead of generating a new post", async() => {
        const testInfo={
            image: process.cwd()+"\\public\\externals\\default_icon.jpg",
            text: "testing text"+Math.floor(Math.random()*10000)
        };
        await mockCloseNewPost(testInfo);
    })

    it("should add a new post into the mainpage",async() =>{
        const testInfo={
            image: process.cwd()+"\\public\\externals\\default_icon.jpg",
            text: "testing text"+Math.floor(Math.random()*10000)
        };
        await mockAddNewPost(testInfo);
    })
    
});


afterEach(async () => { 
    await driver.quit();
  });