import { mockApplications } from '../data/mockData';

const KEY = 'placement_applications_v1';

export function loadApplications() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(mockApplications));
      return mockApplications.slice();
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('loadApplications error', e);
    return mockApplications.slice();
  }
}

export function saveApplications(apps) {
  try {
    localStorage.setItem(KEY, JSON.stringify(apps));
    // notify other parts of the app
    window.dispatchEvent(new CustomEvent('applications:updated', { detail: apps }));
  } catch (e) {
    console.error('saveApplications error', e);
  }
}
