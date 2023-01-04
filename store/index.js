import { proxy, useSnapshot } from 'valtio'

export const state = proxy({ centerUserLocation: false, showContentsPopover: false, fullscreen: false, })
export const location = proxy({ latitude: null, longitude: null })