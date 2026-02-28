const API_BASE = '';

export class ApiService {
  private static getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  private static async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    // Only add Content-Type if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const text = await response.text();
    
    try {
      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }
      
      return data;
    } catch (e) {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      throw e;
    }
  }

  static get(endpoint: string) {
    return this.request(endpoint, { method: 'GET' });
  }

  static post(endpoint: string, data: any) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, { method: 'POST', body });
  }

  static put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static delete(endpoint: string) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const api = ApiService;
