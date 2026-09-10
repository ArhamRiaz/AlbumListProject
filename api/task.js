import { ListTablesCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  QueryCommand,
  UpdateCommand,
  PutCommand,
  DynamoDBDocumentClient,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import moment from "moment";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const client = new DynamoDBClient({ region: "us-east-2" });
const docClient = DynamoDBDocumentClient.from(client);

export const fetchList = async (id) => {
  const command = new QueryCommand({
    ExpressionAttributeNames: { "#name": "name" },
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
};

export const fetchAlbums = async (id) => {
  const command = new QueryCommand({
    ExpressionAttributeNames: { "#name": "name" },
    ProjectionExpression: "id, #name, listened, image",
    TableName: "Albums",
    IndexName: "listened-id-index",
    KeyConditionExpression: "listened = :falseVal",
    FilterExpression: "userId = :id",
    ExpressionAttributeValues: {
      ":falseVal": 0,
      ":id": id,
    },
  });
  const response = await docClient.send(command);

  return response;
};

export const getUser = async ({ id }) => {
  const command = new QueryCommand({
    ExpressionAttributeNames: { "#name": "name" },
    ProjectionExpression: "clientId, #name, email",
    TableName: "Users",
    KeyConditionExpression: "clientId = :clientId",
    ExpressionAttributeValues: {
      ":clientId": id,
    },
  });

  const response = await docClient.send(command);

  return response;
};

export const createUser = async ({ clientId, email, name }) => {
  const uuid = crypto.randomUUID();
  const command = new PutCommand({
    TableName: "Users",
    Item: { clientId: clientId, name, email },
  });

  const response = await docClient.send(command);

  return response;
};

export const createAlbums = async ({ name, listened, image, userId }) => {
  const uuid = crypto.randomUUID();
  const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

  const command = new PutCommand({
    TableName: "Albums",
    Item: { id: uuid, name, listened, image, userId, createdAt },
  });

  const response = await docClient.send(command);

  return response;
};

// The condition expression is what enforces ownership: the write only lands if the
// stored album already belongs to userId, so a caller cannot touch someone else's row.
export const updateAlbums = async ({ id, name, listened, userId }) => {
  const command = new UpdateCommand({
    TableName: "Albums",
    Key: {
      id,
    },
    ExpressionAttributeNames: {
      "#name": "name",
    },
    UpdateExpression: "set #name = :n, listened = :c",
    ConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":n": name,
      ":c": listened,
      ":userId": userId,
    },
    ReturnValues: "ALL_NEW",
  });

  const response = await docClient.send(command);

  return response;
};

export const deleteAlbums = async (id, userId) => {
  const command = new DeleteCommand({
    TableName: "Albums",
    Key: {
      id,
    },
    ConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  });

  const response = await docClient.send(command);

  return response;
};

// Turns a free-text question into a small, fixed-shape filter. The model never
// sees or writes real DynamoDB syntax — only these four whitelisted fields.
export const parseAlbumQuery = async (question) => {
  const today = moment().format("YYYY-MM-DD");

  const msg = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 200,
    system: `You convert a question about someone's personal album library into a JSON filter.
Allowed fields, all optional:
- "listened": true or false
- "createdAfter": "YYYY-MM-DD"
- "createdBefore": "YYYY-MM-DD"
- "nameContains": a short string to match against the album/artist name
Today's date is ${today}. Respond with ONLY the JSON object — no prose, no markdown fences.`,
    messages: [{ role: "user", content: question }],
  });

  const raw = msg.content.find((b) => b.type === "text")?.text ?? "{}";

  let parsed;
  try {
    parsed = JSON.parse(raw.trim());
  } catch {
    parsed = {};
  }

  // Whitelist: only these four keys survive, with type/format checks. Anything
  // else the model invents (or a prompt-injected question tries to add) is dropped here.
  const filters = {};
  if (typeof parsed.listened === "boolean") {
    filters.listened = parsed.listened;
  }
  if (
    typeof parsed.createdAfter === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(parsed.createdAfter)
  ) {
    filters.createdAfter = parsed.createdAfter;
  }
  if (
    typeof parsed.createdBefore === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(parsed.createdBefore)
  ) {
    filters.createdBefore = parsed.createdBefore;
  }
  if (typeof parsed.nameContains === "string" && parsed.nameContains.trim()) {
    filters.nameContains = parsed.nameContains.trim().slice(0, 100);
  }

  return filters;
};

// Runs the whitelisted filter against DynamoDB. userId is always applied here in
// code, never taken from the parsed filter, so this can never return another user's albums.
export const queryAlbumsNL = async (userId, filters) => {
  const filterParts = ["userId = :userId"];
  const values = { ":userId": userId };
  const names = { "#name": "name" };

  if (typeof filters.listened === "boolean") {
    filterParts.push("listened = :listened");
    values[":listened"] = filters.listened ? 1 : 0;
  }
  if (filters.createdAfter) {
    filterParts.push("createdAt >= :createdAfter");
    values[":createdAfter"] = filters.createdAfter;
  }
  if (filters.createdBefore) {
    filterParts.push("createdAt <= :createdBefore");
    values[":createdBefore"] = filters.createdBefore;
  }
  if (filters.nameContains) {
    filterParts.push("contains(#name, :nameContains)");
    values[":nameContains"] = filters.nameContains;
  }

  const command = new ScanCommand({
    TableName: "Albums",
    ProjectionExpression: "id, #name, listened, image",
    FilterExpression: filterParts.join(" AND "),
    ExpressionAttributeNames: names,
    ExpressionAttributeValues: values,
  });

  const response = await docClient.send(command);
  return response;
};
