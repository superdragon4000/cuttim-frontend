import {apiFetch} from './client';

export type UploadedFile = {
  id: number;
  originalName: string;
  width: number;
  height: number;
  areaMm2: number;
};

export async function uploadFile(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);

  return apiFetch<UploadedFile>('/files/upload', {
    method: 'POST',
    body: formData,
    token,
    isFormData: true,
  });
}
