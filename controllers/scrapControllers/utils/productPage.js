/* eslint-disable no-useless-escape */

module.exports.macysProduct = ($) => {
  let price;
  let sale;

  if ($('body').find('.on-sale').length > 0) {
    sale = $('.on-sale').text().trim();
    sale = sale.substring(6, 11);
  } else {
    price = $('.price').text().trim();
    price = price.substring(1);
  }

  const name = $('.p-name.h3').first().text().trim();
  const image = $('.alt-img__image img').first().attr('src');

  return {
    sale: sale,
    price: price,
    name: name,
    image: image,
  };
};

module.exports.amazonProduct = ($) => {
  const p1 = $('#priceblock_saleprice');
  const p2 = $('#priceblock_ourprice');
  const p3 = $('#price');
  const p4 = $('#price_inside_buybox');

  const sale = p1 ? p1.text().replace(/\n|\$/gi, '') : null;
  const price = p2
    ? p2.text().split('-').length > 1
      ? p2.text().split('-')[1].replace(/\n|\$/gi, '')
      : p2.text().replace(/\n|\$/gi, '')
    : null;
  const boxPrice = p3 ? p3.text().replace(/\n|\$/gi, '') : null;
  const boxPrice2 = p4 ? p4.text().replace(/\n|\$/gi, '') : null;
  const name = $('#productTitle').text().replace(/\n/gi, '');
  const image = $('.a-button-text img').attr('src').replace(/\n/gi, '');

  return {
    sale: sale,
    price: price,
    price2: boxPrice,
    price3: boxPrice2,
    name: name,
    image: image,
  };
};

