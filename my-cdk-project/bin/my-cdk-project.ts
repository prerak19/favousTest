#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { MyCdkProjectStack } from '../lib/my-cdk-project-stack';

const app = new cdk.App();

new MyCdkProjectStack(app, 'MyCdkProjectStack', {
  env: {
    account: '533352177208',
    region: 'us-east-1',
  },
});
