import crypto from 'crypto';

// Try to import bcryptjs, but fallback to a simplified implementation if not available
let bcrypt: {
    hash: (data: string, salt: number | string) => Promise<string>;
    compare: (data: string, encrypted: string) => Promise<boolean>;
};

try {
    // Try to require bcryptjs
    bcrypt = require('bcryptjs');
} catch (err) {
    console.warn('bcryptjs not found, using fallback implementation with crypto');
    
    // Simple fallback implementation using Node.js crypto
    bcrypt = {
        hash: async (data: string, salt: number | string): Promise<string> => {
            const rounds = typeof salt === 'number' ? salt : 10;
            const actualSalt = crypto.randomBytes(16).toString('hex');
            
            // Simple hash implementation - not as secure as bcrypt but works in a pinch
            let hash = data + actualSalt;
            for (let i = 0; i < rounds; i++) {
                hash = crypto.createHash('sha256').update(hash).digest('hex');
            }
            
            return `$fallback$${rounds}$${actualSalt}$${hash}`;
        },
        
        compare: async (data: string, encrypted: string): Promise<boolean> => {
            if (!encrypted.startsWith('$fallback$')) {
                return false;
            }
            
            const parts = encrypted.split('$');
            if (parts.length !== 5) return false;
            
            const rounds = parseInt(parts[2]);
            const salt = parts[3];
            const storedHash = parts[4];
            
            // Recompute hash with the same salt and rounds
            let hash = data + salt;
            for (let i = 0; i < rounds; i++) {
                hash = crypto.createHash('sha256').update(hash).digest('hex');
            }
            
            return hash === storedHash;
        }
    };
}

export default bcrypt; 