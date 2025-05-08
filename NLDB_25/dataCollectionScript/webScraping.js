'use strict';

const puppeteer = require('puppeteer');
const { inject } = require('./js/inject');
const { updateJSON } = require("./js/conversion/convertData");
const { convertToGraph } = require("./js/conversion/convertDataToGraph");
const {convertToBarPlot} = require("./js/conversion/convertDataToBarPlot");
const fs = require('fs');
const readline = require('readline');

// Set up error logger
let errorLogger = fs.createWriteStream('./errorLog.txt', {
    flags: 'a'
})

// Read the X first line of the top-1m url visited from TRANCO (07/05/2023, 11:19)
const fileStream = fs.createReadStream("./top-1m.csv");
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
});

const processUrl = async (url) => {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();



    // In order to bypass some verification made by website against BOT (put a real UserAgent)
    await page.setUserAgent("Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/112.0");
    await page.setBypassCSP(true);

    await page.evaluateOnNewDocument(injectCode => {
        let script = document.createElement('script');
        script.text = "(" + injectCode + ")()";
        // Detect when the head element is added to the DOM and then inject the script immediately.
        document.addEventListener('DOMSubtreeModified', function onModified(event) {
            if (event.target.nodeName === 'HEAD') {
                document.removeEventListener('DOMSubtreeModified', onModified);
                event.target.appendChild(script);
            }
        });
    }, inject.toString());

    try {
        await page.goto(url, {
            waitUntil: 'networkidle0',
            timeout: 120000
        });

        // Get the content of window.getScripts before ending the connection
        await page.evaluate(() => {
            let res = Object.fromEntries(
                Object.entries(window.getScripts).filter(([key, value]) => window.getPOSTUrl.includes(key)));

            return (Object.keys(res).length === 0 ? {null: window.location.href} : res);
        }).then((res) => {
            if (res !== undefined) {
                setTimeout(() => { updateJSON(url, res, './data/injectionInformation.json', './data/attributeInformation.json'); }, 1000);
            }

        });
    } catch (e) {
        if (e.name === "TimeoutError") {
            console.log(`${url}: ${e.name}, try with networkidle2`);
            try {
                await page.goto(url, {
                    waitUntil: 'networkidle2',
                    timeout: 120000
                });

                // Get the content of window.getScripts before ending the connection
                await page.evaluate(() => {
                    let res = Object.fromEntries(
                        Object.entries(window.getScripts).filter(([key, value]) => window.getPOSTUrl.includes(key)));

                    return (Object.keys(res).length === 0 ? {null: window.location.href} : res);
                }).then((res) => {
                    if (res !== undefined) {
                        setTimeout(() => { updateJSON(url, res, './data/injectionInformation.json', './data/attributeInformation.json'); }, 1000);
                    }

                });
            } catch (e) {
                console.log(`${url}: ${e.name}, doesn't work even with networkidle2`);
                errorLogger.write(`${url}: ${e.name}\n`);
            }
        } else {
            console.log(`${url}: ${e.name}`);
            errorLogger.write(`${url}: ${e.name}\n`);
        }

    }

    await browser.close();
};

const processLine = async (line) => {
    const url = "https://" + line.split(",")[1];
    console.log(url);
    await processUrl(url);
    if (lineNumber % 50 === 0) console.log(`${lineNumber} url visited (${Math.round((lineNumber/numberUrlToVisit)*100)}% of all url to visit)`);
    lineNumber++;
};

let lineNumber = 0;
const numberUrlToVisit = 1000;

const processFile = async () => {
    let lineNumber = 0;
    for await (const line of rl) {
        if (lineNumber >= numberUrlToVisit) {
            convertToGraph('./data/injectionInformation.json', './data/graph.json');
            setTimeout(() => { convertToBarPlot('./data/attributeInformation.json', './data/barPlot.json') }, 2000);
            break;
        }
        await processLine(line);
        lineNumber++;
    }
};

processFile();
