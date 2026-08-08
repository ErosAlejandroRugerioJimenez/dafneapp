import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
})
export class App implements AfterViewInit {
  @ViewChild('catchMeBtn') btnRef!: ElementRef<HTMLButtonElement>;

  attempts = 0;
  maxAttempts = 6;
  showModal = false;

  buttonLeft = 0;
  buttonTop = 0;

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.btnRef) {
        this.centerButton();
      }
    });
  }

 // Antes estaba así: @HostListener('window:resize', ['$event'])
  
  @HostListener('window:resize')
  onResize() {
    if (this.btnRef && this.attempts < this.maxAttempts) {
      this.centerButton();
    }
  }

  centerButton() {
    this.buttonLeft = (window.innerWidth - this.btnRef.nativeElement.clientWidth) / 2;
    this.buttonTop = (window.innerHeight - this.btnRef.nativeElement.clientHeight) / 2;
  }

  moveButton() {
    if (this.attempts < this.maxAttempts && this.btnRef) {
      const safeMargin = 60;
      const maxX = window.innerWidth - this.btnRef.nativeElement.clientWidth - safeMargin;
      const maxY = window.innerHeight - this.btnRef.nativeElement.clientHeight - safeMargin;

      this.buttonLeft = Math.floor(Math.random() * (maxX - 20)) + 20;
      this.buttonTop = Math.floor(Math.random() * (maxY - 20)) + 20;

      this.attempts++;
    }
  }

  handleTouch(event: TouchEvent) {
    if (this.attempts < this.maxAttempts) {
      event.preventDefault();
      this.moveButton();
    }
  }

  handleClick() {
    if (this.attempts >= this.maxAttempts) {
      this.showModal = true;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#10b981', '#3b82f6', '#facc15']
      });
    }
  }

  closeModal() {
    this.showModal = false;
  }
}