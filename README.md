# Web Engine

A lightweight 2D game engine for the browser, built with TypeScript and the Web Audio / Canvas APIs.

## Tech Stack
<p align="left">
  <img height="35" src="https://img.shields.io/badge/TypeScript-%23007ACC?logo=typescript&logoColor=white&style=for-the-badge"/>
  <img height="35" src="https://img.shields.io/badge/Web%20Audio%20API-black?logo=webaudio&logoColor=white&style=for-the-badge"/>
  <img height="35" src="https://img.shields.io/badge/Canvas%20API-black?logo=html5&logoColor=white&style=for-the-badge"/>
</p>

## Modules
| Module | Description |
| ------ | ----------- |
| `canvas` | Fullscreen canvas setup with resize handling |
| `update` | Fixed or variable timestep game loop |
| `input/keyboard` | Per-frame keyboard state |
| `input/pointer` | Per-frame pointer/mouse state with canvas scaling |
| `audio/context` | Web Audio context initialization and lifecycle |
| `audio/mixer` | Volume and mute controls |
| `audio/playback` | Play and stop sounds |
| `audio/registry` | Load and register sounds by key |
| `assets` | Image loading and tinting |
| `physics/body` | Physics body creation and OBB/AABB adapters |
| `physics/collision` | OBB vs AABB and OBB vs OBB SAT collision |
| `physics/geometry` | Corner and projection math |
| `physics/overlap` | Overlap and containment queries |

## Installation
```bash
npm install github:masonlet/web-engine
```

## License
MIT License - see [LICENSE](./LICENSE) for details.
