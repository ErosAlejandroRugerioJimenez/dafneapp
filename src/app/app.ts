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
  
  @HostListener('window:resize')
  onResize() {
    if (this.btnRef && this.attempts < this.maxAttempts) {
      this.centerButton();
    }
  }

  centerButton() {
    // Calculamos el ancho y alto real del botón en ese momento
    const btnWidth = this.btnRef.nativeElement.clientWidth;
    const btnHeight = this.btnRef.nativeElement.clientHeight;
    
    // Calculamos el centro
    const calcLeft = (window.innerWidth - btnWidth) / 2;
    const calcTop = (window.innerHeight - btnHeight) / 2;

    // El Math.max asegura que, si la pantalla es muy delgada, 
    // el botón nunca se pegue al borde izquierdo a menos de 20px
    this.buttonLeft = Math.max(20, calcLeft);
    this.buttonTop = Math.max(20, calcTop);
  }

  moveButton() {
    if (this.attempts < this.maxAttempts && this.btnRef) {
      const safeMargin = 60;
      const maxX = window.innerWidth - this.btnRef.nativeElement.clientWidth - safeMargin;
      const maxY = window.innerHeight - this.btnRef.nativeElement.clientHeight - safeMargin;

      // Evitamos valores negativos si la pantalla es extremadamente pequeña
      const randomX = Math.floor(Math.random() * Math.max(1, maxX - 20)) + 20;
      const randomY = Math.floor(Math.random() * Math.max(1, maxY - 20)) + 20;

      this.buttonLeft = randomX;
      this.buttonTop = randomY;

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
    // 1. Ocultamos el modal
    this.showModal = false;
    
    // 2. Reiniciamos los intentos a cero
    this.attempts = 0;

    // 3. Volvemos a centrar el botón
    // Usamos setTimeout para darle tiempo a Angular de cambiar el texto del botón 
    // ("Bueno, ya presióname" -> "Hola Dafne...") antes de calcular el nuevo tamaño y centro.
    setTimeout(() => {
      if (this.btnRef) {
        this.centerButton();
      }
    });
  }
}