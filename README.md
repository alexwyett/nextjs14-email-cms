# NEXT.js 14+ static website with email (yes email!) controlled content.

Preview: [https://nextjs14-email-cms.vercel.app/](https://nextjs14-email-cms.vercel.app/)

This is a personal project base which I use for simple static sites that require minimal content control.  Instead of relying on a server, this method allows editors to send emails to a specific address (via https://proxiedmail.com/), the website then parses the email body as [markdown](https://www.markdownguide.org/) to use as articles or pages within the site. 

## Pre-requisites

You will need the following to run this project:
- An AWS key/secret for accessing S3 via the javascript sdk.
- An AWS bucket
- An email address
- A proxiedmail.com account

Before running, the following `.env` file should be added to the project root.

```
S3_SECRET_KEY=
S3_ACCESS_KEY=
S3_BUCKET_NAME=
S3_REGION=
S3_BASE_URL=https://BUCKET.s3.REGION.amazonaws.com/
EDITORS=youremailaddress@something.com,anotheremail@something.com
BASE_URL=http://localhost:3000/
```

Once complete, run `npm install && npm run dev` to start.

When the site is running, you will need to add a webhook into your proxiedmail.com account (https://proxiedmail.com/en/webhook-on-email) pointing at `YOURDOMAIN.com/update`.  Any emails you send to that address will now start creating content.
