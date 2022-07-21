import AWS from "aws-sdk";

const creds = new AWS.Credentials({
  accessKeyId: "AKIAYVA4PF4FAFHUWTWQ",
  secretAccessKey: "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",
});

AWS.config.credentials = creds;

export const db = new AWS.DynamoDB.DocumentClient({ region: "us-west-2" });
