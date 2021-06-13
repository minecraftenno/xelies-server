const crypto = require('crypto'),
algorithm = 'aes-256-ctr',
key = process.env.SECRET || require("../.././c.json").SECRET,
iv = crypto.randomBytes(16)
const encrypt = (text, key) => {

    const cipher = crypto.createCipheriv(algorithm, key, iv),

    encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

const decrypt = (hash, key) => {
    const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(hash.iv, 'hex')),

    decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString()
}

module.exports = {
    encrypt,
    decrypt
}