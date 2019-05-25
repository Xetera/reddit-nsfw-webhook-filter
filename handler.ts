import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import axios from "axios";
import "source-map-support/register";

const cleanUrlQueries = (url: string): string => url.replace(/\/?\?.*/, "");

const makeBody = (str: object) => JSON.stringify(str, null, 2);

const oops = (statusCode: number, reason: string): APIGatewayProxyResult => ({
  statusCode,
  body: makeBody({ reason })
});

const lewd = oops(403, `Lewd!`);
const is400 = (reason: string) => oops(400, reason);

export const noGet: APIGatewayProxyHandler = () => Promise.resolve({
  statusCode: 200,
  body: `You're in the right place! Make sure to do a POST request and not GET, more info at https://github.com/Xetera/reddit-nsfw-webhook-filter.`
})

export const forwardWebhook: APIGatewayProxyHandler = async ({ body }) => {
  try {
    // TODO: allow users to override the body
    console.log(body);

    const parsed = JSON.parse(body);

    if (!parsed) {
      return is400(
        `Invalid post body, https://github.com/Xetera/reddit-nsfw-webhook-filter for more info.`
      );
    }

    const { to, url } = parsed;

    if (!to || !url) {
      return is400(
        `Post body must include 'to' and 'url' fields, https://github.com/Xetera/reddit-nsfw-webhook-filter for more info.`
      );
    }

    const cleanUrl = cleanUrlQueries(url);

    const metadataUrl = `${cleanUrl}/about.json`;

    const meta = await axios.get(metadataUrl).then(r => r.data);
    const { data } = meta[0].data.children[0];

    if (data.over_18) {
      return lewd;
    }

    try {
      const payload = JSON.stringify({
        embeds: [
          {
            title: data.title,
            url: `https://reddit.com${data.permalink}`,
            description: `**Author:** /u/${data.author}`,
            image: {
              url: data.url
            }
          }
        ]
      });

      await axios.post(to, payload, {
        headers: {
          'Content-Type': "application/json"
        }
      });

      return {
        statusCode: 200,
        body: makeBody({
          description: `Posted new image by ${data.author}`
        })
      };
    } catch (err) {
      console.error(err)
      return oops(500, err);
    }
  } catch (error) {
    console.error(error)
    return oops(500, error);
  }
};
