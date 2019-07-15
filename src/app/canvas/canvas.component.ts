import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { COLORS, DIMENSIONS } from './canvas.constants';
import { Square } from './canvas.types';

@Component({
  selector: 'app-canvas-mondrian',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements OnInit {

  @ViewChild('mondrianCanvas', { static: true }) mondrianCanvas: ElementRef;
  context: CanvasRenderingContext2D;
  dpr = window.devicePixelRatio;
  lineWidth = DIMENSIONS.lineWidth;
  size = DIMENSIONS.canvasSize;
  step = this.size / DIMENSIONS.step;
  colors = COLORS.primary;
  white = COLORS.white;

  squares: Array<any> = [{
    x: 0,
    y: 0,
    width: this.size,
    height: this.size
  }];

  ngOnInit(): void {
    this.context = (<HTMLCanvasElement>this.mondrianCanvas.nativeElement).getContext('2d');
    this.context.canvas.width = this.size * this.dpr;
    this.context.canvas.height = this.size * this.dpr;
    this.context.scale(this.dpr, this.dpr);
    this.context.lineWidth = this.lineWidth;

    this.drawCanvas();
  }

  private drawCanvas(): void {
    for (let i = 0; i < this.size; i += this.step) {
      this.splitSquaresWith({ x: i });
      this.splitSquaresWith({ y: i });
    }

    for (const square of this.squares) {
      this.context.beginPath();
      this.context.rect(
        square.x,
        square.y,
        square.width,
        square.height
      );
      for (const color in this.colors) {
        this.squares[Math.floor(Math.random() * this.squares.length)].color = this.colors[color];
      }
      if (square.color && Math.random() > 0.5) {
        this.context.fillStyle = square.color;
      } else {
        this.context.fillStyle = this.white;
      }
      this.context.fill();
      this.context.stroke();
    }
  }

  private splitSquaresWith(coordinates: Square): void {
    const { x, y } = coordinates;

    for (let i = this.squares.length - 1; i >= 0; i--) {
      const square = this.squares[i];

      if (x && x > square.x && x < square.x + square.width) {
        if (Math.random() > 0.5) {
          this.squares.splice(i, 1);
          this.splitOnX(square, x);
        }
      }

      if (y && y > square.y && y < square.y + square.height) {
        if (Math.random() > 0.5) {
          this.squares.splice(i, 1);
          this.splitOnY(square, y);
        }
      }
    }
  }

  private splitOnX(square: Square, splitAt: number): void {
    const squareA = {
      x: square.x,
      y: square.y,
      width: square.width - (square.width - splitAt + square.x),
      height: square.height
    };

    const squareB = {
      x: splitAt,
      y: square.y,
      width: square.width - splitAt + square.x,
      height: square.height
    };

    this.squares.push(squareA);
    this.squares.push(squareB);
  }

  private splitOnY(square: Square, splitAt: number): void {
    const squareA = {
      x: square.x,
      y: square.y,
      width: square.width,
      height: square.height - (square.height - splitAt + square.y)
    };

    const squareB = {
      x: square.x,
      y: splitAt,
      width: square.width,
      height: square.height - splitAt + square.y
    };

    this.squares.push(squareA);
    this.squares.push(squareB);
  }
}
