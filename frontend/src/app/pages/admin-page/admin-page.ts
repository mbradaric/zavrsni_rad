import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { EditArticle } from '../../shared/components/edit-article/edit-article';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../core/models/article-categories';

@Component({
  selector: 'app-admin-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    RouterLink,
  ],
  templateUrl: './admin-page.html',
  styleUrl: './admin-page.scss',
})
export class AdminPage implements OnInit {
  articles: any[] = [];
  displayedColumns: string[] = [
    'id',
    'title',
    'price',
    'category',
    'subcategory',
    'actions',
  ];

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  async loadArticles(): Promise<void> {
    try {
      this.articles = await firstValueFrom(
        this.http.get<any[]>('http://127.0.0.1:8000/articles/')
      );
    } catch (err) {
      console.error('Failed to load articles', err);
    }
  }

  async deleteArticle(id: number): Promise<void> {
    if (confirm('Da li ste sigurni da želite ukloniti ovaj artikal?')) {
      try {
        await firstValueFrom(
          this.http.delete(`http://127.0.0.1:8000/articles/${id}`)
        );
        this.articles = this.articles.filter((a) => a.id !== id);
      } catch (err) {
        console.error('Failed to delete article', err);
      }
    }
  }

  editArticle(article: any): void {
    const dialogRef = this.dialog.open(EditArticle, {
      width: '500px',
      data: { ...article },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const index = this.articles.findIndex((a) => a.id === result.id);
        if (index !== -1) {
          this.articles[index] = result;
          this.articles = [...this.articles];
        }
      }
    });
  }

  getCategoryName(category_id: number): string {
    return CATEGORIES.find((cat) => cat.id === category_id)?.name || '';
  }

  getSubcategoryName(category_id: number, subcategory_id: number): string {
    const category = CATEGORIES.find((cat) => cat.id === category_id);
    return (
      category?.subcategories.find((sub) => sub.id === subcategory_id)?.name ||
      ''
    );
  }
}
