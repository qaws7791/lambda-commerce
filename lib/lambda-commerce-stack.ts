import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class LambdaCommerceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const fn = new NodejsFunction(this, "lambda", {
      entry: "lambda/index.ts",
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: {
        JWT_SECRET: this.node.tryGetContext("JWT_SECRET"),
        DATABASE_URL: this.node.tryGetContext("DATABASE_URL"),
        DATABASE_TOKEN: this.node.tryGetContext("DATABASE_TOKEN"),
      },
      memorySize: 512,
      timeout: cdk.Duration.seconds(15),
    });
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });
    new apigw.LambdaRestApi(this, "myapi", {
      handler: fn,
    });
  }
}
