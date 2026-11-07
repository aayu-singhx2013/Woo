
exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  try {
    const apiKey = process.env.CJ_API_KEY;

    if (!apiKey) {
      throw new Error("CJ_API_KEY is missing");
    }

    // Step 1: Obtain an access token
    const authResponse = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey })
      }
    );

    const auth = await authResponse.json();

    if (!authResponse.ok || !auth.success || !auth.data?.accessToken) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message: "CJ authentication failed"
        })
      };
    }

    // Step 2: Fetch products from CJ
    const params = new URLSearchParams({
      page: "1",
      size: "10"
    });

    const productsResponse = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/listV2?${params}`,
      {
        method: "GET",
        headers: {
          "CJ-Access-Token": auth.data.accessToken
        }
      }
    );

    const result = await productsResponse.json();

    if (!productsResponse.ok || result.result !== true) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message: "Unable to fetch CJ products",
          requestId: result.requestId || null
        })
      };
    }

    const groups = result.data?.content || [];

    const products = groups.flatMap(group =>
      Array.isArray(group.productList)
        ? group.productList.map(product => ({
            id: product.id,
            name: product.nameEn,
            sku: product.sku,
            image: product.bigImage,
            price: product.sellPrice,
            discountPrice: product.nowPrice,
            inventory: product.warehouseInventoryNum,
            categoryId: product.categoryId
          }))
        : []
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        success: true,
        message: "CJ products fetched successfully",
        totalProducts: products.length,
        products
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error.message === "CJ_API_KEY is missing"
          ? error.message
          : "Product fetching failed"
      })
    };
  }
};
