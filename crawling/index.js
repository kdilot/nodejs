const puppeteer = require('puppeteer')

const crawler = async () => {
    // const browser = await puppeteer.launch({
    //     headless: false,
    // })
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const amipure_id = ''
    const amipure_pw = ''
    await page.goto('https://www.amipure.com/member/login.php')
    await page.evaluate(
        (id, pw) => {
            document.querySelector('#loginId').value = id
            document.querySelector('#loginPwd').value = pw
        },
        amipure_id,
        amipure_pw
    )
    // formLogin
    // await page.click('.btn_add_order')
    let searchForm = await page.$('#formLogin')
    await searchForm.evaluate((searchForm) => searchForm.submit())
    await page.waitForNavigation()
    // await page.goto('https://www.amipure.com/mypage/index.php') // 마이페이지

    //  상품 주문페이지
    await page.goto(
        'http://www.amipure.com/goods/goods_view.php?goodsNo=1000000035&mtn=8%5E%7C%5EPC%EB%A9%94%EC%9D%B8+-+%ED%81%90%EB%A0%88%EC%9D%B4%EC%85%981%5E%7C%5En'
    )
    await page.click('.btn_add_order')
    await page.waitForNavigation()

    await page.screenshot({ path: 'amipure.png', fullPage: true })
    await browser.close()
}

crawler()
