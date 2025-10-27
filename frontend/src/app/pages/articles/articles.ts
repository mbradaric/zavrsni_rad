import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Article } from '../../core/models/article';
import { Article as ArticleComponent } from '../../shared/components/article/article';
import { Product } from '../../core/services/product';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-articles',
  imports: [ArticleComponent, CommonModule],
  templateUrl: './articles.html',
  styleUrl: './articles.scss',
})
export class Articles implements OnInit, OnDestroy {
  category_id: number = 0;
  filteredArticles: Article[] = [];
  articles: Article[] = [];
  private routeSubscription?: Subscription;

  constructor(private articleService: Product, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSubscription = combineLatest([
      this.route.paramMap,
      this.route.queryParamMap,
    ])
      .pipe(
        switchMap(([params, queryParams]) => {
          this.category_id = +(params.get('category_id') ?? 0);
          const search = (queryParams.get('search') ?? '').trim();

          if (search) {
            return this.articleService.searchArticles(search);
          }

          return this.articleService.getArticles(this.category_id || undefined);
        })
      )
      .subscribe((data) => {
        this.articles = data;
        this.filteredArticles = data;
      });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }
}
