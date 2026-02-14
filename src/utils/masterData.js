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
    // FIX: The backend route is /study-programs?facultyId=... not /faculties/:id/study-programs
    const response = await apiFetch(`/master-data/study-programs?facultyId=${facultyId}`);
    return response.data || [];
  } catch (error) {
    console.error('Failed to fetch study programs:', error);
    return [];
  }
}

let divisionsCache = null;

export async function fetchDivisions() {
  if (divisionsCache) return divisionsCache;

  try {
    const response = await apiFetch('/divisions');
    divisionsCache = response.data || [];
    return divisionsCache;
  } catch (error) {
    console.error('Failed to fetch divisions:', error);
    return [];
  }
}
