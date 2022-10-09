const puppeteer = require("puppeteer");
const fs = require("fs");
function mapping(data) {
  let header = `ID@Type@SKU@Name@Published@"Is featured?"@"Visibility in catalog"@"Short description"@Description@"Date sale price starts"@"Date sale price ends"@"Tax status"@"Tax class"@"In stock?"@Stock@"Low stock amount"@"Backorders allowed?"@"Sold individually?"@"Weight(kg)"@"Length(cm)"@"Width(cm)"@"Height(cm)"@"Allow customer reviews?"@"Purchase note"@"Sale price"@"Regular price"@Categories@Tags@"Shipping class"@Images@"Download limit"@"Download expiry days"@Parent@"Grouped products"@Upsells@Cross-sells@"External URL"@"Button text"@Position@"Attribute 1 name"@"Attribute 1 value(s)"@"Attribute 1 visible"@"Attribute 1 global"@"Attribute 1 default"@"Attribute 2 name"@"Attribute 2 value(s)"@"Attribute 2 visible"@"Attribute 2 global"@"Attribute 2 default"@"Attribute 3 name"@"Attribute 3 value(s)"@"Attribute 3 visible"@"Attribute 3 global"@"Attribute 3 default"@"Attribute 4 name"@"Attribute 4 value(s)"@"Attribute 4 visible"@"Attribute 4 global"@"Attribute 4 default"@"Attribute 5 name"@"Attribute 5 value(s)"@"Attribute 5 visible"@"Attribute 5 global"@"Attribute 5 default"@"Attribute 6 name"@"Attribute 6 value(s)"@"Attribute 6 visible"@"Attribute 6 global"@"Attribute 6 default"@"Attribute 7 name"@"Attribute 7 value(s)"@"Attribute 7 visible"@"Attribute 7 global"@"Attribute 7 default"@"Attribute 8 name"@"Attribute 8 value(s)"@"Attribute 8 visible"@"Attribute 8 global"@"Attribute 8 default"@"Attribute 9 name"@"Attribute 9 value(s)"@"Attribute 9 visible"@"Attribute 9 global"@"Attribute 9 default"`;
  const {
    type = "simple",
    sku = "",
    productName,
    published = 1,
    isFeatured = 0,
    visibileInCatelog = "visible",
    shortDescription = "",
    description = "",
    dateSalePriceStarts = "",
    dateSalePriceEnds = "",
    taxStatus = "taxable",
    taxClass = "",
    inStock = 1,
    stock = 50,
    lowStockAmount = "",
    backOrdersAllowed = 0,
    soldIndividually = 0,
    weight = "",
    length = "",
    width = "",
    height = "",
    allowCustomerReviews = 1,
    purchaseNote = "",
    salePrice = "",
    regularPrice = "",
    categories = "",
    tags = "",
    shippingClass = "",
    images = "",
    downloadLimit = "",
    downloadExpiryDays = "",
    parent = "",
    groupedProducts = "",
    upSells = "",
    crossSells = "",
    externalUrl = "",
    buttonText = "",
    position = 0,
    attr1Name = "Brand",
    brand = "",
    attr1Visible = 0,
    attr1Global = 1,
    attr1Default = "",
    attr2Name = "CaseSize",
    caseSize = "",
    attr2Visible = 0,
    attr2Global = 1,
    attr2Default = "",
    attr3Name = "CaseShape",
    caseShape = "",
    attr3Visible = 0,
    attr3Global = 1,
    attr3Default = "",
    attr4Name = "Style",
    style = "",
    attr4Visible = 0,
    attr4Global = 1,
    attr4Default = "",
    attr5Name = "Movement",
    movement = "",
    attr5Visible = 0,
    attr5Global = 1,
    attr5Default = "",
    attr6Name = "PriceRange",
    priceRange = "",
    attr6Visible = 0,
    attr6Global = 1,
    attr6Default = "",
    attr7Name = "Gender",
    gender = "",
    attr7Visible = 0,
    attr7Global = 1,
    attr7Default = "",
    attr8Name = "Band Type",
    bandType = "",
    attr8Visible = 0,
    attr8Global = 1,
    attr8Default = "",
    attr9Name = "Collection",
    collection = "",
    attr9Visible = 0,
    attr9Global = 1,
    att9Default = "",
  } = data;
  const mapping = `@${type}@${sku}@${productName}@${published}@"${isFeatured}"@"${visibileInCatelog}"@"${shortDescription}"@"${description}"@"${dateSalePriceStarts}"@"${dateSalePriceEnds}"@"${taxStatus}"@"${taxClass}"@"${inStock}"@${stock}@"${lowStockAmount}"@"${backOrdersAllowed}"@"${soldIndividually}"@"${weight}"@"${length}"@"${width}"@"${height}"@"${allowCustomerReviews}"@"${purchaseNote}"@"${salePrice}"@"${regularPrice}"@${categories}@${tags}@"${shippingClass}"@"${images}"@"${downloadLimit}"@"${downloadExpiryDays}"@${parent}@"${groupedProducts}"@${upSells}@${crossSells}@"${externalUrl}"@"${buttonText}"@${position}@"${attr1Name}"@"${brand}"@"${attr1Visible}"@"${attr1Global}"@"${attr1Default}"@"${attr2Name}"@"${caseSize}"@"${attr2Visible}"@"${attr2Global}"@"${attr2Default}"@"${attr3Name}"@"${caseShape}"@"${attr3Visible}"@"${attr3Global}"@"${attr3Default}"@"${attr4Name}"@"${style}"@"${attr4Visible}"@"${attr4Global}"@"${attr4Default}"@"${attr5Name}"@"${movement}"@"${attr5Visible}"@"${attr5Global}"@"${attr5Default}"@"${attr6Name}"@"${priceRange}"@"${attr6Visible}"@"${attr6Global}"@"${attr6Default}"@"${attr7Name}"@"${gender}"@"${attr7Visible}"@"${attr7Global}"@"${attr7Default}"@"${attr8Name}"@"${bandType}"@"${attr8Visible}"@"${attr8Global}"@"${attr8Default}"@"${attr9Name}"@"${collection}"@"${attr9Visible}"@"${attr9Global}"@"${att9Default}" \n`;
  const result = `${header}\n${mapping}`;
  return result;
}
function createMoreInfo(data, header) {
  let text = `<h3 style="margin:0">${header}</h3><ul>`;
  for (const el of data) {
    text += `<li>${el.key} <span>:&nbsp;</span><span>${el.value}</span></li>`;
  }
  text += `</ul>`;
  return text;
}
function convertData(data) {
  return {
    sku: data.sku,
    productName: data.productName,
    regularPrice: data.regularPrice,
    salePrice: data.regularPrice === data.salePrice ? "" : data.salePrice,
    description: `${data.description}${createMoreInfo(
      data.moreInfo,
      "Thông tin sản phẩm"
    )}${data.style ? createMoreInfo(data.style, "Model") : ""}`,
    categories: data.categories,
    images: data.images,
  };
}
function writeToTxt(text) {
  fs.writeFileSync("testskus.txt", text, "utf8");
}

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 720 });
  const baseURL =
    "https://tiki.vn/op-lung-iphone-13-pro-leather-case-with-magsafe-dark-cherry-hang-chinh-hang-mm1a3fe-a-p176060167.html";
  await page.goto(baseURL, {
    waitUntil: "networkidle2",
  });
  let sku = baseURL.split("-");
  sku = sku[sku.length - 1].split(".")[0];
  const productInfo = await page.evaluate((sku) => {
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
    // Images of Product
    const images = [...document.querySelectorAll(".review-images__list  img")]
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
      [...document.querySelectorAll(".left .group .content:nth-child(2) p ")]
        .map((el) => el.innerText)
        .join("") || "";
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
      sku: sku,
      productName,
      regularPrice,
      salePrice,
      moreInfo,
      description,
      categories,
      images,
      style,
    };
  }, sku);
  writeToTxt(mapping(convertData(productInfo)));
})();
