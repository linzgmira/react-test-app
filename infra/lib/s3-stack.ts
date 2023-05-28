import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';

export class S3Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an S3 bucket
    const bucket = new Bucket(this, 'nonprod-enablement-create-s3', {
      bucketName: 'nonprod-test-gm-28052023', // Replace with your desired bucket name
      //removalPolicy: cdk.RemovalPolicy.DESTROY, // Optional: Change the removal policy as needed
    });

    // Output the bucket URL
    new cdk.CfnOutput(this, 'S3BucketURL', {
      value: bucket.bucketWebsiteUrl || '', // Output the bucket's website URL
    });
  }
}

// // Create an instance of the CDK app
// const app = new cdk.App();

// // Create a stack for your S3 bucket
// new MyS3Stack(app, 'MyS3Stack');

// // Synthesize the CDK app into a CloudFormation template
// app.synth();
