import { useEffect, useRef } from 'react';

type Node3D = {
  x: number;
  y: number;
  z: number;
  size: number;
  hue: 'cream' | 'coral' | 'gold';
};

const nodes: Node3D[] = Array.from({ length: 92 }, (_, index) => {
  const a = index * 2.399963;
  const r = 0.18 + ((index * 29) % 100) / 145;
  return {
    x: Math.cos(a) * r,
    y: Math.sin(a) * r * 0.72,
    z: -0.45 + ((index * 37) % 100) / 100,
    size: 1.8 + ((index * 11) % 100) / 48,
    hue: index % 13 === 0 ? 'coral' : index % 9 === 0 ? 'gold' : 'cream',
  };
});

const project = (node: Node3D, width: number, height: number, time: number, px: number, py: number, scroll: number) => {
  const spin = time * 0.42 + scroll * 1.15;
  const pitch = scroll * 0.75 + py * 0.55;
  const cos = Math.cos(spin + node.z * 0.25);
  const sin = Math.sin(spin + node.z * 0.25);
  const x = node.x * cos - node.z * sin;
  const z1 = node.x * sin + node.z * cos;
  const y = node.y * Math.cos(pitch) - z1 * Math.sin(pitch) * 0.42;
  const z = node.y * Math.sin(pitch) + z1 * Math.cos(pitch);
  const depth = 1.08 + z;
  const scale = 0.96 / depth;
  const cx = width * (0.58 + px * 0.1 - scroll * 0.06);
  const cy = height * (0.52 + py * 0.08 + scroll * 0.12);

  return {
    x: cx + x * Math.min(width, height) * scale,
    y: cy + y * Math.min(width, height) * scale,
    scale,
    depth,
    alpha: Math.max(0.1, Math.min(1, 1.18 - depth * 0.62)),
    hue: node.hue,
    size: node.size,
  };
};

const colorFor = (hue: Node3D['hue'], alpha: number) => {
  if (hue === 'coral') return `rgba(228,87,61,${alpha})`;
  if (hue === 'gold') return `rgba(236,211,64,${alpha})`;
  return `rgba(244,243,239,${alpha})`;
};

export default function DigitalCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollProgress = 0;
    let targetScroll = 0;
    let animation = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      targetX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
      targetY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
    };

    const onScroll = () => {
      const rect = canvas.getBoundingClientRect();
      const travel = Math.max(1, window.innerHeight + rect.height);
      targetScroll = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / travel));
    };

    const onPointerLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const drawRing = (time: number) => {
      const cx = width * (0.58 + pointerX * 0.08 - scrollProgress * 0.08);
      const cy = height * (0.52 + pointerY * 0.06 + scrollProgress * 0.12);
      const radius = Math.min(width, height) * (0.34 + scrollProgress * 0.12);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 0.16);
      ctx.scale(1, 0.34);
      ctx.strokeStyle = 'rgba(244,243,239,0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.strokeStyle = 'rgba(228,87,61,0.28)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.72, Math.PI * 0.15, Math.PI * 1.35);
      ctx.stroke();
      ctx.restore();
    };

    const draw = () => {
      frame += reducedMotion ? 0 : 0.012;
      pointerX += (targetX - pointerX) * 0.055;
      pointerY += (targetY - pointerY) * 0.055;
      scrollProgress += (targetScroll - scrollProgress) * 0.06;

      ctx.clearRect(0, 0, width, height);
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, '#302f2d');
      bg.addColorStop(0.48, '#1a1918');
      bg.addColorStop(1, '#090908');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(width * (0.5 + pointerX * 0.12), height * (0.38 + pointerY * 0.1 + scrollProgress * 0.18), 0, width * 0.5, height * 0.44, width * 0.72);
      glow.addColorStop(0, 'rgba(236,211,64,0.18)');
      glow.addColorStop(0.42, 'rgba(228,87,61,0.13)');
      glow.addColorStop(1, 'rgba(26,25,24,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      drawRing(frame);

      const projected = nodes
        .map((node) => project(node, width, height, frame, pointerX, pointerY, scrollProgress))
        .sort((a, b) => b.depth - a.depth);

      ctx.lineWidth = 1;
      for (let i = 0; i < projected.length; i += 1) {
        const a = projected[i];
        for (let j = i + 1; j < Math.min(projected.length, i + 7); j += 1) {
          const b = projected[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 86) {
            const alpha = (1 - distance / 86) * 0.18 * Math.min(a.alpha, b.alpha);
            ctx.strokeStyle = `rgba(244,243,239,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const point of projected) {
        const alpha = point.alpha * 0.8;
        const radius = point.size * point.scale * 2.4;
        ctx.shadowBlur = point.hue === 'cream' ? 8 : 18;
        ctx.shadowColor = colorFor(point.hue, 0.55);
        ctx.fillStyle = colorFor(point.hue, alpha);
        ctx.beginPath();
        ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!reducedMotion) animation = requestAnimationFrame(draw);
    };

    resize();
    onScroll();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('blur', onPointerLeave);

    return () => {
      cancelAnimationFrame(animation);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('blur', onPointerLeave);
    };
  }, []);

  return (
    <div className="premium-orb" aria-hidden="true">
      <canvas ref={ref} className="digital-canvas" />
      <div className="orb-shell">
        <div className="orb-card orb-card-a">
          <span>Data vault</span>
          <strong>Encrypted storage</strong>
        </div>
        <div className="orb-card orb-card-b">
          <span>Access control</span>
          <strong>Wallet gated</strong>
        </div>
        <div className="orb-core" />
      </div>
      <div className="orb-floor" />
    </div>
  );
}
