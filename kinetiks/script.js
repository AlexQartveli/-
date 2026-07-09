const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealNodes = document.querySelectorAll(".reveal");
if (revealNodes.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.16 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

const eventCounter = document.querySelector("#eventCounter");
if (eventCounter && !prefersReducedMotion) {
  let value = Number(eventCounter.textContent) || 12408;
  setInterval(() => {
    value += Math.floor(Math.random() * 17) + 4;
    eventCounter.textContent = value.toLocaleString("en-US").replaceAll(",", "");
  }, 1300);
}

const canvas = document.querySelector("#kineticGrid");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  const points = [];
  const streams = [];
  const pointCount = 96;
  let width = 0;
  let height = 0;
  let rafId = 0;
  let tick = 0;

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const seed = () => {
    points.length = 0;
    streams.length = 0;

    for (let i = 0; i < pointCount; i += 1) {
      points.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        r: 0.8 + Math.random() * 1.9,
        phase: Math.random() * Math.PI * 2
      });
    }

    for (let i = 0; i < 18; i += 1) {
      streams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: 80 + Math.random() * 180,
        speed: 0.8 + Math.random() * 1.8,
        alpha: 0.08 + Math.random() * 0.14
      });
    }
  };

  const drawBackgroundStreams = () => {
    for (const stream of streams) {
      stream.y += stream.speed;
      if (stream.y - stream.length > height) {
        stream.y = -stream.length;
        stream.x = Math.random() * width;
      }

      const gradient = ctx.createLinearGradient(stream.x, stream.y - stream.length, stream.x, stream.y);
      gradient.addColorStop(0, "rgba(93, 247, 255, 0)");
      gradient.addColorStop(1, `rgba(93, 247, 255, ${stream.alpha})`);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(stream.x, stream.y - stream.length);
      ctx.lineTo(stream.x, stream.y);
      ctx.stroke();
    }
  };

  const drawPoints = () => {
    for (const point of points) {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < -20) point.x = width + 20;
      if (point.x > width + 20) point.x = -20;
      if (point.y < -20) point.y = height + 20;
      if (point.y > height + 20) point.y = -20;

      const pulse = 0.45 + Math.sin(tick * 0.025 + point.phase) * 0.35;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.r + pulse, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(93, 247, 255, ${0.28 + pulse * 0.42})`;
      ctx.fill();
    }
  };

  const drawConnections = () => {
    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);

        if (distance < 150) {
          const alpha = Math.max(0, 0.2 - distance / 760);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(93, 247, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  };

  const drawPulse = () => {
    const radius = 120 + (tick % 260);
    const x = width * 0.72;
    const y = height * 0.28;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(0, 255, 157, ${Math.max(0, 0.16 - radius / 2300)})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const draw = () => {
    tick += 1;
    ctx.clearRect(0, 0, width, height);
    drawBackgroundStreams();
    drawConnections();
    drawPoints();
    drawPulse();

    rafId = requestAnimationFrame(draw);
  };

  const init = () => {
    cancelAnimationFrame(rafId);
    resize();
    seed();
    draw();

    if (prefersReducedMotion) {
      cancelAnimationFrame(rafId);
    }
  };

  window.addEventListener("resize", init, { passive: true });
  init();
}
