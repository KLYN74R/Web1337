/*


                Links:

https://github.com/LoCCS/bliss/search?q=entropy
https://github.com/LoCCS/bliss


*/

package main

import (
	"crypto/ed25519"
	"crypto/x509"

	"github.com/btcsuite/btcutil/base58"
	"github.com/cloudflare/circl/sign/dilithium"
	"github.com/tyler-smith/go-bip32"
	"github.com/tyler-smith/go-bip39"

	"github.com/LoCCS/bliss/sampler"

	"github.com/LoCCS/bliss"

	"encoding/base64"
	"encoding/hex"
	"encoding/json"

	"syscall/js"

	"math/rand"

	"time"
)

//______________________________ Dilithium ______________________________

var modename string = "Dilithium5" // Dilithium2-AES Dilithium3 Dilithium3-AES Dilithium5 Dilithium5-AES

var mode = dilithium.ModeByName(modename)

type Ed25519Box struct {
	Mnemonic  string   `json:"mnemonic"`
	Bip44Path []uint32 `json:"bip44Path"`
	Pub       string   `json:"pub"`
	Prv       string   `json:"prv"`
}

func generateDilithiumKeypair(this js.Value, args []js.Value) interface{} {

	publicKey, privateKey, _ := mode.GenerateKey(nil)

	return hex.EncodeToString(publicKey.Bytes()) + ":" + hex.EncodeToString(privateKey.Bytes())

}

/*
0 - privateKey
1 - message
*/
func generateDilithiumSignature(this js.Value, args []js.Value) interface{} {

	privateKey, _ := hex.DecodeString(args[0].String())

	msg := []byte(args[1].String())

	return hex.EncodeToString(mode.Sign(mode.PrivateKeyFromBytes(privateKey), msg))

}

/*
0 - message that was signed
1 - pubKey
2 - signature
*/
func verifyDilithiumSignature(this js.Value, args []js.Value) interface{} {

	msg := []byte(args[0].String())

	publicKey, _ := hex.DecodeString(args[1].String())

	signature, _ := hex.DecodeString(args[2].String())

	return mode.Verify(mode.PublicKeyFromBytes(publicKey), msg, signature)

}

//________________________________ BLISS ________________________________

func generateBlissKeypair(this js.Value, args []js.Value) interface{} {

	rand.Seed(time.Now().UnixNano())

	seed := make([]byte, sampler.SHA_512_DIGEST_LENGTH)

	rand.Read(seed)

	entropy, _ := sampler.NewEntropy(seed)

	prv, _ := bliss.GeneratePrivateKey(0, entropy)

	pub := prv.PublicKey()

	return hex.EncodeToString(pub.Encode()) + ":" + hex.EncodeToString(seed)

}

/*
0 - privateKey
1 - message
*/
func generateBlissSignature(this js.Value, args []js.Value) interface{} {

	//Decode msg an seed => entropy => privateKey

	sid, _ := hex.DecodeString(args[0].String())

	msg := []byte(args[1].String())

	seed := []byte(sid) // uint8/byte array

	entropy, _ := sampler.NewEntropy(seed)

	key, _ := bliss.GeneratePrivateKey(0, entropy)

	//Gen signature
	sig, _ := key.Sign(msg, entropy)

	return hex.EncodeToString(sig.Encode())

}

/*
0 - message
1 - publicKey
2 - signature
*/
func verifyBlissSignature(this js.Value, args []js.Value) interface{} {

	//Decode msg an publicKey
	msg := []byte(args[0].String())

	hexEncodedPublicKey, _ := hex.DecodeString(args[1].String())

	publicKey, _ := bliss.DecodePublicKey(hexEncodedPublicKey)

	//Decode signature
	decodedSignature, _ := hex.DecodeString(args[2].String())

	signature, _ := bliss.DecodeSignature(decodedSignature)

	//Verification itself
	_, err := publicKey.Verify(msg, signature)

	return err == nil

}

func generateEd25519Keypair(this js.Value, args []js.Value) interface{} {

	mnemonic := args[0].String()

	mnemonicPassword := args[1].String()

	// Now get the bip44DerivePath

	bip44DerivePath := []uint32{uint32(args[2].Int()), uint32(args[3].Int()), uint32(args[4].Int()), uint32(args[5].Int())}

	if mnemonic == "" {

		// Generate mnemonic if no pre-set

		entropy, _ := bip39.NewEntropy(256)

		mnemonic, _ = bip39.NewMnemonic(entropy)

	}

	// Now generate seed from 24-word mnemonic phrase (24 words = 256 bit security)
	// Seed has 64 bytes
	seed := bip39.NewSeed(mnemonic, mnemonicPassword) // password might be ""(empty) but it's not recommended

	// Generate master keypair from seed

	masterPrivateKey, _ := bip32.NewMasterKey(seed)

	// Now, to derive appropriate keypair - run the cycle over uint32 path-milestones and derive child keypairs

	// In case bip44Path empty - set the default one

	if len(bip44DerivePath) == 0 {

		bip44DerivePath = []uint32{44, 7331, 0, 0}

	}

	// Start derivation from master private key
	var childKey *bip32.Key = masterPrivateKey

	for pathPart := range bip44DerivePath {

		childKey, _ = childKey.NewChildKey(bip32.FirstHardenedChild + uint32(pathPart))

	}

	// Now, based on this - get the appropriate keypair

	publicKeyObject, privateKeyObject := generateKeyPairFromSeed(childKey.Key)

	// Export keypair

	pubKeyBytes, _ := x509.MarshalPKIXPublicKey(publicKeyObject)

	privKeyBytes, _ := x509.MarshalPKCS8PrivateKey(privateKeyObject)

	ed25519Box := Ed25519Box{Mnemonic: mnemonic, Bip44Path: bip44DerivePath, Pub: base58.Encode(pubKeyBytes[12:]), Prv: base64.StdEncoding.EncodeToString(privKeyBytes)}

	jsonData, _ := json.Marshal(ed25519Box)

	return string(jsonData)

}

// Private inner function

func generateKeyPairFromSeed(seed []byte) (ed25519.PublicKey, ed25519.PrivateKey) {

	privateKey := ed25519.NewKeyFromSeed(seed)

	pubKey, _ := privateKey.Public().(ed25519.PublicKey)

	return pubKey, privateKey

}

func main() {

	js.Global().Set("generateDilithiumKeypair", js.FuncOf(generateDilithiumKeypair))

	js.Global().Set("generateDilithiumSignature", js.FuncOf(generateDilithiumSignature))

	js.Global().Set("verifyDilithiumSignature", js.FuncOf(verifyDilithiumSignature))

	js.Global().Set("generateBlissKeypair", js.FuncOf(generateBlissKeypair))

	js.Global().Set("generateBlissSignature", js.FuncOf(generateBlissSignature))

	js.Global().Set("verifyBlissSignature", js.FuncOf(verifyBlissSignature))

	js.Global().Set("generateEd25519Keypair", js.FuncOf(generateEd25519Keypair))

	<-make(chan bool)

}
