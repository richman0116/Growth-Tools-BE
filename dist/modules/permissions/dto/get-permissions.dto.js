"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPermissionsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const pagination_dto_1 = require("../../../common/pagination.dto");
class GetPermissionsDto extends pagination_dto_1.CommonPaginationDto {
}
exports.GetPermissionsDto = GetPermissionsDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'find with action ||  description',
        required: false,
    }),
    __metadata("design:type", String)
], GetPermissionsDto.prototype, "keywords", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'createdAt_asc',
        required: false,
        default: 'createdAt_asc',
    }),
    __metadata("design:type", String)
], GetPermissionsDto.prototype, "sortBy", void 0);
//# sourceMappingURL=get-permissions.dto.js.map