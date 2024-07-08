const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const instanceId = process.env.INSTANCE_ID;
      const params = {
        InstanceIds: [instanceId],
        Action: 'START',
      };

      try {
        await ec2.startInstances(params).promise();
        console.log('EC2 start success:', params);
      } catch (error) {
        console.error('EC2 start error:', error);
      }
    }
  }
};
