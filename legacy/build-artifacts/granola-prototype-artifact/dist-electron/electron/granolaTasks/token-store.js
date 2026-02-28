import crypto from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
function normalizeKey(input) {
    if (!input) {
        throw new Error('TOKEN_ENCRYPTION_KEY is required.');
    }
    const trimmed = input.trim();
    if (/^[a-fA-F0-9]{64}$/.test(trimmed)) {
        return Buffer.from(trimmed, 'hex');
    }
    try {
        const decoded = Buffer.from(trimmed, 'base64');
        if (decoded.length === 32) {
            return decoded;
        }
    }
    catch {
        // ignore
    }
    const utf8 = Buffer.from(trimmed, 'utf8');
    if (utf8.length === 32) {
        return utf8;
    }
    throw new Error('TOKEN_ENCRYPTION_KEY must be 32-byte raw text, 64-char hex, or base64 for 32 bytes.');
}
async function writeAtomic(filePath, content) {
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });
    const tempPath = `${filePath}.${crypto.randomUUID()}.tmp`;
    await fs.writeFile(tempPath, content, 'utf8');
    await fs.rename(tempPath, filePath);
}
export class EncryptedTokenStore {
    filePath;
    key;
    constructor(filePath, keyInput) {
        this.filePath = filePath;
        this.key = normalizeKey(keyInput);
    }
    encrypt(plaintext) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
        const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
        const tag = cipher.getAuthTag();
        return {
            version: 1,
            alg: 'aes-256-gcm',
            iv: iv.toString('base64'),
            tag: tag.toString('base64'),
            ciphertext: ciphertext.toString('base64'),
            savedAt: new Date().toISOString(),
        };
    }
    decrypt(payload) {
        if (!payload || payload.version !== 1 || payload.alg !== 'aes-256-gcm') {
            throw new Error('Unsupported encrypted token payload format.');
        }
        const iv = Buffer.from(payload.iv, 'base64');
        const tag = Buffer.from(payload.tag, 'base64');
        const ciphertext = Buffer.from(payload.ciphertext, 'base64');
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
        decipher.setAuthTag(tag);
        const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
        return plaintext.toString('utf8');
    }
    async load() {
        try {
            const raw = await fs.readFile(this.filePath, 'utf8');
            const encryptedPayload = JSON.parse(raw);
            const decrypted = this.decrypt(encryptedPayload);
            return JSON.parse(decrypted);
        }
        catch (error) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
                return null;
            }
            throw error;
        }
    }
    async save(state) {
        const plaintext = JSON.stringify(state);
        const encryptedPayload = this.encrypt(plaintext);
        await writeAtomic(this.filePath, `${JSON.stringify(encryptedPayload, null, 2)}\n`);
    }
}
