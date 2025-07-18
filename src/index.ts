import { NanoSDK } from '@nanograph/sdk'

const sdk = new NanoSDK()

async function main() {
  await sdk.start()
}

process.on('SIGINT', () => sdk.stop())
process.on('SIGTERM', () => sdk.stop())

main().catch(error => {
  process.exit(1)
})