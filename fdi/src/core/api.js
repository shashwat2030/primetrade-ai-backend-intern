const API_BASE = "http://localhost:8080/api/v1";
export const apiFetch = async (path, options = {}, token = null) => {
    // base headers
    const defaultHeaders = {"Content-Type": "application/json"};
    if (token) defaultHeaders["Authorization"] = `Bearer ${token}`;

    // merge default headers with user supplied headers (wining headers conflict)
    const mergeHeaders = {...defaultHeaders, ...options.headers};
    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: mergeHeaders,
    });

    // try to parse json config; if it fails (e.g., 204 No Content) return an empty object
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
    }
    return data;
};