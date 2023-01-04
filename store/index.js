import { proxy, useSnapshot } from 'valtio'

export const state = proxy({ centerUserLocation: false, showContentsPopover: false })
export const location = proxy({ latitude: null, longitude: null })