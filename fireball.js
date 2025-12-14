(() => {
  "use strict";

  const bits = 80;
  const speed = 33;
  const bangs = 5;
  const colours = ["#03f", "#f03", "#0e0", "#93f", "#0cf", "#f93", "#f0c"];

  const bangheight = [];
  const intensity = [];
  const colour = [];
  const Xpos = [];
  const Ypos = [];
  const dX = [];
  const dY = [];
  const stars = [];
  const decay = [];

  let swide = window.innerWidth || 800;
  let shigh = window.innerHeight || 600;
  let boddie;

  function setDimensions() {
    swide = Math.max(
      document.documentElement?.clientWidth || 0,
      window.innerWidth || 0,
      document.body?.clientWidth || 0,
      800
    );
    shigh = Math.max(
      document.documentElement?.clientHeight || 0,
      window.innerHeight || 0,
      document.body?.clientHeight || 0,
      600
    );
  }

  function createDiv(char, size) {
    const div = document.createElement("div");
    div.style.position = "absolute";
    div.style.font = `${size}px monospace`;
    div.style.backgroundColor = "transparent";
    div.appendChild(document.createTextNode(char));
    return div;
  }

  function writeFire(n) {
    stars[`${n}r`] = createDiv("|", 12);
    boddie.appendChild(stars[`${n}r`]);

    for (let i = bits * n; i < bits + bits * n; i++) {
      stars[i] = createDiv("*", 13);
      boddie.appendChild(stars[i]);
    }
  }

  function launch(n) {
    colour[n] = Math.floor(Math.random() * colours.length);
    Xpos[`${n}r`] = swide * 0.5;
    Ypos[`${n}r`] = shigh - 5;

    bangheight[n] = Math.round((0.5 + Math.random()) * shigh * 0.4);
    dX[`${n}r`] = (Math.random() - 0.5) * swide / bangheight[n];

    const ch =
      dX[`${n}r`] > 1.25 ? "/" :
      dX[`${n}r`] < -1.25 ? "\\" : "|";

    stars[`${n}r`].firstChild.nodeValue = ch;
    stars[`${n}r`].style.color = colours[colour[n]];
  }

  function bang(n) {
    let alive = 0;

    for (let i = bits * n; i < bits + bits * n; i++) {
      const z = stars[i].style;
      z.left = `${Xpos[i]}px`;
      z.top = `${Ypos[i]}px`;

      if (decay[i]) decay[i]--;
      else alive++;

      if (decay[i] === 15) z.fontSize = "7px";
      else if (decay[i] === 7) z.fontSize = "2px";
      else if (decay[i] === 1) z.visibility = "hidden";

      Xpos[i] += dX[i];
      Ypos[i] += (dY[i] += 1.25 / intensity[n]);
    }

    if (alive !== bits) {
      setTimeout(() => bang(n), speed);
    }
  }

  function stepthrough(n) {
    const oldx = Xpos[`${n}r`];
    const oldy = Ypos[`${n}r`];

    Xpos[`${n}r`] += dX[`${n}r`];
    Ypos[`${n}r`] -= 4;

    if (Ypos[`${n}r`] < bangheight[n]) {
      const m = Math.floor(Math.random() * 3 * colours.length);
      intensity[n] = 5 + Math.random() * 4;

      for (let i = bits * n; i < bits + bits * n; i++) {
        Xpos[i] = Xpos[`${n}r`];
        Ypos[i] = Ypos[`${n}r`];
        dY[i] = (Math.random() - 0.5) * intensity[n];
        dX[i] = (Math.random() - 0.5) * (intensity[n] - Math.abs(dY[i])) * 1.25;
        decay[i] = 16 + Math.floor(Math.random() * 16);

        const z = stars[i];
        z.style.color =
          m < colours.length
            ? colours[i % 2 ? colour[n] : m]
            : m < 2 * colours.length
            ? colours[colour[n]]
            : colours[i % colours.length];

        z.style.fontSize = "13px";
        z.style.visibility = "visible";
      }

      bang(n);
      launch(n);
    }

    stars[`${n}r`].style.left = `${oldx}px`;
    stars[`${n}r`].style.top = `${oldy}px`;
  }

  window.addEventListener("resize", setDimensions);

  window.addEventListener("load", () => {
    boddie = document.createElement("div");
    boddie.style.position = "fixed";
    boddie.style.top = "0";
    boddie.style.left = "0";
    boddie.style.width = "1px";
    boddie.style.height = "1px";
    boddie.style.overflow = "visible";
    boddie.style.backgroundColor = "transparent";

    document.body.appendChild(boddie);

    setDimensions();

    for (let i = 0; i < bangs; i++) {
      writeFire(i);
      launch(i);
      setInterval(() => stepthrough(i), speed);
    }
  });

})();
