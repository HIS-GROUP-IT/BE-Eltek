import serverless from "serverless-http";
import { App } from "./app";
import { AuthRoute } from "./routes/auth/auth.route";
import { ProjectRoute } from "./routes/project/project.routes";
import { ValidateEnv } from "./utils/validateEnv";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { EmployeeRoute } from "./routes/employee/employee.routes";
import { TaskRoute } from "./routes/project/task.routes";
import { LeaveRoute } from "./routes/leave/leave.route";

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new ProjectRoute(),
  new EmployeeRoute(),
  new TaskRoute(),
  new LeaveRoute()
]);

app.listen();

// const serverlessApp = serverless(app.getServer());
// const CORS_HEADERS = {
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
//   "Access-Control-Allow-Credentials": "true"
// };

// export const handler = async (
//   event: APIGatewayProxyEvent,
//   context: Context
// ): Promise<APIGatewayProxyResult> => {
//   try {
//     if (event.httpMethod === "OPTIONS") {
//       return {
//         statusCode: 204,
//         headers: CORS_HEADERS,
//         body: "",
//         isBase64Encoded: false
//       };
//     }

//     const response = await serverlessApp(event, context) as APIGatewayProxyResult;

//     return {
//       statusCode: response.statusCode || 200,
//       headers: {
//         ...CORS_HEADERS,
//         ...response.headers
//       },
//       body: response.body,
//       isBase64Encoded: false
//     };
    
//   } catch (error) {
//     console.error("Error:", error);
//     return {
//       statusCode: 500,
//       headers: {
//         ...CORS_HEADERS,
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ message: "Internal Server Error" }),
//       isBase64Encoded: false
//     };
//   }
// };