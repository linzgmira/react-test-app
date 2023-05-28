import {CertProvider} from "@linz/cert-provider";
import {AwsEnv} from "@linz/accounts";
import {CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import { Construct } from "constructs";

export interface SupportStackProps extends StackProps {
    certDomain: string
    environmentType: AwsEnv
}

export class SupportStack extends Stack {
    constructor(scope: Construct, id: string, props: SupportStackProps) {
        super(scope, id, props);
        const certProvider = new CertProvider(this, `${props.environmentType}-reacttest-app-certificate`, {
            certDomain: `${props.certDomain}`,
        });

        new CfnOutput(this, 'CertificateArn', {
            value: certProvider.certificateArn,
            exportName: `${props.environmentType}-reacttest-app-certificate-arn`,
        });
    }
}
