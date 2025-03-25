import { App } from "./app";
import { Timesheet } from "./models/project/timesheet.model";
import { AuthRoute } from "./routes/auth/auth.route";
import { ProfileRoute } from "./routes/profile/profile.routes";
import { ProjectRoute } from "./routes/project/project.routes";
import { TimesheetRoute } from "./routes/project/timesheet.routes";
import { ValidateEnv } from "./utils/validateEnv";

ValidateEnv();

const app = new App([new AuthRoute, new ProjectRoute, new ProfileRoute,new TimesheetRoute]);

app.listen();