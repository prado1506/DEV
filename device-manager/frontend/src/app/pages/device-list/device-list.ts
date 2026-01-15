import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Device, DeviceFilters } from '../../models/device.model';
import { DeviceService } from '../../services/device';
import { DeviceFormComponent } from '../../components/device-form/device-form';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-device-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatDialogModule,
    MatTooltipModule,
    NavbarComponent
  ],
  templateUrl: './device-list.html',
  styleUrls: ['./device-list.scss']
})
export class DeviceListComponent implements OnInit {
  devices: Device[] = [];
  loading = false;
  displayedColumns: string[] = ['name', 'location', 'purchase_date', 'in_use', 'actions'];

  totalItems = 0;
  pageSize = 15;
  currentPage = 1;

  filterForm: FormGroup;

  constructor(
    private deviceService: DeviceService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      location: [''],
      in_use: [''],
      purchase_date_from: [''],
      purchase_date_to: ['']
    });
  }

  ngOnInit(): void {
    this.loadDevices();

    this.filterForm.valueChanges.subscribe(filters => {
      localStorage.setItem('deviceFilters', JSON.stringify(filters));
    });

    const savedFilters = localStorage.getItem('deviceFilters');
    if (savedFilters) {
      this.filterForm.patchValue(JSON.parse(savedFilters));
    }
  }

  loadDevices(): void {
    this.loading = true;

    const filters: DeviceFilters = {
      ...this.filterForm.value,
      page: this.currentPage,
      per_page: this.pageSize
    };

    // Formatar datas
    if (filters.purchase_date_from) {
      const dateFrom = new Date(filters.purchase_date_from);
      if (!isNaN(dateFrom.getTime())) {
        filters.purchase_date_from = dateFrom.toISOString().split('T')[0];
      }
    }
    if (filters.purchase_date_to) {
      const dateTo = new Date(filters.purchase_date_to);
      if (!isNaN(dateTo.getTime())) {
        filters.purchase_date_to = dateTo.toISOString().split('T')[0];
      }
    }

    this.deviceService.getDevices(filters).subscribe({
      next: (response) => {
        this.devices = response.data;
        this.totalItems = response.total;
        this.currentPage = response.current_page;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.snackBar.open('Erro ao carregar dispositivos', 'Fechar', { duration: 3000 });
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadDevices();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadDevices();
  }

  clearFilters(): void {
    this.filterForm.reset();
    localStorage.removeItem('deviceFilters');
    this.currentPage = 1;
    this.loadDevices();
  }

  openDialog(device?: Device): void {
    const dialogRef = this.dialog.open(DeviceFormComponent, {
      width: '500px',
      data: { device }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadDevices();
      }
    });
  }

  toggleUse(device: Device): void {
    this.deviceService.toggleUse(device.id).subscribe({
      next: () => {
        const status = !device.in_use ? 'em uso' : 'disponível';
        this.snackBar.open(`Dispositivo marcado como ${status}`, 'Fechar', { duration: 3000 });
        this.loadDevices();
      },
      error: () => {
        this.snackBar.open('Erro ao alterar status', 'Fechar', { duration: 3000 });
      }
    });
  }

  deleteDevice(device: Device): void {
    if (confirm(`Deseja realmente excluir o dispositivo "${device.name}"?`)) {
      this.deviceService.deleteDevice(device.id).subscribe({
        next: () => {
          this.snackBar.open('Dispositivo excluído com sucesso', 'Fechar', { duration: 3000 });
          this.loadDevices();
        },
        error: () => {
          this.snackBar.open('Erro ao excluir dispositivo', 'Fechar', { duration: 3000 });
        }
      });
    }
  }
}
