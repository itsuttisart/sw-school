export function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Radius of the earth in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in metres
}

export const DEFAULT_SCHOOL_LOCATION = {
  lat: 13.7563, // Default to Bangkok
  lng: 100.5018,
  radius: 500, // 500 meters
};

export function getSchoolLocationConfig() {
  try {
    const config = localStorage.getItem('schoolLocationConfig');
    if (config) {
      return JSON.parse(config) as { lat: number; lng: number; radius: number };
    }
  } catch (e) {
    // Return default if error parsing
  }
  return DEFAULT_SCHOOL_LOCATION;
}

export function saveSchoolLocationConfig(config: { lat: number; lng: number; radius: number }) {
  localStorage.setItem('schoolLocationConfig', JSON.stringify(config));
}
