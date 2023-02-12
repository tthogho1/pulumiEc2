import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// List all existing VPCs
//const vpcs = aws.ec2.getVpcs({}).then(
// vpcs => {
// 	console.log("test " + vpcs.id);
// }
//);

function consoleIds(ids:string[]){
	ids.forEach(id => {
			console.log(` ID: ${id}`);	
		}
	);
}

async function  consoleVpc(vpcid:string){
	const vpc= await aws.ec2.getVpc({id:vpcid});
	console.log(` ID: ${vpc.id}`);
	console.log(` CIDR: ${vpc.cidrBlock}`);
	console.log(` Name: ${vpc.tags.Name}`);
}

async function consoleSubnet(subnetId:string){
	const subnet=await aws.ec2.getSubnet({id:subnetId});

	console.log("Existing Subnet:");
	console.log(` subnetID: ${subnet.id}`);
	console.log(` CIDR: ${subnet.cidrBlock}`);
	console.log(` Name: ${subnet.tags.Name}`);
	console.log(` VPC: ${subnet.vpcId}`);	

	// Get the VPC
	console.log("VPC INFO:");
	const vpc=consoleVpc(subnet.vpcId);
}

function consoleSubnets(ids:string[]){
	ids.forEach(subnetId => {
			//console.log(` ID: ${id}`);
			consoleSubnet(subnetId);
		}
	);
}

function consoleVpcs(ids:string[]){
	ids.forEach(vpcid => {
			//console.log(` ID: ${id}`);
			consoleVpc(vpcid);
		}
	);
}

const getVpcs = async function(){
	const vpcs=await aws.ec2.getVpcs({});
	console.log("Existing VPCs:");
	consoleVpcs(vpcs.ids);
	
	console.log(vpcs.tags);
}

const getSubnets = async function(){
	const subnets=await aws.ec2.getSubnets({});
	console.log("Existing Subnets:");
	consoleSubnets(subnets.ids);
	console.log(subnets.tags);
}

// Create a security group
const enjobSecGroup = new aws.ec2.SecurityGroup("enjobSecGroup", {
    vpcId: "vpc-0a64cfcc90f0c20ce",
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
    tags: {
        Name: "makuhari,enjob",
    },
});

const myKeyPair = new aws.ec2.KeyPair("dicsenjobkeypair", {
    keyName: "dicsenjobkeypair",
    publicKey: "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDEGCbIteeHT4Nu9RpkwKwy0rjTwf1GLkWgpe8JF1JjMd4dotAqrOT+mgjDykBMG0z0ZW8IbDRW90IiqTXH7S8AF2yUKDIdNzHjIG89fC/xdRBwfhVZCyLdWg1cKU6Sp2FMDl49q+X35+GTT3ZVEnPkrwjIebqKorO1Kj7TQVYDsmRhxv36fifSs+WPZAXsq0pYg1gmSPgdbVziTj5tYDjbMWNOOcex8jk79ToUF/ApwxmXPqakDYXmw8YJyGVI1G9pXtNd4pPDgj7D7y63tdUKrEPJjR9OXOYESxb3PDCsKav1srtP2QXC1f+50caFDLLaEGnisY1utfBjhDTh5tjb",
});

// Create a new EC2 instance
const myInstance = new aws.ec2.Instance("enjob-instance", {
    instanceType: "t2.micro",
    ami: "ami-078296f82eb463377",
    vpcSecurityGroupIds: [enjobSecGroup.id],
    subnetId: "subnet-05f2a9a81d40d433d",
    keyName: "dicsenjobkeypair",
});

//getVpcs();
//getSubnets();
//myKeyPair();


//const vpc = aws.ec2.getVpc({id: "vpc-0e1c9d6b1f2b2c3d4"});