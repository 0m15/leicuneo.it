import { proxy, useSnapshot } from "valtio";

export const state = proxy({
  centerUserLocation: false,
  showContentsPopover: false,
  showInfo: false,
  fullscreen: false,
  tab: 0,
});
export const location = proxy({ latitude: null, longitude: null });
export const tagsSelection = proxy({ tag: null, subtag: null });
