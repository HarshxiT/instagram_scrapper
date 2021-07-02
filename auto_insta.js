const puppeteer = require('puppeteer');
const fs = require('fs');
const cheerio = require("cheerio");
var json2xls = require('json2xls');
const user = "audiphotography";
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        slowMo: 100,
        args: ["--start-maximized"],
    });
    page = await browser.newPage();
    page.goto("https://www.instagram.com/accounts/login/",{"waitUntil" : "networkidle0"})
    await page.waitForSelector("[name='username']")
    await page.type("[name='username']", "sakibawli")
    await page.type("[name='password']", "jsharp1008")
    await Promise.all([page.click(".sqdOP.L3NKy.y3zKF"), page.waitForNavigation()]);
    await page.waitForSelector("[placeholder='Search']")
    await page.type("[placeholder='Search']", user)
    await page.waitForSelector(".Igw0E.rBNOH.eGOV_.ybXk5._4EzTm.XfCBB.HVWg4")
    let sel = await page.$$(".Igw0E.rBNOH.eGOV_.ybXk5._4EzTm.XfCBB.HVWg4")
    await Promise.all([sel[0].click(), page.waitForNavigation()]);
    fs.mkdirSync(user);
    await page.waitForSelector(".vtbgv")
    let pro = await page.$(".vtbgv")
    await pro.screenshot({
        path: './' + user + "/" + 'profile.png'
    });
    await page.waitForSelector("a .KL4Bh img")
    var jsn = []
    const ar = await page.$$("a .KL4Bh img")
    for (let element in ar) {

        await Promise.all([ar[element].click(), page.waitForSelector(".ltpMr.Slqrh")]);

        // console.log(jsn);
        let src = await page.evaluate((element) => {
            return document.querySelectorAll("a .KL4Bh img")[element].getAttribute("src")

        }, element)
        let date = await page.evaluate(() => {
            return document.querySelector("._1o9PC.Nzb55").getAttribute("title")

        })
        let likes = await page.evaluate(() => {
            if (document.querySelector('.zV_Nj')) {
                let l = document.querySelector('.zV_Nj span').innerText
                return l
            }
            else if (document.querySelector('.HbPOm._9Ytll')) {
                document.querySelector(".vcOH2").click();
                let l = document.querySelector('.vJRqr span').innerText
                document.querySelector(".QhbhU").click();
                return l
            }
            return null;

        })
        let views = await page.evaluate(() => {
            if (document.querySelector('.vcOH2')) {
                let l = document.querySelector('.vcOH2 span').innerText
                return l
            }
            return "Not applicable";

        })
        let tags = await page.evaluate(() => {
            if (document.querySelector('.xil3i')) {
                let l = document.querySelectorAll('.xil3i')
                return Array.from(l, v => v.innerText)
            }
            return "No tags found";

        })
        let tagged = await page.evaluate(() => {
            if (document.querySelector('.C7I1f.X7jCj .notranslate')) {
                let l = document.querySelectorAll('.C7I1f.X7jCj .notranslate')
                return Array.from(l, v => v.innerText)
            }
            return "No tags found";

        })
        let location = await page.evaluate(() => {
            if (document.querySelector('.O4GlU')) {
                let l = document.querySelector('.O4GlU').innerText
                return l
            }
            return "No location found";

        })
        let ta = {}
        let hb = await puppeteer.launch();
        let hp = await hb.newPage();
        let imagefileDL = await hp.goto(src)
        ta["image"] = src
        ta["date"] = date
        ta["likes"] = likes
        ta['views'] = views
        ta['hashtags'] = tags
        ta['people_tagged'] = tagged
        ta['location'] = location
        fs.writeFileSync('./' + user + "/" + element + ".png", await imagefileDL.buffer())
        await hp.close()
        await hb.close()
        await page.click(".Igw0E.IwRSH.eGOV_._4EzTm.BI4qX.qJPeX.fm1AK.TxciK.yiMZG")
        await page.waitForSelector(".-nal3")
        jsn.push(ta);

    }
    console.log(jsn);
    convert(jsn);
    page.close();
    browser.close();
})()

var convert = function (allUsers) {
    var xls = json2xls(allUsers);
    fs.writeFile(user+".xlsx", xls, 'binary', (err) => {
       if (err) {
             console.log("writeFileSync :", err);
        }
      console.log( user+".xlsx"+" file is saved!");
   });
  }