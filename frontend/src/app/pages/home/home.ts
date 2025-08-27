import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { HeroSection } from '../../shared/components/hero-section/hero-section';

@Component({
  selector: 'app-home',
  imports: [HeroSection],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
