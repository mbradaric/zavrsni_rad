import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../core/models/article';
import { Article as ArticleComponent } from '../../shared/components/article/article';
import { Product } from '../../core/services/product';

@Component({
  selector: 'app-articles',
  imports: [ArticleComponent, CommonModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class Articles implements OnInit {
  category_id: number = 0;
  filteredArticles: Article[] = [];
  articles: Article[] = [];

  constructor(private articleService: Product, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category_id = +(params.get('category_id') ?? 0);
      this.articleService.getArticles(this.category_id).subscribe((data) => {
        this.articles = data;
        this.filteredArticles = this.articles;
      });
    });
  }
}
