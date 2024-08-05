class Vector {
  constructor(public X: number, public Y: number, public X1: number, public Y1: number) {}

  dX() {
    return this.X1 - this.X;
  }

  dY() {
    return this.Y1 - this.Y;
  }

  Normalized() {
    var l = this.Length();
    return new Vector(this.X, this.Y, this.X + (this.dX() / l), this.Y + (this.dY() / l));
  }

  Length() {
    return Math.sqrt(Math.pow(this.dX(), 2) + Math.pow(this.dY(), 2));
  }

  Multiply(n: number) {
    return new Vector(this.X, this.Y, this.X + this.dX() * n, this.Y + this.dY() * n);
  }

  Clone() {
    return new Vector(this.X, this.Y, this.X1, this.Y1);
  }
}

class Lightning {
  constructor(public config: any) {}

  Cast(context: CanvasRenderingContext2D, from: Vector, to: Vector) {
    context.save();

    if (!from || !to) {
      return;
    }
    console.log('Drawing lightning', { from, to });
    var v = new Vector(from.X, from.Y, to.X1, to.Y1);
    console.log('Vector', v);
    var vLen = v.Length();
    console.log('Vector length', vLen); // Debug log
    // if (this.config.Threshold && vLen > context.canvas.width * this.config.Threshold) {
    //   console.warn('Vector length exceeds threshold, skipping draw');
    //   return;
    // }
    if (vLen === 0) {
      console.warn('Vector length is 0, skipping draw'); // Debug log
      return;
    }
    var refv = from;
    var lR = vLen / context.canvas.width;
    var segments = Math.floor(this.config.Segments * lR);
    var l = vLen / segments;

    console.log('Drawing lightning', { segments, l, vLen }); // Debug log
    console.log('segments', l );
    for (let i = 1; i <= segments; i++) {
      var dv = v.Multiply((1 / segments) * i);
      if (i != segments) {
        dv.Y1 += l * Math.random();
        dv.X1 += l * Math.random();
      }

      var r = new Vector(refv.X, refv.Y, dv.X1, dv.Y1);
      console.log(`Segment ${i}: from (${r.X}, ${r.Y}) to (${r.X1}, ${r.Y1})`); // Debug log

      this.Line(context, r, {
        Color: this.config.GlowColor,
        With: this.config.GlowWidth * lR,
        Blur: this.config.GlowBlur * lR,
        BlurColor: this.config.GlowColor,
        Alpha: this.Random(this.config.GlowAlpha, this.config.GlowAlpha * 2) / 100,
      });

      this.Line(context, r, {
        Color: this.config.Color,
        With: this.config.Width,
        Blur: this.config.Blur,
        BlurColor: this.config.BlurColor,
        Alpha: this.config.Alpha,
      });
      refv = r;
    }

    this.Circle(context, to, lR);
    this.Circle(context, from, lR);

    context.restore();
  }

  Circle(context: CanvasRenderingContext2D, p: Vector, lR: number) {
    context.beginPath();
    context.arc(p.X1 + Math.random() * 10 * lR, p.Y1 + Math.random() * 10 * lR, 5, 0, 2 * Math.PI, false);
    context.fillStyle = 'white';
    context.shadowBlur = 100;
    context.shadowColor = '#2319FF';
    context.fill();
  }

  Line(context: CanvasRenderingContext2D, v: Vector, c: any) {
    context.beginPath();
    context.strokeStyle = c.Color;
    context.lineWidth = c.With;
    context.moveTo(v.X, v.Y);
    context.lineTo(v.X1, v.Y1);
    context.globalAlpha = c.Alpha;
    context.shadowBlur = c.Blur;
    context.shadowColor = c.BlurColor;
    context.stroke();
  }

  Random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}

export { Vector, Lightning };



