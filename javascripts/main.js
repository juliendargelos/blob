var main = {
  canvas: document.querySelector('canvas'),
  context: null,
  simplex: new SimplexNoise(),
  radius: 300,
  time: 0,
  fps: 120,
  interval: 0,
  resolution: 20,
  rotation: true,

  get shouldDraw() {
    var delta = Date.now() - this.time;

    if(delta >= this.interval) {
      this.time += delta;
      return true;
    }
    else return false;
  },

  get width() {
    return this.canvas.width;
  },

  set width(v) {
    this.canvas.width = v;
  },

  get height() {
    return this.canvas.height;
  },

  set height(v) {
    this.canvas.height = v;
  },

  get center() {
    return {
      x: this.width/2,
      y: this.height/2
    };
  },

  clear: function() {
    this.context.fillStyle = 'rgba(0, 0, 0, 0.04)';
    this.context.fillRect(0, 0, this.width, this.height);
  },

  draw: function() {
    var center = this.center;
    var point, alpha, noise;
    var time = this.time/3000;
    var points = [];

    if(this.rotation) {
      this.context.translate(center.x, center.y);
      this.context.rotate(time/20000000%(Math.PI*2));
      this.context.translate(-center.x, -center.y);
    }

    this.context.strokeStyle = 'rgb(' + [
      Math.min(255, Math.floor(this.simplex.noise2D(time, time)*128 + 170)),
      Math.min(255, Math.floor(this.simplex.noise2D(time + 2, time + 2)*128 + 170)),
      Math.min(255, Math.floor(this.simplex.noise2D(time + 4, time + 4)*128 + 170))
    ].join(',') + ')';

    for(var i = 0; i < this.resolution; i++) {
      alpha = Math.PI*2/this.resolution * i;

      point = {
        x: Math.cos(alpha),
        y: Math.sin(alpha)
      }

      noise = this.simplex.noise3D(point.x, point.y, time)*(this.radius/4);

      point.x = point.x * (this.radius + noise) + center.x;
      point.y = point.y * (this.radius + noise) + center.y;

      points.push(point);
    }

    this.context.beginPath();
    this.context.moveTo(
      (points[points.length - 1].x + points[0].x)/2,
      (points[points.length - 1].y + points[0].y)/2
    );

    for(var i = 0; i < points.length - 1; i ++) {
      this.context.quadraticCurveTo(
        points[i].x,
        points[i].y,
        (points[i].x + points[i + 1].x)/2,
        (points[i].y + points[i + 1].y)/2
      );
    }

    this.context.quadraticCurveTo(
      points[points.length - 1].x,
      points[points.length - 1].y,
      (points[points.length - 1].x + points[0].x)/2,
      (points[points.length - 1].y + points[0].y)/2
    );
    this.context.closePath();

    this.context.lineWidth = 2;
    this.context.stroke();
  },

  render: function() {
    this.clear();
    this.draw();
  },

  update: function() {
    if(this.shouldDraw) this.render();
  },

  resize: function() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  },

  init: function() {
    var self = this;

    this.context = this.canvas.getContext('2d');
    this.interval = 1000/this.fps;
    this.time = Date.now();

    this.resize();

    window.addEventListener('resize', function() {
      self.resize();
    });

    var draw = function() {
      self.update();

      window.requestAnimationFrame(draw);
    };

    draw();
  }
}
