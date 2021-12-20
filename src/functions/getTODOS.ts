import { APIGatewayProxyHandler } from "aws-lambda";

import { document } from "../helpers/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event) => {
  const { userid } = event.pathParameters;

  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "user_id = :user_id",
    ExpressionAttributeValues: {
      ":user_id": userid,
    },
  }).promise();

  const todos = response.Items;

  if (!todos) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Not found",
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Success",
      todo: todos,
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }
}