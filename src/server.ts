import serverless from "serverless-http";
import { App } from "./app";
import { AuthRoute } from "./routes/auth/auth.route";
import { ProjectRoute } from "./routes/project/project.routes";
import { ValidateEnv } from "./utils/validateEnv";
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { EmployeeRoute } from "./routes/employee/employee.routes";
import { TaskRoute } from "./routes/task/task.routes";
import { LeaveRoute } from "./routes/leave/leave.route";
import { NotificationRoute } from "./routes/notification/notification.routes";

ValidateEnv();

const app = new App([
  new AuthRoute(),
  new ProjectRoute(),
  new EmployeeRoute(),
  new TaskRoute(),
  new NotificationRoute(),
  new LeaveRoute()
]);

app.listen();
