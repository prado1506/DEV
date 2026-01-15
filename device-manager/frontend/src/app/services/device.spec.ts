import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { DeviceService } from './device';
import { Device, DeviceResponse } from '../models/device.model';
import { provideHttpClient } from '@angular/common/http';

describe('DeviceService', () => {
    let service: DeviceService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                DeviceService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(DeviceService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get devices with pagination', () => {
        const mockResponse: DeviceResponse = {
            current_page: 1,
            data: [
                {
                    id: 1,
                    name: 'iPhone 15',
                    location: 'Escritório',
                    purchase_date: '2024-01-15',
                    in_use: true,
                    user_id: 1
                }
            ],
            first_page_url: 'http://api/devices?page=1',
            from: 1,
            last_page: 1,
            last_page_url: 'http://api/devices?page=1',
            next_page_url: null,
            path: 'http://api/devices',
            per_page: 15,
            prev_page_url: null,
            to: 1,
            total: 1
        };

        service.getDevices({ page: 1 }).subscribe(response => {
            expect(response.data.length).toBe(1);
            expect(response.data[0].name).toBe('iPhone 15');
        });

        const req = httpMock.expectOne((request) =>
            request.url === 'http://127.0.0.1:8000/api/devices'
        );
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('should create a device', () => {
        const newDevice: Partial<Device> = {
            name: 'iPhone 15 Pro',
            location: 'Escritório',
            purchase_date: '2024-01-15',
            in_use: true
        };

        const mockResponse: Device = {
            id: 1,
            name: 'iPhone 15 Pro',
            location: 'Escritório',
            purchase_date: '2024-01-15',
            in_use: true,
            user_id: 1
        };

        service.createDevice(newDevice).subscribe(device => {
            expect(device.id).toBe(1);
            expect(device.name).toBe('iPhone 15 Pro');
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/devices');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newDevice);
        req.flush(mockResponse);
    });

    it('should update a device', () => {
        const updatedDevice: Partial<Device> = {
            name: 'iPhone 15 Pro Max',
            location: 'Home Office',
            purchase_date: '2024-01-20',
            in_use: false
        };

        const mockResponse: Device = {
            id: 1,
            name: 'iPhone 15 Pro Max',
            location: 'Home Office',
            purchase_date: '2024-01-20',
            in_use: false,
            user_id: 1
        };

        service.updateDevice(1, updatedDevice).subscribe(device => {
            expect(device.name).toBe('iPhone 15 Pro Max');
            expect(device.location).toBe('Home Office');
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/devices/1');
        expect(req.request.method).toBe('PUT');
        req.flush(mockResponse);
    });

    it('should delete a device', () => {
        service.deleteDevice(1).subscribe(response => {
            expect(response.message).toBeDefined();
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/devices/1');
        expect(req.request.method).toBe('DELETE');
        req.flush({ message: 'Dispositivo deletado com sucesso' });
    });

    it('should toggle device use status', () => {
        const mockResponse: Device = {
            id: 1,
            name: 'iPhone 15',
            location: 'Escritório',
            purchase_date: '2024-01-15',
            in_use: true,
            user_id: 1
        };

        service.toggleUse(1).subscribe(device => {
            expect(device.in_use).toBeTruthy(); // ← toBeTruthy
        });

        const req = httpMock.expectOne('http://127.0.0.1:8000/api/devices/1/use');
        expect(req.request.method).toBe('PATCH');
        req.flush(mockResponse);
    });
});
