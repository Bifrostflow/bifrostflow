export interface APIResponse<T> {
  message: string;
  isSuccess: boolean;
  error: string | null;
  data: T | null;
}
