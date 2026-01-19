import { apiFetch } from '../services/api.js';

let facultiesCache = null;

export async function fetchFaculties() {
  if (facultiesCache) return facultiesCache;

  try {
    const response = await apiFetch('/master-data/faculties');
    facultiesCache = response.data || [];
    return facultiesCache;
  } catch (error) {
    console.error('Failed to fetch faculties:', error);
    return [];
  }
}

export function clearFacultiesCache() {
  facultiesCache = null;
}

export async function fetchStudyProgramsByFaculty(facultyId) {
  try {
    const response = await apiFetch(`/master-data/faculties/${facultyId}/study-programs`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch study programs:', error);
    return [];
  }
}
