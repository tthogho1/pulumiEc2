import * as aws from "@pulumi/aws";

export class AwsConfig {

   //public config:{accessKeyId:string, secretAccessKey:string, region:string}
    constructor() {
     /*   this.config = {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
            region: process.env.AWS_REGION as string
        }; */

    }

    private async consoleSubnet(subnetId:string):Promise<void>{
        const subnet=await aws.ec2.getSubnet({id:subnetId});
    
        console.log("Existing Subnet:");
        console.log(` subnetID: ${subnet.id}`);
        console.log(` CIDR: ${subnet.cidrBlock}`);
        console.log(` Name: ${subnet.tags.Name}`);
        console.log(` VPC: ${subnet.vpcId}`);	
    
        // Get the VPC
        console.log("VPC INFO:");
        const vpc=await this.consoleVpc(subnet.vpcId);
    }

    async consoleVpc(vpcid:string):Promise<void>{
        const vpc= await aws.ec2.getVpc({id:vpcid});
        console.log(` ID: ${vpc.id}`);
        console.log(` CIDR: ${vpc.cidrBlock}`);
        console.log(` Name: ${vpc.tags.Name}`);
    }

    private consoleVpcs(ids:string[]):void{
        ids.forEach(vpcid => {
                //console.log(` ID: ${id}`);
                this.consoleVpc(vpcid);
            }
        );
    }

    private consoleSubnets(ids:string[]):void{
        ids.forEach(subnetId => {
                //console.log(` ID: ${id}`);
                this.consoleSubnet(subnetId);
            }
        );
    }

    public async getVpcsInfo() :Promise<void>{
        const vpcs = await aws.ec2.getVpcs({});
        console.log("Existing VPCs:");
        this.consoleVpcs(vpcs.ids);

        console.log(vpcs.tags);
    }

    public async getSubnetsInfo() :Promise<void>{
        const subnets=await aws.ec2.getSubnets({});
        console.log("Existing Subnets:");
        this.consoleSubnets(subnets.ids);
        console.log(subnets.tags);
    }
}