const puppeteer = require('puppeteer');
const fs = require('fs');

(async ()=>{
    const CompnayData=[
        "CIN",
        "CompanyName",
        "RegistrationNumber",
        "ClassofCompany",
        "DateofIncorporation",
        "AgeofCompany"
    ]
    const browser= await puppeteer.launch({ headless: false,args: ['--disable-dev-shm-usage'] });
    const page= await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 720,
        deviceScaleFactor: 1,
    });
    await page.goto('https://www.zaubacorp.com/company-list/age-B/p-1-company.html');
    let table=await page.$('#table');
    // console.log(search);
    const tr=await table.$$('tr');
    tr.forEach(async data=>{
        op= await data.$$eval('td',(options)=>options.map((da,i)=>{
            if(i==1){
                return da.innerHTML.split(`"`)[1]
            }
            return da.textContent
        })) 
            const link = await op[1];
            try{
                const page1= await browser.newPage();
                await page1.goto(link,{timeout:0});
                const tables= await page1.$$('.table.table-striped');
                const trs= await tables[0].$$('tr');
                let arr=[];
                trs.forEach(async tr=>{
                    // console.log(1)
                    const dat=await tr.$$eval('td',options=>options.map(option=>option.textContent));
                    dat[0]=await dat[0].replace(/\s+/g, '')
                    const check= await CompnayData.filter(data=>data===dat[0]);
                    if(check.length){
                        // console.log(dat[1].replace(/^\s+|\s+$/g, ''));
                        arr.push(dat[1].replace(/^\s+|\s+$/g, ''))
                        // console.log(arr);
                        console.log("=============================================================================")
                    }
                })
                arr= await arr;
                    fs.appendFile('hello.csv',`\n${arr.join(',')},`,(err)=>{
                        if(err) return console.log(err);
                        console.log("written")
                    })
                await page1.waitFor(1000)
                await page1.close();

            }catch(err){
                console.log(err);
            }
    })
})()