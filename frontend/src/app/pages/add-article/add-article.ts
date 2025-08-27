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
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-add-article',
  imports: [
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './add-article.html',
  styleUrl: './add-article.scss',
})
export class AddArticle implements OnInit {
  articleForm: FormGroup;

  categories = [
    {
      id: 1,
      name: 'Dnevna Soba',
      subcategories: [
        { id: 1, name: 'Sofe & Kauči' },
        { id: 2, name: 'Klub Stolovi' },
        { id: 3, name: 'TV Stalci' },
        { id: 4, name: 'Fotelje & Naslonjači' },
        { id: 5, name: 'Police za Knjige' },
      ],
    },
    {
      id: 2,
      name: 'Spavaća Soba',
      subcategories: [
        { id: 6, name: 'Kreveti' },
        { id: 7, name: 'Komode & Ormarići' },
        { id: 8, name: 'Noćni Ormarići' },
        { id: 9, name: 'Ormari' },
        { id: 10, name: 'Toaletni Stolići' },
      ],
    },
    {
      id: 3,
      name: 'Blagovaonica',
      subcategories: [
        { id: 11, name: 'Blagovaonski Stolovi' },
        { id: 12, name: 'Blagovaonske Stolice' },
        { id: 13, name: 'Barske Stolice' },
        { id: 14, name: 'Kredenci & Komode' },
        { id: 15, name: 'Vitrine za Posuđe' },
      ],
    },
    {
      id: 4,
      name: 'Kućni Ured',
      subcategories: [
        { id: 16, name: 'Radni Stolovi' },
        { id: 17, name: 'Uredske Stolice' },
        { id: 18, name: 'Police za Knjige' },
        { id: 19, name: 'Ormarići za Dokumente' },
        { id: 20, name: 'Regali & Police' },
      ],
    },
  ];

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
