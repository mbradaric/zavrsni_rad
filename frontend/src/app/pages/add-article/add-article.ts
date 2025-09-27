import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CATEGORIES } from '../../core/models/article-categories';

@Component({
  selector: 'app-add-article',
  imports: [
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './add-article.html',
  styleUrl: './add-article.scss',
})
export class AddArticle implements OnInit {
  articleForm: FormGroup;
  articleId?: number;

  categories = CATEGORIES;

  filteredSubcategories: { id: number; name: string }[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.articleForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      img_src: ['', Validators.required],
      category_id: ['', Validators.required],
      subcategory_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onCategoryChange(selectedCategoryId: number): void {
    const category = this.categories.find(
      (cat) => cat.id === selectedCategoryId
    );
    this.filteredSubcategories = category ? category.subcategories : [];
    this.articleForm.get('subcategory_id')?.setValue(''); // Reset subcategory_id
  }

  async onSubmit(): Promise<void> {
    if (this.articleForm.valid) {
      const formData = this.articleForm.value;

      // Find category and subcategory names
      const category = this.categories.find(
        (cat) => cat.id === formData.category_id
      );
      const subcategory = category?.subcategories.find(
        (sub) => sub.id === formData.subcategory_id
      );

      if (category && subcategory) {
        const dataToSubmit = {
          ...formData,
          category: category.name,
          subcategory: subcategory.name,
        };

        try {
          const response = await firstValueFrom(
            this.http.post('http://127.0.0.1:8000/articles/', dataToSubmit)
          );
          console.log('Article added successfully:', response);
          this.router.navigate(['/articles']);
        } catch (error) {
          console.error('Failed to add article:', error);
        }
      }
    }
  }
}
