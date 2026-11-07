
exports.handler = async (event) => {
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: "Method not allowed" })
    };
  }

  const apiKey = process.env.CJ_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "CJ_API_KEY is missing from Netlify environment variables."
      })
    };
  }

  try {
    const response = await fetch(
      "https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ apiKey })
      }
    );

    const result = await response.json();

    if (
      !response.ok ||
      !result.success ||
      !result.data?.accessToken
    ) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          success: false,
          message: result.message || "CJ authentication failed",
          code: result.code || null,
          requestId: result.requestId || null
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "CJ authentication successful!",
        openId: result.data.openId,
        accessTokenExpiryDate:
          result.data.accessTokenExpiryDate,
        refreshTokenExpiryDate:
          result.data.refreshTokenExpiryDate,
        tokenReceived: true,
        tokenExposed: false
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: "Unable to connect to CJ Dropshipping."
      })
    };
  }
};
