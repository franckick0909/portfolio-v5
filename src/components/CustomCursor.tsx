"use client";

import { useEffect, useRef } from "react";

/*
 * FLUID CURSOR COMPONENT
 * Implement a GPGPU Fluid Simulation (Stable Fluids)
 * Rendered with mix-blend-difference for visible impact everywhere.
 */

export default function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true });
    if (!gl) return;

    // Simulation configuration
    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 512,
      DENSITY_DISSIPATION: 0.985, // Persistance artistique (lent)
      VELOCITY_DISSIPATION: 0.98,
      PRESSURE_DISSIPATION: 0.8,
      PRESSURE_ITERATIONS: 20,
      CURL: 30,
      SPLAT_RADIUS: 0.25,
      SPLAT_FORCE: 6000,
      COLOR: { r: 1, g: 1, b: 1 }, // Noir en mix-blend-difference sur fond blanc
    };

    // --- SHADERS SOURCE ---
    const baseVertexShader = `
      precision highp float;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const splatShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `;

    const advectionShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
      }
    `;

    const divergenceShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `;

    const curlShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float curl = R - L - T + B;
          gl_FragColor = vec4(curl, 0.0, 0.0, 1.0);
      }
    `;

    const vorticityShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = vec2(abs(T) - abs(B), abs(L) - abs(R));
          force /= length(force) + 0.0001;
          force *= curl * C;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `;

    const pressureShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float div = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - div) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `;

    const gradientSubtractShader = `
      precision highp float;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          vel -= vec2(R - L, T - B) * 0.5;
          gl_FragColor = vec4(vel, 0.0, 1.0);
      }
    `;

    const displayShader = `
      precision highp float;
      varying vec2 vUv;
      uniform sampler2D uSource;
      void main () {
          vec3 dye = texture2D(uSource, vUv).rgb;
          float m = max(dye.r, max(dye.g, dye.b));
          gl_FragColor = vec4(dye, m); // Rendu avec alpha basé sur la densité
      }
    `;

    // --- HELPER FUNCTIONS ---
    function createShader(
      gl: WebGLRenderingContext,
      source: string,
      type: number,
    ) {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    function createProgram(
      gl: WebGLRenderingContext,
      vsSource: string,
      fsSource: string,
    ) {
      const vs = createShader(gl, vsSource, gl.VERTEX_SHADER);
      const fs = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
      const program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      return program;
    }

    // --- SETUP BUFFERS ---
    const splatProgram = createProgram(gl, baseVertexShader, splatShader);
    const advectionProgram = createProgram(
      gl,
      baseVertexShader,
      advectionShader,
    );
    const divergenceProgram = createProgram(
      gl,
      baseVertexShader,
      divergenceShader,
    );
    const curlProgram = createProgram(gl, baseVertexShader, curlShader);
    const vorticityProgram = createProgram(
      gl,
      baseVertexShader,
      vorticityShader,
    );
    const pressureProgram = createProgram(gl, baseVertexShader, pressureShader);
    const gradSubtractProgram = createProgram(
      gl,
      baseVertexShader,
      gradientSubtractShader,
    );
    const displayProgram = createProgram(gl, baseVertexShader, displayShader);

    // Quad for rendering
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );

    // --- FBO MANAGEMENT ---
    function createFBO(w: number, h: number) {
      const tex = gl!.createTexture()!;
      gl!.bindTexture(gl!.TEXTURE_2D, tex);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
      gl!.texImage2D(
        gl!.TEXTURE_2D,
        0,
        gl!.RGBA,
        w,
        h,
        0,
        gl!.RGBA,
        gl!.UNSIGNED_BYTE,
        null,
      );

      const fbo = gl!.createFramebuffer()!;
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo);
      gl!.framebufferTexture2D(
        gl!.FRAMEBUFFER,
        gl!.COLOR_ATTACHMENT0,
        gl!.TEXTURE_2D,
        tex,
        0,
      );

      return { tex, fbo, width: w, height: h };
    }

    function createDoubleFBO(w: number, h: number) {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        get read() {
          return fbo1;
        },
        get write() {
          return fbo2;
        },
        swap() {
          [fbo1, fbo2] = [fbo2, fbo1];
        },
      };
    }

    let density: ReturnType<typeof createDoubleFBO>;
    let velocity: ReturnType<typeof createDoubleFBO>;
    let pressure: ReturnType<typeof createDoubleFBO>;
    let divergence: ReturnType<typeof createFBO>;
    let curl: ReturnType<typeof createFBO>;

    function initFramebuffers() {
      const simW = config.SIM_RESOLUTION;
      const simH = Math.round(simW / (window.innerWidth / window.innerHeight));
      const dyeW = config.DYE_RESOLUTION;
      const dyeH = Math.round(dyeW / (window.innerWidth / window.innerHeight));

      density = createDoubleFBO(dyeW, dyeH);
      velocity = createDoubleFBO(simW, simH);
      pressure = createDoubleFBO(simW, simH);
      divergence = createFBO(simW, simH);
      curl = createFBO(simW, simH);
    }

    initFramebuffers();

    // --- MOUSE TRACKING ---
    let mouse = { x: 0.5, y: 0.5, dx: 0, dy: 0, down: false, moved: false };

    const onMouseMove = (e: MouseEvent) => {
      mouse.dx = (e.clientX / window.innerWidth - mouse.x) * config.SPLAT_FORCE;
      mouse.dy =
        (1.0 - e.clientY / window.innerHeight - mouse.y) * config.SPLAT_FORCE;
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = 1.0 - e.clientY / window.innerHeight;
      mouse.moved = true;
    };

    const onMouseDown = () => {
      mouse.down = true;
    };
    const onMouseUp = () => {
      mouse.down = false;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // --- SIMULATION STEP ---
    function blit(target: WebGLFramebuffer | null, clear = false) {
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target);
      if (clear) {
        gl!.clearColor(0, 0, 0, 0);
        gl!.clear(gl!.COLOR_BUFFER_BIT);
      }

      const program = gl!.getParameter(gl!.CURRENT_PROGRAM);
      const positionLoc = gl!.getAttribLocation(program, "aPosition");
      gl!.enableVertexAttribArray(positionLoc);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, quadBuffer);
      gl!.vertexAttribPointer(positionLoc, 2, gl!.FLOAT, false, 0, 0);

      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }

    function splat(
      x: number,
      y: number,
      dx: number,
      dy: number,
      color: { r: number; g: number; b: number },
      radius: number,
    ) {
      gl!.viewport(0, 0, velocity.read.width, velocity.read.height);
      gl!.useProgram(splatProgram);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, velocity.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(splatProgram, "uTarget"), 0);

      gl!.uniform1f(
        gl!.getUniformLocation(splatProgram, "aspectRatio"),
        canvas!.width / canvas!.height,
      );
      gl!.uniform2f(gl!.getUniformLocation(splatProgram, "point"), x, y);
      gl!.uniform3f(gl!.getUniformLocation(splatProgram, "color"), dx, dy, 0);
      gl!.uniform1f(gl!.getUniformLocation(splatProgram, "radius"), radius);
      blit(velocity.write.fbo);
      velocity.swap();

      gl!.viewport(0, 0, density.read.width, density.read.height);

      gl!.activeTexture(gl!.TEXTURE0);
      gl!.bindTexture(gl!.TEXTURE_2D, density.read.tex);
      gl!.uniform1i(gl!.getUniformLocation(splatProgram, "uTarget"), 0);

      gl!.uniform3f(
        gl!.getUniformLocation(splatProgram, "color"),
        color.r,
        color.g,
        color.b,
      );
      blit(density.write.fbo);
      density.swap();

      // Unbind
      gl!.bindTexture(gl!.TEXTURE_2D, null);
    }

    let lastUpdateTime = Date.now();

    function update() {
      if (!canvas || !gl) return;
      const now = Date.now();
      const dt = Math.min((now - lastUpdateTime) / 1000, 0.016);
      lastUpdateTime = now;

      gl.disable(gl.BLEND);

      // 1. Advection
      // Velocity advection
      gl.viewport(0, 0, velocity.read.width, velocity.read.height);
      gl.useProgram(advectionProgram);
      gl.uniform2f(
        gl.getUniformLocation(advectionProgram, "texelSize"),
        1 / velocity.read.width,
        1 / velocity.read.height,
      );

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, "uVelocity"), 0);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, "uSource"), 0);

      gl.uniform1f(gl.getUniformLocation(advectionProgram, "dt"), dt);
      gl.uniform1f(
        gl.getUniformLocation(advectionProgram, "dissipation"),
        config.VELOCITY_DISSIPATION,
      );
      blit(velocity.write.fbo);
      velocity.swap();

      // Density advection
      gl.viewport(0, 0, density.read.width, density.read.height);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, "uVelocity"), 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(gl.getUniformLocation(advectionProgram, "uSource"), 1);

      gl.uniform1f(gl.getUniformLocation(advectionProgram, "dt"), dt);
      gl.uniform1f(
        gl.getUniformLocation(advectionProgram, "dissipation"),
        config.DENSITY_DISSIPATION,
      );
      blit(density.write.fbo);
      density.swap();

      // Unbind textures from units to avoid feedback loops
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // 2. Interaction (Splat)
      if (mouse.moved) {
        splat(
          mouse.x,
          mouse.y,
          mouse.dx,
          mouse.dy,
          config.COLOR,
          config.SPLAT_RADIUS / 200,
        );
        mouse.moved = false;
      }
      if (mouse.down) {
        splat(
          mouse.x,
          mouse.y,
          (Math.random() - 0.5) * 800,
          (Math.random() - 0.5) * 800,
          config.COLOR,
          config.SPLAT_RADIUS / 10,
        );
      }

      // 3. Curl & Vorticity
      gl.viewport(0, 0, velocity.read.width, velocity.read.height);
      gl.useProgram(curlProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(curlProgram, "uVelocity"), 0);
      gl.uniform2f(
        gl.getUniformLocation(curlProgram, "texelSize"),
        1 / velocity.read.width,
        1 / velocity.read.height,
      );
      blit(curl.fbo);
      gl.bindTexture(gl.TEXTURE_2D, null);

      gl.useProgram(vorticityProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, curl.tex);
      gl.uniform1i(gl.getUniformLocation(vorticityProgram, "uVelocity"), 0);
      gl.uniform1i(gl.getUniformLocation(vorticityProgram, "uCurl"), 1);
      gl.uniform1f(
        gl.getUniformLocation(vorticityProgram, "curl"),
        config.CURL,
      );
      gl.uniform1f(gl.getUniformLocation(vorticityProgram, "dt"), dt);
      blit(velocity.write.fbo);
      velocity.swap();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // 4. Divergence
      gl.useProgram(divergenceProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(divergenceProgram, "uVelocity"), 0);
      gl.uniform2f(
        gl.getUniformLocation(divergenceProgram, "texelSize"),
        1 / velocity.read.width,
        1 / velocity.read.height,
      );
      blit(divergence.fbo);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // 5. Pressure solver
      gl.useProgram(pressureProgram);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, divergence.tex);
      gl.uniform1i(gl.getUniformLocation(pressureProgram, "uDivergence"), 1);
      gl.uniform2f(
        gl.getUniformLocation(pressureProgram, "texelSize"),
        1 / velocity.read.width,
        1 / velocity.read.height,
      );
      for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
        gl.uniform1i(gl.getUniformLocation(pressureProgram, "uPressure"), 0);
        blit(pressure.write.fbo);
        pressure.swap();
      }
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // 6. Gradient Subtraction
      gl.useProgram(gradSubtractProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, pressure.read.tex);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velocity.read.tex);
      gl.uniform1i(gl.getUniformLocation(gradSubtractProgram, "uPressure"), 0);
      gl.uniform1i(gl.getUniformLocation(gradSubtractProgram, "uVelocity"), 1);
      gl.uniform2f(
        gl.getUniformLocation(gradSubtractProgram, "texelSize"),
        1 / velocity.read.width,
        1 / velocity.read.height,
      );
      blit(velocity.write.fbo);
      velocity.swap();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, null);

      // 7. Render to screen
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(displayProgram);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, density.read.tex);
      gl.uniform1i(gl.getUniformLocation(displayProgram, "uSource"), 0);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      blit(null, true);

      requestAnimationFrame(update);
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFramebuffers();
    };

    window.addEventListener("resize", resize);
    resize();
    update();

    // Hide native cursor
    document.body.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", resize);
      document.body.style.cursor = "auto";
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none mix-blend-difference opacity-80 w-full h-full"
      style={{ filter: "brightness(1) contrast(1.2)" }}
    />
  );
}
