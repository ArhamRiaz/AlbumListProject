import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, UpdateCommand, PutCommand, DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto"

const client = new DynamoDBClient({region: "us-east-2"});
const docClient = DynamoDBDocumentClient.from(client);

export const fetchList = async (id) => {
    console.log("TASK.JS: " + id)
    const command = new QueryCommand({
        ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "id, #name, listened, image",
        TableName: "Albums",
        IndexName: "listened-id-index",  
        KeyConditionExpression: "listened = :trueVal",
        FilterExpression: "userId = :id",
        ExpressionAttributeValues: {
            ":trueVal": 1,
            ":id": id,
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

export const fetchUsers = async () => {
    const command = new ScanCommand({
        //ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "clientId",
        TableName: "Users", 


    });

    const response = await docClient.send(command);

    return response;
}

export const getUser = async ({id}) => {
    const command = new QueryCommand({
        ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "clientId, #name, email",
        TableName: "Users",
        KeyConditionExpression: "clientId = :clientId",
        ExpressionAttributeValues: {
            ":clientId": id
        },
    });

    const response = await docClient.send(command);

    return response;
}

export const createUser = async ({clientId, email, name}) => {
    const uuid = crypto.randomUUID()
    const command = new PutCommand({
        TableName: "Users",
        Item: { clientId: clientId, name, email}
    });

    const response = await docClient.send(command)

    return response
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
