import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters long')
}

export interface EncryptedData {
  encrypted: string
  iv: string
  authTag: string
}

export function encryptData(data: string): EncryptedData {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY), iv)
  
  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  const authTag = cipher.getAuthTag()
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  }
}

export function decryptData(encryptedData: EncryptedData): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(ENCRYPTION_KEY),
    Buffer.from(encryptedData.iv, 'hex')
  )
  decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'))
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')
  
  return decrypted
}

export function encryptField(value: string | null): EncryptedData | null {
  if (!value) return null
  return encryptData(value)
}

export function decryptField(encryptedData: EncryptedData | null): string | null {
  if (!encryptedData) return null
  return decryptData(encryptedData)
}

// Helper function to encrypt application data
export function encryptApplicationData(data: any) {
  const sensitiveFields = [
    'account_number',
    'bsb',
    'tax_file_number'
  ]
  
  const encryptedData = { ...data }
  
  for (const field of sensitiveFields) {
    if (typeof data[field] === 'string' && data[field]) {
      encryptedData[field] = encryptData(data[field])
    }
  }
  
  return encryptedData
}

// Helper function to parse encrypted data string
function parseEncryptedDataString(str: string): EncryptedData | null {
  try {
    // Remove the single quotes and parse the JSON string
    const cleanStr = str.replace(/^'|'$/g, '');
    const parsed = JSON.parse(cleanStr);
    
    // Validate the structure
    if (
      typeof parsed === 'object' &&
      typeof parsed.encrypted === 'string' &&
      typeof parsed.iv === 'string' &&
      typeof parsed.authTag === 'string'
    ) {
      return parsed;
    }
    return null;
  } catch (error) {
    console.error('Failed to parse encrypted data string:', error);
    return null;
  }
}

// Helper function to decrypt application data
export function decryptApplicationData(data: any) {
  const sensitiveFields = [
    'account_number',
    'bsb',
    'tax_file_number'
  ]
  
  const decryptedData = { ...data }
  
  for (const field of sensitiveFields) {
    if (!data[field]) continue;
    
    try {
      let encryptedData: EncryptedData | null = null;
      
      // Case 1: Object format
      if (typeof data[field] === 'object' && data[field].encrypted) {
        encryptedData = data[field];
      }
      // Case 2: String format (JSON string)
      else if (typeof data[field] === 'string' && data[field].includes('"encrypted"')) {
        encryptedData = parseEncryptedDataString(data[field]);
      }
      
      if (encryptedData) {
        decryptedData[field] = decryptData(encryptedData);
      }
    } catch (error) {
      console.error(`Failed to decrypt ${field}:`, error);
      decryptedData[field] = `Error: Unable to decrypt ${field}`;
    }
  }
  
  return decryptedData
} 