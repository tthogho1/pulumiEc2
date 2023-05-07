import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { AwsConfig } from "./AwsConfig";

//
// Create a security group
//
const testSecGroup = new aws.ec2.SecurityGroup("testSecGroup", {
    vpcId: "<vpc-id>",
    ingress: [
        {
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
            cidrBlocks: ["0.0.0.0/0"],
        },
        {
            protocol: "tcp",
            fromPort: 3000,
            toPort: 3000,
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
	egress: [
		{
			protocol: "-1",
			fromPort: 0,
			toPort: 0,
			cidrBlocks: ["0.0.0.0/0"],	
		}
	],
    tags: {
        Name: "makuhari,test",
    },
});
//
// Create keypair
//
const myKeyPair = new aws.ec2.KeyPair("testkeypair", {
    publicKey: "<public-key>",
});
//
// Create a new EC2 instance
//
const myInstance = new aws.ec2.Instance("test-instance", {
    instanceType: "t2.micro",:
    ami: "ami-078296f82eb463377",
    vpcSecurityGroupIds: [testSecGroup.id],
    subnetId: "<subnetId>",
    keyName: myKeyPair.id,
	associatePublicIpAddress: true,
});

var awsConfig = new AwsConfig();
//awsConfig.getVpcsInfo();
//awsConfig.getSubnetsInfo();
//getSubnets();
//myKeyPair();
