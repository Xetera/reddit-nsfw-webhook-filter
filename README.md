# Reddit NSFW Webhook Filter

Tired of your IFTTT Reddit webhook sending lewd content in your server? Route your reddit webhooks through here to drop the ones marked as NSFW.

### Steps for setting up the webhook server
1. None, it's all set up for you already! Target https://webhook.hifumi.io with your webhook requests.

### Configuring with IFTTT
1. Set your target url to https://webhook.hifumi.io
2. Set your method to POST
3. Content type should be `application/json`
4. Fill in the body
```json
{
  "to": "your-actual-webhook-url-here",
  "url": "{{PostURL}}"
}
```

Your final screen should look like this

![](https://i.love.miki.ai/%F0%9F%98%8B%F0%9F%A4%B2%F0%9F%91%AA%E2%9C%8D%F0%9F%91%84%F0%9F%98%9A.png)

**Note:** This currently only supports discord embed format. Customizable post body will be added later.
