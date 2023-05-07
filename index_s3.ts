import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// https://www.pulumi.com/registry/packages/aws/api-docs/s3/
const bucket = new aws.s3.BucketV2("my-bucket", {});
//
//
const BucketOwnershipControls = new aws.s3.BucketOwnershipControls("BucketOwnershipControls", {
    bucket: bucket.id,
    rule: {
        objectOwnership: "BucketOwnerPreferred",
    },
});
//
//
const BucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock("BucketPublicAccessBlock", {
    bucket: bucket.id,
    blockPublicAcls: false,
    blockPublicPolicy: false,
    ignorePublicAcls: false,
    restrictPublicBuckets: false,
});
//
//
const BucketAclV2 = new aws.s3.BucketAclV2("BucketAclV2", {
    bucket: bucket.id,
    acl: "public-read",
}, {
    dependsOn: [
        BucketOwnershipControls,
        BucketPublicAccessBlock,
    ],
});


//    acl: "public-read",
const bucketObject = new aws.s3.BucketObject("facades.tar.gz", {
    contentType: "application/octet-stream",
    bucket: bucket.id,
    source: new pulumi.asset.FileAsset("facades.tar.gz")
});


const allowAccessFromAnotherAccountPolicyDocument = aws.iam.getPolicyDocumentOutput({
    statements: [
            {
                actions: [
                    "s3:GetObject"
                ],
                resources: [
                    bucket.arn,
                ]
            }
        ]
});

const allowAccessFromAnotherAccountBucketPolicy = new aws.s3.BucketPolicy("allowAccessFromAnotherAccountBucketPolicy", {
    bucket: bucket.id,
    policy: allowAccessFromAnotherAccountPolicyDocument.apply(allowAccessFromAnotherAccountPolicyDocument => allowAccessFromAnotherAccountPolicyDocument.json),
});


// Export the name of the bucket
export const bucketEndpoint = pulumi.interpolate`http://${bucket.websiteEndpoint}`;