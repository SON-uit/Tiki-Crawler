const puppeteer = require("puppeteer");
const fs = require("fs");
const { url } = require("inspector");
const { match } = require("assert");

module.exports = async function crawl(baseURL, navigateURL, numberOfPages = 1) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });
  //const baseURL = "https://tiki.vn";
  const objCrawledData = [];
  await page.goto(baseURL, {
    waitUntil: "networkidle2",
  });

  const listURL = []; // list all Case Item in Tiki
  for (let i = 1; i <= numberOfPages; i++) {
    await page.goto(`${navigateURL}?page=${i}`, {
      waitUntil: "networkidle2",
    });
    let productLink = await page.$$eval(".product-item", (urls) =>
      urls.map((el) => {
        const url = el.getAttribute("href").split("?")[0];
        if (url !== "//tka.tiki.vn/pixel/pixel") {
          return url;
        }
      })
    );
    productLink = productLink.filter((el) => el != null);
    listURL.push(...productLink);
  }
  for (let i = 0; i < listURL.length; i++) {
    const url = listURL[i];
    await page.goto(`${baseURL}${url}`);
    try {
      const productInfo = await page.evaluate(() => {
        //Name of Product
        const productName = document.querySelector(".header .title").innerText;
        // Regular Price of Product
        const regularPrice =
          (
            document.querySelector(".product-price__list-price") ||
            document.querySelector(".sale .list-price") ||
            document.querySelector(".product-price__current-price")
          ).innerText
            .match(/\d/g)
            .join("") * 1;
        // Sale Price of Product
        const salePrice =
          (
            document.querySelector(".flash-sale-price > span") ||
            document.querySelector(".product-price__current-price")
          ).innerText
            .match(/\d/g)
            .join("") * 1 || 0;
        // Color of Product
        const color = [...document.querySelectorAll(".option-label")]
          .map((el) => el.innerText)
          .join();
        // Images of Product
        const images = [
          ...document.querySelectorAll(".review-images__list  img"),
        ]
          .map((el) => el.getAttribute("src"))
          .join(",")
          .replaceAll("100x100", "400x400");

        // Categories of Product
        let categories = document.querySelector(
          '.breadcrumb-item[data-view-index ="4"] span'
        ).innerText;
        const subCategories = `${
          document.querySelector('.breadcrumb-item[data-view-index ="3"] span')
            .innerText
        } > ${categories}`;
        categories = `${categories} , ${subCategories}`;
        // Details of Product
        let moreInfo = [
          ...document.querySelectorAll(".content.has-table table tbody tr"),
        ].map((el) => {
          return {
            key: el.childNodes[0].innerText,
            value: el.childNodes[1].innerText.replace(/;/g, ","),
          };
        });
        // Description of Product
        let description =
          [
            ...document.querySelectorAll(
              ".left .group .content:nth-child(2) p "
            ),
          ]
            .map((el) => el.innerText)
            .join(". ") || "";
        const policy = [...document.querySelectorAll(".benefit-item span")].map(
          function (el) {
            const text = el.innerText;
            return text.replace(/\n/gm, " ");
          }
        );
        const style = [
          ...document.querySelectorAll(".body .left > div:nth-child(2) > div"),
        ].map((el) => {
          const queryValueEl =
            el.querySelectorAll("button").length > 0
              ? el.querySelectorAll("button")
              : el.querySelectorAll(".option-label");
          return {
            key: el.querySelector(".option-name").innerText,
            value: [...queryValueEl].map((el) => el.innerText).join(","),
          };
        });
        return {
          productName,
          regularPrice,
          salePrice,
          moreInfo,
          description,
          categories,
          //weight,
          color,
          images,
          style,
        };
      });
      objCrawledData.push(productInfo);
    } catch (e) {
      console.log(e);
    }
  }
  await page.close();
  await browser.close();
  return Promise.resolve(objCrawledData);
};
