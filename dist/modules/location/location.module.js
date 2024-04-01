"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const location_service_1 = require("./location.service");
const location_schema_1 = require("./schemas/location.schema");
const location_repository_1 = require("./location.repository");
const location_controller_1 = require("./location.controller");
const permissions_module_1 = require("../permissions/permissions.module");
const user_module_1 = require("../user/user.module");
let LocationModule = class LocationModule {
};
exports.LocationModule = LocationModule;
exports.LocationModule = LocationModule = __decorate([
    (0, common_1.Module)({
        providers: [location_service_1.LocationService, location_repository_1.LocationRepository],
        controllers: [location_controller_1.LocationController],
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: location_schema_1.LOCATION_MODEL, schema: location_schema_1.LocationSchema },
            ]),
            permissions_module_1.PermissionsModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
        ],
        exports: [location_service_1.LocationService],
    })
], LocationModule);
//# sourceMappingURL=location.module.js.map