module.exports.ikeaProduct = ($) => {
  const price = $(
    '.range-revamp-product__buy-module-container .range-revamp-price'
  )
    .text()
    .replace(/\$|\,/gi, '');
  const name = $('.range-revamp-header-section__title--big').text();
  const image = $(
    '.range-revamp-product__left-top .range-revamp-aspect-ratio-image__image'
  ).attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.sephoraProduct = ($) => {
  const price = $('p[data-comp="Price "] > span > span > b:first-child')
    .text()
    .replace(/\$|\,/gi, '');
  const name = $('h1[data-comp] a').text();
  const image = $('button > div > picture:first-child img').attr('src');

  return {
    price: price,
    name: name,
    image: `https://sephora.com${image}`,
  };
};

module.exports.chewyProduct = ($) => {
  const price = $('.product-pricing .ga-eec__price')
    .text()
    .replace(/\n|\$/gi, '')
    .trim();
  const name = $('#product-title h1').text().replace(/\n/gi, '').trim();
  const image = $('a[id="Zoomer"]').attr('href').replace(/\/\//gi, '');

  return {
    price: price,
    name: name,
    image: `https://${image}`,
  };
};

module.exports.cvsProduct = ($) => {
  const price = $('.css-16my406').text();
  const name = $('.css-1dbjc4n.r-1pi2tsx').first().attr('aria-label');
  const image = $('img[alt="image 1 of 5"]').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.instacartProduct = ($) => {
  let price = $('.rmq-3a58a5fe > div > div').first().text();
  price = price.substring(1);
  const name = $('.rmq-16d35361')
    .attr('aria-label')
    .split('Decrement quantity of')[1];
  const image = $('.css-1u7uhqd').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.ultaProduct = ($) => {
  const price = $('.ProductPricingPanel span')
    .first()
    .text()
    .replace(/Price|\$/gi, '');
  const name = $('.ProductMainSection__productName').first().text();
  const image = $('.slick-slide img').first().attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.walmartProduct = ($) => {
  const price = $(
    '#price > div > span.hide-content.display-inline-block-m > span span.price-characteristic'
  ).text();
  const name = $('.prod-ProductTitle.prod-productTitle-buyBox').text();
  const image = $('.hover-zoom-hero-image').attr('src');

  return {
    price: price,
    name: name,
    image: `https://${image}`,
  };
};

module.exports.hsnProduct = ($) => {
  const sale = $('span[itemprop="maxPrice"]')
    ? $('span[itemprop="maxPrice"]').attr('content')
    : null;
  const price = $('span[itemprop="price"]')
    ? $('span[itemprop="price"]').attr('content')
    : null;
  const name = $('#product-name').text().trim();
  const videos = $('.product-videos img');
  const image =
    videos.length > 0
      ? videos.first().attr('src')
      : $('.product-image img').first().attr('src');

  return {
    sale: sale,
    price: price,
    name: name,
    image: image,
  };
};

module.exports.overstockProduct = ($) => {
  let price = $('[data-cy="product-price"]').text();
  price = price.substring(1);
  const name = $('._3Bj68d3[data-cy="product-title"]').text();
  const image = $('._1LkEpnR').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.nikeProduct = ($) => {
  let price = $('.product-price').text();
  price = price.substring(1);
  const name = $('h1#pdp_product_title').text().trim();
  const image = $('picture img').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.bestbuyProduct = ($) => {
  let price = $('.priceView-customer-price > span').first().text();
  price = price.substring(1);
  const name = $('.sku-title h1').text().trim();
  const image = $('img.primary-image').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.ebayProduct = ($) => {
  const price = $('#prcIsum').attr('content');
  const name = $('#itemTitle').text().trim();
  const image = $('#icImg').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.etsyProduct = ($) => {
  let price = $('div[data-buy-box-region="price"] p').first().text().trim();
  const priceLength = price.length;
  price = price.substring(1, priceLength - 1);
  const name = $('#listing-page-cart > div > div.wt-mb-xs-2 > div > h1')
    .text()
    .trim();
  const image = $(
    '#listing-right-column > div > div.body-wrap.wt-body-max-width.wt-display-flex-md.wt-flex-direction-column-xs > div.image-col.wt-order-xs-1.wt-mb-lg-6 > div > div > div > div > div.image-carousel-container.wt-position-relative.wt-flex-xs-6.wt-order-xs-2.show-scrollable-thumbnails > ul > li:nth-child(1) > img'
  ).attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.anthropologieProduct = ($) => {
  const sale = $('span[aria-label="product_sale-price"]')
    ? $('span[aria-label="product_sale-price"]').text().substring(1)
    : null;
  const price = $('.c-pwa-product-price__current').text().substring(1);
  const name = $('.c-pwa-product-meta-heading').text().trim();
  const image = $('.c-pwa-image-viewer__img.js-pwa-faceout-image').attr('src');

  return {
    sale: sale,
    price: price,
    name: name,
    image: image,
  };
};

module.exports.ashleyfurnitureProduct = ($) => {
  const sale = $('.sales-price')
    ? $('.sales-price').first().text().trim().substring(1)
    : null;
  const name = $('#product-content > div.product-name > h1').text().trim();
  const image = $('img[itemprop ="image"]').attr('src');

  return {
    sale: sale,
    price: null,
    name: name,
    image: image,
  };
};

module.exports.costcoProduct = ($) => {
  const price = $('meta[property="product:price:amount"]').attr('content');
  const name = $('h1[itemprop="name"]').text().trim();
  const image = $('#initialProductImage').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.samsclubProduct = ($) => {
  let price = $(
    '#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-large-desktop-layout-columns > div.sc-pc-large-desktop-layout-content > div.sc-pc-dual-price > div > span.sc-price > span'
  ).attr('title');
  price = price.split('current price: ')[1].substring(1);
  const name = $(
    '#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-title-full-desktop > h1'
  )
    .text()
    .trim();
  const image = $(
    '#main > div > div > div.sc-pc-large-desktop-product-card > div > div.sc-pc-large-desktop-layout-columns > div:nth-child(1) > div.sc-pc-image-carousel-desktop > div > div > div.sc-image-viewer-content > div.sc-image-viewer-valign-middle > button > div > img'
  ).attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.staplesProduct = ($) => {
  const price = $('.price-info__final_price').text().substring(1);
  const name = $('#product_title').text().trim();
  const image = $('.carousel__slider_content img').attr('srcset').split(' ');

  return {
    price: price,
    name: name,
    image: image[0],
  };
};

module.exports.officedepotProduct = ($) => {
  let price = $('.unified_sale_price .price_column.right').text().trim();
  price = price.substring(1);
  const name = $('#skuHeading h1').text().trim();
  const image = $('img[itemprop="image"]').attr('src');

  return {
    price: price,
    name: name,
    image: image,
  };
};

module.exports.allowedStores = [
  'ikea.com',
  'amazon.com',
  'sephora.com',
  'cvs.com',
  'instacart.com',
  'ulta.com',
  'chewy.com',
  'walmart.com',
  'hsn.com',
  'macys.com',
  'nike.com',
  'overstock.com',
  'bestbuy.com',
  'ebay.com',
  'etsy.com',
  'anthropologie.com',
  'ashleyfurniture.com',
  'costco.com',
  'samsclub.com',
  'staples.com',
  'officedepot.com',
];
