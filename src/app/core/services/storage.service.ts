import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface FileInfo {
  name: string;
  path: string;
  size: number;
  type: 'file' | 'folder';
  lastModified: string;
}

export interface UploadResponse {
  uploaded: string;
}

export interface MoveRequest {
  from: string;
  to: string;
}

export interface RenameRequest {
  path: string;
  newName: string;
}

export interface CreateFolderRequest {
  path: string;
}

export interface TestMinioResponse {
  success: boolean;
  message: string;
  buckets: string[];
  targetBucket: string;
  targetBucketExists: boolean;
  config: {
    host: string;
    port: string;
    accessKey: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private apiUrl = `${environment.apiUrl}/storage`;

  constructor(private http: HttpClient) {}

  // Health & Authentication
  ping(): Observable<{ message: string; time: string }> {
    return this.http.get<{ message: string; time: string }>(`${this.apiUrl}/ping`);
  }

  checkAuthToken(): Observable<{ token: string; valid: boolean; demoMode: boolean }> {
    return this.http.get<{ token: string; valid: boolean; demoMode: boolean }>(`${this.apiUrl}/auth-token`);
  }

  testMinioConnection(): Observable<TestMinioResponse> {
    return this.http.get<TestMinioResponse>(`${this.apiUrl}/test-minio`);
  }

  // File Operations
  listFiles(path: string = ''): Observable<FileInfo[]> {
    const params = new HttpParams().set('path', path);
    return this.http.get<FileInfo[]>(`${this.apiUrl}/list`, { params });
  }

  uploadFile(file: File, path: string = ''): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const params = new HttpParams().set('path', path);
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData, { params });
  }

  downloadFile(path: string): Observable<Blob> {
    const params = new HttpParams().set('path', path);
    return this.http.get(`${this.apiUrl}/download`, { 
      params, 
      responseType: 'blob' 
    });
  }

  getFileInfo(path: string): Observable<FileInfo> {
    const params = new HttpParams().set('path', path);
    return this.http.get<FileInfo>(`${this.apiUrl}/info`, { params });
  }

  searchFiles(pattern: string, path: string = ''): Observable<FileInfo[]> {
    let params = new HttpParams().set('pattern', pattern);
    if (path) {
      params = params.set('path', path);
    }
    return this.http.get<FileInfo[]>(`${this.apiUrl}/search`, { params });
  }

  deleteFile(path: string): Observable<{ deleted: string }> {
    const params = new HttpParams().set('path', path);
    return this.http.delete<{ deleted: string }>(`${this.apiUrl}/delete`, { params });
  }

  // Directory Operations
  createDirectory(path: string): Observable<{ created: string }> {
    return this.http.post<{ created: string }>(`${this.apiUrl}/mkdir`, { path });
  }

  downloadAsZip(path: string): Observable<Blob> {
    const params = new HttpParams().set('path', path);
    return this.http.get(`${this.apiUrl}/zip`, { 
      params, 
      responseType: 'blob' 
    });
  }

  // File Management
  moveFile(from: string, to: string): Observable<{ moved: boolean }> {
    return this.http.post<{ moved: boolean }>(`${this.apiUrl}/move`, { from, to });
  }

  renameFile(path: string, newName: string): Observable<{ renamedTo: string }> {
    return this.http.post<{ renamedTo: string }>(`${this.apiUrl}/rename`, { path, newName });
  }

  // Utility method to download file with proper filename
  downloadFileWithName(path: string): void {
    this.downloadFile(path).subscribe(blob => {
      const filename = path.split('/').pop() || 'download';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // Utility method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}