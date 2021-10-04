require('dotenv').config();
const puppeteer = require('puppeteer');
const fs = require('fs');
const mongoose=require('mongoose');
const Company= require('./CompanyModal');
const port = process.env.PORT || 5000;
const express=require('express');
const app= express();

(async ()=>{

    mongoose.connect("mongodb+srv://root:toor@cluster0.wry5f.mongodb.net/Company?retryWrites=true&w=majority").then(()=>{
        console.log("Connected Successfully!!!");
    }).catch(err=>console.log(err))

    const CompnayData=[
        "CIN",
        "CompanyName",
        "CompanyStatus",
        "RoC",
        "RegistrationNumber",
        "ClassofCompany",
        "DateofIncorporation",
        "AgeofCompany"
    ]
    const chromeOptions = {
        headless: false,
        defaultViewport: null,
        args: [
            "--incognito",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
    };
    const browser= await puppeteer.launch(chromeOptions);
    for(let i=203;i<9785;i++){
        const page= await browser.newPage();
        await page.setViewport({
            width: 1920,
            height: 720,
            deviceScaleFactor: 1,
        });
        await page.goto(`https://www.zaubacorp.com/company-list/age-B/p-${i+1}-company.html`);
        let table=await page.$('#table');
        // console.log(search);
        const links=await table.$$eval('tr td a',options=>options.map(option=>{
            console.log(option.textContent)
            return option.href
        }));
        for(let link of links){
            const newTab = await browser.newPage();
            await newTab.goto(link);
            const gg= await newTab.$$eval('.col-lg-6.col-md-6.col-sm-12.col-xs-12',options=>{
                return options.map((da,i)=>{
                    console.log(i);
                    if(i===2){
                        return da.querySelector('p').textContent;
                    }
                })
            });
            try{
                
                const emailid=gg[2].split(' ')[3]
                const tables=await newTab.$$eval('.table.table-striped tr',options=>{
                    return options
                    .map(option=>{
                        const op=[];
                        option.querySelectorAll('td').forEach((da,i)=>{
                            if(i===0){
                                op.push(da.textContent.replace(/\s+/g, ''))
                            }else{
                                op.push(da.textContent.replace(/^\s+|\s+$/g, ''))
                            }
                        })
                        return op;
                    })
                })
                const tableFinal=tables.map(data=>{
                    // console.log(CompnayData.filter(da=>da===data[0]));
                    if(CompnayData.filter(da=>da===data[0]).length){
                        let a=data[0];
                        let b=data[1];
                        let op={};
                        op[`${a}`]=b;
                        return data;
                    }
                    return null;
                })
                tableFinal.push(["Email_id",emailid]);
                // console.log(tableFinal.filter(Boolean))
                const tryarr=tableFinal.filter(Boolean).reduce((obj,data)=>{
                    return{
                        ...obj,
                        [data[0]] : data[1]
                    }
                },{})
                const companyData= new Company({
                    ...tryarr
                });
                companyData.DateofIncorporation=new Date(companyData["DateofIncorporation"]);
                companyData.save();
                    // fs.appendFile('company.json',`\n${JSON.stringify(tryarr)},`,(err)=>{
                    //     if(err) return console.log(err);
                    //     console.log("written")
                    // })
                await newTab.close();
            }catch(err){
                console.log(err);
            }
        }
        await page.close();
    }
})()

app.get('/',(req,res)=>{
    res.send("Hello Jdssss");
})

app.listen(port,()=>{
    console.log(`connected on ${port}`)
})

 // Handle unhandled promise rejections
 process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });
  
  process.on("uncaughtException", (err, promise) => {
    console.log(`Error: ${err.message}`);
  });