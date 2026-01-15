import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Device } from '../../models/device.model';
import { DeviceService } from '../../services/device';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './device-form.html',
  styleUrls: ['./device-form.scss']
})
export class DeviceFormComponent implements OnInit {
  deviceForm: FormGroup;
  loading = false;
  isEdit = false;
  today = new Date();

  constructor(
    private fb: FormBuilder,
    private deviceService: DeviceService,
    private dialogRef: MatDialogRef<DeviceFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { device?: Device }
  ) {
    this.isEdit = !!data?.device;

    this.deviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      location: ['', [Validators.required, Validators.maxLength(255)]],
      purchase_date: ['', [Validators.required]],
      in_use: [false]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.device) {
      this.deviceForm.patchValue({
        name: this.data.device.name,
        location: this.data.device.location,
        purchase_date: new Date(this.data.device.purchase_date),
        in_use: this.data.device.in_use
      });
    }
  }

  onSubmit(): void {
    if (this.deviceForm.valid) {
      this.loading = true;

      const formValue = { ...this.deviceForm.value };
      // Formatar data para YYYY-MM-DD
      if (formValue.purchase_date instanceof Date) {
        formValue.purchase_date = formValue.purchase_date.toISOString().split('T')[0];
      }

      const request = this.isEdit && this.data.device
        ? this.deviceService.updateDevice(this.data.device.id, formValue)
        : this.deviceService.createDevice(formValue);

      request.subscribe({
        next: (response) => {
          const message = this.isEdit
            ? 'Dispositivo atualizado com sucesso!'
            : 'Dispositivo criado com sucesso!';
          this.snackBar.open(message, 'Fechar', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          const message = error.error?.message || 'Erro ao salvar dispositivo';
          this.snackBar.open(message, 'Fechar', { duration: 5000 });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
