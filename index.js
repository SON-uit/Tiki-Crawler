const fs = require("fs");

const crawl = require("./crawl");
const mapping = require("./mapping");
  
const baseURL = "https://tiki.vn";
const navigateURL = "https://tiki.vn/pin-sac-du-phong/c1821";

function createMoreInfo(data, header) {
  let text = `<h3 style="margin:0">${header}</h3><ul>`;
  for (const el of data) {
    text += `<li>${el.key} <span>:&nbsp;</span><span>${el.value}</span></li>`;
  }
  text += `</ul>`;
  return text;
}
function convertData(data) {
  return data.map((el) => {
    return {
      sku: el.sku,
      productName: el.productName,
      regularPrice: el.regularPrice,
      salePrice: el.regularPrice === el.salePrice ? "" : el.salePrice,
      description: `${el.description}${createMoreInfo(
        el.moreInfo,
        "Thông tin sản phẩm"
      )}${el.style.length > 0 ? createMoreInfo(el.style, "Model") : ""}`,
      categories: el.categories,
      weight: el.weight,
      color: el.color,
      images: el.images,
    };
  });
}
function writeToTxt(text,fileName) {
  fs.writeFileSync(`${fileName}.txt`, text, "utf8");
}
(async () => {
  const data = await crawl(baseURL, navigateURL,1); // baseURL, navigateURL, numberOfPage
  const mappingText = mapping(convertData(data));
  await writeToTxt(mappingText,'testsku');
})();
