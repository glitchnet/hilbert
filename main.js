
(function () {
  var canvas = document.querySelector('canvas');
  var prev = [0, 0];
  var curr;
  var ctx = canvas.getContext('2d');
  var N = window.innerWidth / 10;
  var count = 0;
  var width;
  var height;

  // modified from https://github.com/marcin-chwedczuk/hilbert_curve
  function hindex2xy(hindex, N) {
    var positions = [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 0]
    ];

    var tmp = positions[last2bits(hindex)];
    hindex = (hindex >>> 2);

    var x = tmp[0];
    var y = tmp[1];

    for (var n = 4; n <= N; n *= 2) {
      var n2 = n / 2;

      switch (last2bits(hindex)) {
        case 0: /* left-bottom */
          tmp = x;
          x = y;
          y = tmp;
          break;

        case 1: /* left-upper */
          y += n2;
          break;

        case 2: /* right-upper */
          x += n2;
          y += n2;
          break;

        case 3: /* right-bottom */
          tmp = y;
          y = (n2 - 1) - x;
          x = (n2 - 1) - tmp;
          x += n2;
          break;
      }

      hindex = hindex >>> 2;
    }

    return [x, y];

    function last2bits(x) {
      return (x & 3);
    }
  }

  function line(from, to) {
    var blockSize = Math.floor(width / N);
    var offset = blockSize / 10;
    ctx.strokeStyle = 'rgba(0, 0, 255, 1)';

    for (var i = 0; i < 3; i++) {
      ctx.beginPath();

      if (i < 2) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
        offset = offset + 1;
      } else {
        ctx.strokeStyle = 'rgba(255, 0, 255, 1)';
      }
      ctx.lineWidth = (i + 2) * 2;
      ctx.moveTo(from[0] * blockSize + offset,
                 from[1] * blockSize + offset);
      ctx.lineTo(to[0] * blockSize + offset,
                 to[1] * blockSize + offset);
      ctx.stroke();
      ctx.closePath();
    }
  }

  function reset() {
    ctx.clearRect(0, 0, width, height);
    count = 0;
    prev = [0, 0];
    curr = null;
    width = window.innerWidth;
    height = window.innerHeight;

    N = width / 10;
  }

  function render() {
    curr = hindex2xy(count, N);

    line(prev, curr);

    prev = curr;

    if (count > (N * 4) + 200) {
      setTimeout(function () {
        reset();
      }, 500);
    } else {
      count++;
    }

    requestAnimationFrame(render);
  }

  window.onresize = function () {
    reset();
  };

  reset()
  render();
})();