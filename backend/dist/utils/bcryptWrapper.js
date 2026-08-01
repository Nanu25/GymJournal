"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
let bcrypt;
try {
    bcrypt = require('bcryptjs');
}
catch (err) {
    console.warn('bcryptjs not found, using fallback implementation with crypto');
    bcrypt = {
        hash: async (data, salt) => {
            const rounds = typeof salt === 'number' ? salt : 10;
            const actualSalt = crypto_1.default.randomBytes(16).toString('hex');
            let hash = data + actualSalt;
            for (let i = 0; i < rounds; i++) {
                hash = crypto_1.default.createHash('sha256').update(hash).digest('hex');
            }
            return `$fallback$${rounds}$${actualSalt}$${hash}`;
        },
        compare: async (data, encrypted) => {
            if (!encrypted.startsWith('$fallback$')) {
                return false;
            }
            const parts = encrypted.split('$');
            if (parts.length !== 5)
                return false;
            const rounds = parseInt(parts[2]);
            const salt = parts[3];
            const storedHash = parts[4];
            let hash = data + salt;
            for (let i = 0; i < rounds; i++) {
                hash = crypto_1.default.createHash('sha256').update(hash).digest('hex');
            }
            return hash === storedHash;
        }
    };
}
exports.default = bcrypt;
//# sourceMappingURL=bcryptWrapper.js.map