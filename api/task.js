import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, UpdateCommand, PutCommand, DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import moment from "moment";

const client = new DynamoDBClient({region: "us-east-2"});
const docClient = DynamoDBDocumentClient.from(client);

export const fetchList = async (id) => {
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

export const fetchAlbums = async (id) => {
    const command = new QueryCommand({
        ExpressionAttributeNames: {"#name": "name"},
        ProjectionExpression: "id, #name, listened, image",
        TableName: "Albums",
        IndexName: "listened-id-index",  
        KeyConditionExpression: "listened = :falseVal",
        FilterExpression: "userId = :id",
        ExpressionAttributeValues: {
            ":falseVal": 0,
            ":id": id
        },
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


export const createAlbums = async ({name, listened, image, userId}) => {
    const uuid = crypto.randomUUID()
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss'); 

    const command = new PutCommand({
        TableName: "Albums",
        Item: { id: uuid, name, listened, image, userId, createdAt}
    });

    const response = await docClient.send(command)

    return response
}

// The condition expression is what enforces ownership: the write only lands if the
// stored album already belongs to userId, so a caller cannot touch someone else's row.
export const updateAlbums = async ({id, name, listened, userId}) => {
    const command = new UpdateCommand({
        TableName: "Albums",
        Key: {
            id
        },
        ExpressionAttributeNames: {
            "#name": "name"
        },
        UpdateExpression: "set #name = :n, listened = :c",
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":n": name,
            ":c": listened,
            ":userId": userId
        },
        ReturnValues: "ALL_NEW"
    })

    const response = await docClient.send(command)

    return response
}

export const deleteAlbums = async (id, userId) => {
    const command = new DeleteCommand({
        TableName: "Albums",
        Key: {
            id
        },
        ConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": userId
        },
    });

    const response = await docClient.send(command)

    return response
}
