# chottoGPU

A minimal WebGPU wrapper that eliminates boilerplate while keeping you in full control. WebGPU port of [chottoGL](https://github.com/Nismit/chottogl).

## Features

- Device, adapter, and canvas context initialization
- Render / compute pipeline helpers with sensible defaults
- Framebuffer management (MRT, MSAA, depth)
- GPU buffer creation with read/write helpers
- Command batching via `frame()`
- Canvas resize handling with `fitWindow()`

## Quick Start

```js
import { chottoGPU } from './chottoGPU.js';

const gpu = await chottoGPU(document.querySelector('canvas'));
gpu.fitWindow();

const pipe = gpu.pipeline({
  vertex: gpu.FULLSCREEN_VERT,
  fragment: myFragmentWGSL,
});

const ubo = gpu.buffer(new Float32Array(4), { uniform: true });

const bg = gpu.device.createBindGroup({
  layout: pipe.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: ubo.buffer } }],
});

gpu.pass((p) => {
  p.setPipeline(pipe);
  p.setBindGroup(0, bg);
  p.draw(3);
});
```

## Development

```bash
npm install
npm run dev        # Start Vite dev server
npm test           # Run Playwright tests
```

Examples are available at `http://localhost:5173/examples/`.

## API

See [chottoGPU.md](chottoGPU.md) for the full API reference.

## License

MIT
