import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { UpdateCommand, PutCommand, DynamoDBDocumentClient, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto"

const client = new DynamoDBClient({region: "us-east-2"});
const docClient = DynamoDBDocumentClient.from(client);

export const fetchAlbums = async () => {
    const command = new ScanCommand({
        ExpressionAttributeNames: {"name": "name"},
        ProjectionExpression: "id, #name, listened",
        TableName: "Albums",
    });

    const response = await docClient.send(command)

    return response
}

export const createAlbums = async ({name, listened}) => {
    const uuid = crypto.randomUUID()
    const command = new PutCommand({
        TableName: "Albums",
        Item: { id: uuid, name, listened}
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
    const command = new DeleteCommand({
        TableName: "Albums",
        Key: {
            id,
        },
    });

    const response = await docClient.send(command)

    return response
}
