import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-edit-article',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './edit-article.html',
  styleUrl: './edit-article.scss',
})
export class EditArticle {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditArticle>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      id: [data.id],
      title: [data.title, Validators.required],
      price: [data.price, Validators.required],
      img_src: [data.img_src, Validators.required],
      category_id: [data.category_id, Validators.required],
      subcategory_id: [data.subcategory_id, Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid) {
      try {
        const payload = {
          title: this.form.value.title,
          price: this.form.value.price,
          img_src: this.form.value.img_src,
          category_id: this.form.value.category_id,
          subcategory_id: this.form.value.subcategory_id,
        };

        const updated = await firstValueFrom(
          this.http.put(
            `http://127.0.0.1:8000/articles/${this.form.value.id}`,
            payload
          )
        );

        this.dialogRef.close(updated);
      } catch (err) {
        console.error('Failed to update article', err);
      }
    }
  }
}
