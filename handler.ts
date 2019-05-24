import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import "source-map-support/register";

const cleanUrlQueries = (url: string): string => {
  const index = url.indexOf("?");
  if (index === -1) {
    return url;
  }
  return url.slice(0, index);
};

const makeBody = (str: object) => JSON.stringify(str, null, 2);

const lewd: APIGatewayProxyResult = {
  statusCode: 403,
  body: makeBody({
    reason: `Lewd!`
  })
};

export const forwardWebhook: APIGatewayProxyHandler = async (
  { body },
) => {
  const { to, url } = JSON.parse(body);
  const cleanUrl = cleanUrlQueries(url);

  const metadataUrl = `${cleanUrl}/about.json`;
  const meta = await axios.get(metadataUrl).then(r => r.data);

  if (meta.over_18) {
    return lewd;
  }

  await axios.post(to, {});
  return {
    statusCode: 200,
    body: makeBody({
      reason: `Testing`
    })
  };
};
