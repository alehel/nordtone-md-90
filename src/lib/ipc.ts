/**
 * Typed wrappers over Tauri window controls. Every call is guarded so the
 * UI also runs in a plain browser during development (vite dev without tauri).
 */
import { getCurrentWindow } from '@tauri-apps/api/window';

export const isTauri = (): boolean =>
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;

export async function windowMinimize(): Promise<void> {
  if (isTauri()) await getCurrentWindow().minimize();
}

export async function windowToggleMaximize(): Promise<void> {
  if (isTauri()) await getCurrentWindow().toggleMaximize();
}

export async function windowClose(): Promise<void> {
  if (isTauri()) await getCurrentWindow().close();
}

export async function windowStartDragging(): Promise<void> {
  if (isTauri()) await getCurrentWindow().startDragging();
}
