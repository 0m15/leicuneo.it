import { proxy, useSnapshot } from 'valtio'

export const state = proxy({ activeTag: null, activeSubtag: null, showContentsPopover: false, })