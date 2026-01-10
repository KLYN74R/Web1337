import bs58 from 'bs58'
import crypto from 'crypto'
import nacl from 'tweetnacl'
import { HDKey } from '@scure/bip32'
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english.js'

const DEFAULT_BIP44 = [44, 7331, 0, 0]

function normalizeMnemonic(mnemonic) {
  return String(mnemonic ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
}

function hardened(n) {
  // same as: bip32.FirstHardenedChild + n in Go implementation
  return (0x80000000 | (n >>> 0)) >>> 0
}

function deriveSeed32FromMnemonic(mnemonic, mnemonicPassword, bip44Path) {
  const phrase = normalizeMnemonic(mnemonic)
  if (!validateMnemonic(phrase, wordlist)) throw new Error('Invalid seed phrase')

  const seed = mnemonicToSeedSync(phrase, mnemonicPassword ?? '')
  const root = HDKey.fromMasterSeed(seed)

  const [a, b, c, d] = bip44Path
  const child = root.deriveChild(hardened(a)).deriveChild(hardened(b)).deriveChild(hardened(c)).deriveChild(hardened(d))
  if (!child.privateKey) throw new Error('Failed to derive private key')

  const seed32 = child.privateKey.slice(0, 32)
  if (seed32.length !== 32) throw new Error('Invalid derived seed length')
  return seed32
}

function seed32ToPkcs8Base64(seed32) {
  // PKCS8 DER for Ed25519 private key:
  // 302e020100300506032b657004220420 || <32-byte-seed>
  const prefix = Buffer.from('302e020100300506032b657004220420', 'hex')
  const der = Buffer.concat([prefix, Buffer.from(seed32)])
  return der.toString('base64')
}

export default {
  // Same API as ed25519.js, but uses the SAME crypto/derivation as the browser wallet.
  // - bip39 seed
  // - bip32 hardened derivation path [44,7331,0,0]
  // - ed25519 keypair from 32-byte seed
  // Output format matches the Go/WASM box: { mnemonic, bip44Path, pub, prv }
  generateDefaultEd25519Keypair: async (mnemonic, mnemoPass, bip44Path) => {
    const path = Array.isArray(bip44Path) && bip44Path.length === 4 ? bip44Path : DEFAULT_BIP44

    let phrase = normalizeMnemonic(mnemonic)
    if (!phrase) phrase = generateMnemonic(wordlist, 256)

    const seed32 = deriveSeed32FromMnemonic(phrase, mnemoPass ?? '', path)
    const kp = nacl.sign.keyPair.fromSeed(seed32)

    const pub = bs58.encode(kp.publicKey)
    const prv = seed32ToPkcs8Base64(seed32)

    return JSON.stringify({ mnemonic: phrase, bip44Path: path, pub, prv })
  },

  signEd25519: (data, privateKeyAsBase64) => {
    const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyAsBase64}\n-----END PRIVATE KEY-----`
    return crypto.sign(null, Buffer.from(String(data)), privateKeyPem).toString('base64')
  },

  verifyEd25519: (data, signature, pubKey) => {
    return new Promise((resolve, reject) => {
      // Decode public key from Base58 and encode to hex, add ASN.1 prefix
      const pubInHex = Buffer.from(bs58.decode(pubKey)).toString('hex')
      const pubWithAsnPrefix = '302a300506032b6570032100' + pubInHex
      const pubAsBase64 = Buffer.from(pubWithAsnPrefix, 'hex').toString('base64')
      const finalPubKey = `-----BEGIN PUBLIC KEY-----\n${pubAsBase64}\n-----END PUBLIC KEY-----`

      crypto.verify(null, String(data), finalPubKey, Buffer.from(signature, 'base64'), (err, isVerified) =>
        err ? reject(false) : resolve(isVerified)
      )
    }).catch(() => false)
  }
}
