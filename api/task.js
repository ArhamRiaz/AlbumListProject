import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, UpdateCommand, PutCommand, DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto"

const client = new DynamoDBClient({region: "us-east-2"});
const docClient = DynamoDBDocumentClient.from(client);

export const fetchList = async () => {
    const command = new QueryCommand({
        ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "id, #name, listened, image",
        TableName: "Albums",
        IndexName: "listened-id-index",  
        KeyConditionExpression: "listened = :trueVal",
        ExpressionAttributeValues: {
            ":trueVal": 1 
        },
    });

    const response = await docClient.send(command);

    return response;
}

export const fetchAlbums = async () => {
    const command = new QueryCommand({
        ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "id, #name, listened, image",
        TableName: "Albums",
        IndexName: "listened-id-index",  
        KeyConditionExpression: "listened = :falseVal",
        ExpressionAttributeValues: {
            ":falseVal": 0 
        },
    });

    console.log("command: " + command)
    const response = await docClient.send(command);

    return response;
}

export const createAlbums = async ({name, listened, image}) => {
    const uuid = crypto.randomUUID()
    const command = new PutCommand({
        TableName: "Albums",
        Item: { id: uuid, name, listened, image}
    });

    const response = await docClient.send(command)

    return response
}

export const updateAlbums = async ({id, name, listened}) => {
    const command = new UpdateCommand({
        TableName: "Albums",
        Key: {
            id
        },
        ExpressionAttributeNames: {
            "#name": "name"
        },
        UpdateExpression: "set #name = :n, listened = :c",
        ExpressionAttributeValues: {
            ":n": name,
            ":c": listened
        },
        ReturnValues: "ALL_NEW"
    })

    const response = await docClient.send(command)

    return response
}

export const deleteAlbums = async (id) => {
    console.log("id in task.js: " + id)
    const command = new DeleteCommand({
        TableName: "Albums",
        Key: {
            id
        },
    });

    const response = await docClient.send(command)

    return response
}
