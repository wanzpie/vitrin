export type VitrinClientOptions = {
  baseUrl: string;
  token?: string;
};

export class VitrinClient {
  constructor(private readonly options: VitrinClientOptions) {}

  async get<T>(path: string): Promise<T> {
    const response = await fetch(`${this.options.baseUrl}${path}`, {
      headers: this.options.token
        ? { Authorization: `Bearer ${this.options.token}` }
        : undefined,
    });

    if (!response.ok) {
      throw new Error(`Vitrin API request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  }
}
