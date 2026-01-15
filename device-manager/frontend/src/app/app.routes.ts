import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { DeviceListComponent } from './pages/device-list/device-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: '/devices', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    {
        path: 'devices',
        component: DeviceListComponent,
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '/devices' }
];
