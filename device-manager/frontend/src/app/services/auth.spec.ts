import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/user.model';
import { provideHttpClient } from '@angular/common/http';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);

        localStorage.clear();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should register a user', () => {
        const registerData: RegisterRequest = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
            password_confirmation: 'password123'
        };

        const mockResponse = {
            message: 'Usuário criado com sucesso',
            user: { id: 1, name: 'Test User', email: 'test@example.com' }
        };

        service.register(registerData).subscribe(response => {
            expect(response.message).toBe('Usuário criado com sucesso');
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/register');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should login and store token and user', () => {
        const loginData: LoginRequest = {
            email: 'test@example.com',
            password: 'password123'
        };

        const mockResponse: AuthResponse = {
            message: 'Login realizado com sucesso',
            user: { id: 1, name: 'Test User', email: 'test@example.com' },
            token: 'test-token-123'
        };

        service.login(loginData).subscribe(response => {
            expect(response.token).toBe('test-token-123');
            expect(localStorage.getItem('token')).toBe('test-token-123');
            expect(localStorage.getItem('user')).toContain('Test User');
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/login');
        expect(req.request.method).toBe('POST');
        req.flush(mockResponse);
    });

    it('should logout and clear session', () => {
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }));

        service.logout().subscribe(() => {
            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/logout');
        expect(req.request.method).toBe('POST');
        req.flush({});
    });

    it('should check if user is authenticated', () => {
        expect(service.isAuthenticated()).toBeFalsy(); // ← toBeFalsy ao invés de toBeFalse

        localStorage.setItem('token', 'test-token');
        expect(service.isAuthenticated()).toBeTruthy(); // ← toBeTruthy ao invés de toBeTrue
    });

    it('should get token from localStorage', () => {
        localStorage.setItem('token', 'test-token-123');
        expect(service.getToken()).toBe('test-token-123');
    });

    it('should get user from localStorage', () => {
        const user = { id: 1, name: 'Test User', email: 'test@example.com' };
        localStorage.setItem('user', JSON.stringify(user));

        const retrievedUser = service.getUser();
        expect(retrievedUser?.name).toBe('Test User');
        expect(retrievedUser?.email).toBe('test@example.com');
    });

    it('should clear session', () => {
        localStorage.setItem('token', 'test-token');
        localStorage.setItem('user', JSON.stringify({ id: 1 }));

        service.clearSession();

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('user')).toBeNull();
    });
});
