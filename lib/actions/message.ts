import { signMessage as masterSignMessage } from '@wagmi/core'

export function signMessage(message: string) {
    return masterSignMessage({
        message
    })
}
