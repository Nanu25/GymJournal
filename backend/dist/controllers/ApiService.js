"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiService = void 0;
// src/services/ApiService.ts
const OfflineService_1 = __importDefault(require("./OfflineService"));
class ApiService {
    fetch(url_1) {
        return __awaiter(this, arguments, void 0, function* (url, options = {}) {
            const method = options.method || 'GET';
            // If we're online and server is available, make the normal request
            if (OfflineService_1.default.canOperateOnline()) {
                try {
                    const response = yield fetch(url, options);
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }
                    return yield response.json();
                }
                catch (error) {
                    console.error('API request failed:', error);
                    // If it's a network error, switch to offline mode
                    if (error instanceof TypeError && error.message.includes('network')) {
                        return this.handleOfflineOperation(url, method, options.body);
                    }
                    throw error;
                }
            }
            else {
                // We're offline or server is down, use offline operation
                return this.handleOfflineOperation(url, method, options.body);
            }
        });
    }
    handleOfflineOperation(url, method, body) {
        return __awaiter(this, void 0, void 0, function* () {
            // Parse body if it's a string
            let parsedBody = body;
            if (typeof body === 'string') {
                try {
                    parsedBody = JSON.parse(body);
                }
                catch (_a) {
                    // If it's not valid JSON, use as is
                }
            }
            // Add operation to offline queue
            return OfflineService_1.default.addOperation(url, method, parsedBody);
        });
    }
    // Convenience methods
    get(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch(url);
        });
    }
    post(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        });
    }
    put(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        });
    }
    delete(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fetch(url, {
                method: 'DELETE'
            });
        });
    }
}
exports.apiService = new ApiService();
exports.default = exports.apiService;
