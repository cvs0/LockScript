"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogLevels = exports.setLogLevel = exports.logger = void 0;
const logger = require("loglevel");
exports.logger = logger;
exports.setLogLevel = logger.setLevel;
exports.LogLevels = logger.levels;
logger.setDefaultLevel(exports.LogLevels.WARN);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nU2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbG9nU2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRTFCLHdCQUFNO0FBRUYsUUFBQSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztBQUM5QixRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ3ZDLE1BQU0sQ0FBQyxlQUFlLENBQUMsaUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyJ9