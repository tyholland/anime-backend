const axios = require('axios').default;
const { removeBadCoupons } = require('./deleteCoupons');

const removeGrouponCoupons = (codes) => {
  if (!codes) {
    return [];
  }

  const arr = [];

  codes.forEach((item) => {
    if (item && item.isEligible) {
      arr.push(item);
    }
  });

  return arr;
};

// const fetchData = async (api) => {
//   const config = {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Access-Control-Allow-Origin': '*',
//     },
//   };

//   const response = await fetch(api, config);

//   return response.json();
// };

// const fetchCouponCode = async (coupon, dealId, couponId) => {
//   try {
//     const result = await fetchData(
//       `${GROUPON_URL}${dealId}/options?couponuuid=${couponId}`
//     );
//     coupon.code = result.code;
//     coupon.hasCode = true;
//     coupon.ranking = 'Popular';

//     return coupon;
//   } catch (err) {
//     console.log('Coupon Code Error: ', err);
//     return coupon;
//   }
// };

// const fetchCoupons = async (dealId) => {
//   try {
//     const result = await fetchData(`${GROUPON_URL}${dealId}`);
//     const couponType = JSON.parse(result.descriptor);
//     const date = new Date(result.options[0].expiresAt);
//     const coupon = {
//       title: result.title,
//       endDate: `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`,
//       isEligible: checkExpDate(result.options[0].expiresAt) !== 'Expired',
//       type: couponType.type,
//     };

//     if (couponType.type === 'discountCode') {
//       const param = new URLSearchParams(
//         result.options[0].externalUrl.split('?')[1]
//       );
//       const couponId = param.get('optionUuid');

//       return fetchCouponCode(coupon, dealId, couponId);
//     }
//   } catch (err) {
//     console.log('Coupon Error: ', err);
//     return [];
//   }
// };

const oldCouponScrap = async (store) => {
  const api =
    'https://rcsnjttpht-1.algolianet.com/1/indexes/genie-merchants-prod/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1&x-algolia-application-id=RCSNJTTPHT&x-algolia-api-key=8f3ad263ad39d0424faceec47098980e';

  const body = {
    params: `query=&filters=domain%3A${store}&distinct=true`,
  };

  const config = {
    method: 'post',
    url: api,
    data: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  };

  try {
    const result = await axios(config);
    const coupons = [];

    if (result?.data.hits) {
      const couponHit = result.data.hits;

      if (couponHit.length > 0) {
        const codes = removeBadCoupons(couponHit[0].codes);

        codes.forEach((item) => {
          const date = new Date(item.endDate);

          coupons.push({
            title: item.title,
            endDate: `${
              date.getMonth() + 1
            }-${date.getDate()}-${date.getFullYear()}`,
            isEligible: true,
            type: 'discountCode',
            code: item.code,
            hasCode: true,
            ranking: item.ranking,
          });
        });
      }
    }

    return coupons;
  } catch {
    return [];
  }
};

module.exports.fetchItems = async ($, res, next, site) => {
  const couponArr = [];

  // $('#pull-results figure[class~="is-core-coupon"]').each((index, result) => {
  //   const coupon = fetchCoupons(
  //     $(result).attr('data-bhc').replace(/deal:/gi, '')
  //   );

  //   couponArr.push(coupon);
  // });

  try {
    const oldApi = await oldCouponScrap(site);

    if (oldApi.length > 0) {
      oldApi.forEach((item) => {
        couponArr.push(item);
      });
    }

    Promise.all(couponArr)
      .then((result) => {
        const coupons = {
          notRecommended: false,
          couponCount: 0,
        };

        if (result.length > 0) {
          const codes = removeGrouponCoupons(result);

          coupons.couponCount = codes.length;
          coupons.codes = codes;
        }

        res.status(200).send(coupons);
        return next();
      })
      .catch((err) => {
        console.log('Fetch Items Error: ', err);
        return next();
      });
  } catch {
    console.log('Fetch Items Error');
    return next();
  }
};
