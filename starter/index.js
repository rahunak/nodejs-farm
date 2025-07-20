const http = require('http');
const url = require('url');
const fs = require('fs');

const replaceTemplate = (template, product) => {
    let output = template.replace(/{%PRODUCT_ID%}/g, product.id);
    output = output.replace(/{%PRODUCT_NAME%}/g, product.productName);
    output = output.replace(/{%PRODUCT_IMAGE%}/g, product.image);
    output = output.replace(/{%PRODUCT_COUNTRY%}/g, product.from);
    output = output.replace(/{%PRODUCT_NUTRIENS%}/g, product.nutrients);
    output = output.replace(/{%PRODUCT_QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRODUCT_PRICE%}/g, product.price);
    output = output.replace(/{%PRODUCT_DESCRIPTION%}/g, product.description);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output;
}

const templProducts = fs.readFileSync(`${__dirname}/templates/products-temlate.html`, 'utf-8');
const templOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const templCard = fs.readFileSync(`${__dirname}/templates/card-template.html`, 'utf-8');
const product_style = fs.readFileSync(`${__dirname}/templates/css/product_style.css`);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const request_url = req.url;
    console.log('request_url', request_url);
    //OVERVIEW
    if (request_url === '/' || request_url === '/overview') {

        const productsHtml = dataObj.map(product => replaceTemplate(templCard, product)).join('');

        const overviewHtml = templOverview.replace(/{%PRODUCT.CARDS%}/g, productsHtml);

        res.end(overviewHtml);

        //PRODUCT
    } else if (request_url === '/product') {
        res.end(templProducts);
    }
    //STYLE
    else if (request_url === '/product_style.css') {
        res.end(product_style);
    }
    //API
    else if (request_url === '/api') {
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(data);
    }
    else {
        res.end("Page not found.");
    }


})

server.listen(8000, '127.0.0.2', () => {
    console.log("Listening reqests on 8000 port.")
})
