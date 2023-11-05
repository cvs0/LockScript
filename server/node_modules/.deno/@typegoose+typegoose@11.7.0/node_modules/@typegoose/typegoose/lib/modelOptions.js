"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelOptions = exports.modelOptions = void 0;
const constants_1 = require("./internal/constants");
const utils_1 = require("./internal/utils");
/**
 * Define Options for the Class
 * @param options The Options to set
 * @example Example:
 * ```ts
 * @modelOptions({ schemaOptions: { timestamps: true } })
 * class ClassName {}
 *
 * // The default Class "TimeStamps" can be used for type information and options already set
 * ```
 */
function modelOptions(options) {
    return (target) => {
        (0, utils_1.assignGlobalModelOptions)(target);
        (0, utils_1.assignMetadata)(constants_1.DecoratorKeys.ModelOptions, options, target);
    };
}
exports.modelOptions = modelOptions;
exports.ModelOptions = modelOptions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWxPcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZGVsT3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxvREFBcUQ7QUFDckQsNENBQTRFO0FBRzVFOzs7Ozs7Ozs7O0dBVUc7QUFDSCxTQUFnQixZQUFZLENBQUMsT0FBc0I7SUFDakQsT0FBTyxDQUFDLE1BQVcsRUFBRSxFQUFFO1FBQ3JCLElBQUEsZ0NBQXdCLEVBQUMsTUFBTSxDQUFDLENBQUM7UUFDakMsSUFBQSxzQkFBYyxFQUFDLHlCQUFhLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUM7QUFDSixDQUFDO0FBTEQsb0NBS0M7QUFHd0Isb0NBQVkifQ==