import serverless from "serverless-http";
import { App } from "./app";
import { AuthRoute } from "./routes/auth/auth.route";
import { ProfileRoute } from "./routes/profile/profile.routes";
import { ProjectRoute } from "./routes/project/project.routes";
import { TimesheetRoute } from "./routes/project/timesheet.routes";
import { ValidateEnv } from "./utils/validateEnv";


ValidateEnv();


const app = new App([new AuthRoute(), new ProjectRoute(), new ProfileRoute(), new TimesheetRoute()]);


const serverlessApp = serverless(app.getServer());
app.listen();

// export const handler = async (event: any, context: any) => {
//     if (event.action === "run") {
//         return {
//             statusCode: 200,
//             body: JSON.stringify({ message: "Lambda is running successfully. Thank you" }),
//         };
//     } else {
//         return serverlessApp(event, context);
//     }
// };
